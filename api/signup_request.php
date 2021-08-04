<?php
header('content-type:text/html;charset=utf-8');
session_start();
include './class/ConnectMysqli.php';
include './class/UserSessionAction.php';
include_once './aliyun-php-sdk-core/Config.php';

use afs\Request\V20180112 as Afs;

function get_client_ip()
{
    $client_ip = "unknown";
    if (getenv("HTTP_CLIENT_IP") && strcasecmp(getenv("HTTP_CLIENT_IP"), "unknown")) {
        $client_ip = getenv("HTTP_CLIENT_IP");
    } else if (getenv("HTTP_X_FORWARDED_FOR") && strcasecmp(getenv("HTTP_X_FORWARDED_FOR"), "unknown")) {
        $client_ip = getenv("HTTP_X_FORWARDED_FOR");
    } else if (getenv("REMOTE_ADDR") && strcasecmp(getenv("REMOTE_ADDR"), "unknown")) {
        $client_ip = getenv("REMOTE_ADDR");
    } else if (isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] && strcasecmp($_SERVER['REMOTE_ADDR'], "unknown")) {
        $client_ip = $_SERVER['REMOTE_ADDR'];
    } else {
        $client_ip = "unknown";
    }
    return ($client_ip);
}

$iClientProfile = DefaultProfile::getProfile("cn-hangzhou", "LTAI5tQkdPLpmY5YdX6AzAxk", "auo8ExAgx0UuY9zyNonjCSDn9U9JGg");
$client = new DefaultAcsClient($iClientProfile);
DefaultProfile::addEndpoint("cn-hangzhou", "cn-hangzhou", "afs", "afs.aliyuncs.com");
$ip = get_client_ip();
$session_id = $_POST['session_id'];
$token = $_POST['token'];
$sig = $_POST['sig'];
$scene = $_POST['scene'];

$request = new Afs\AuthenticateSigRequest();
$request->setSessionId($session_id); // 必填参数，从前端获取，不可更改，android和ios只传这个参数即可
$request->setToken($token); // 必填参数，从前端获取，不可更改
$request->setSig($sig); // 必填参数，从前端获取，不可更改
$request->setScene($scene); // 必填参数，从前端获取，不可更改
$request->setAppKey("FFFF0N0000000000A0D6"); //必填参数，后端填写
$request->setRemoteIp($ip); //必填参数，后端填写

$response = $client->getAcsResponse($request); //返回code 100表示验签通过，900表示验签失败
// print_r( $response);
if($response->Code != 100){
    echo "Please perform slide verification.";
    die(0);
}
$db = ConnectMysqli::getIntance();
$uid = UserSessionAction::getIntance();
if ($uid->getStatus()) {
    echo "Have logged in."; // Have logged in
    die(0);
}
$usrname = $_POST['username'];
$password = $_POST["password"];
$email = $_POST["email"];
$usrname = trim($usrname);
$password = trim($password);
$email = trim($email);
$usr_len = strlen($usrname);
$pwd_len = strlen($password);

$str_reg = "<,>/?~`!@#%^&*()+|\='";
if (similar_text($usrname, $str_reg) > 0) {
    echo "Illegal username format."; // Illegal username format.
    session_write_close();
    die(0);
}
function spamcheck($field)
{
    //filter_var() sanitizes the e-mail 
    //address using FILTER_SANITIZE_EMAIL
    $field = filter_var($field, FILTER_SANITIZE_EMAIL);
    //filter_var() validates the e-mail
    //address using FILTER_VALIDATE_EMAIL
    if (filter_var($field, FILTER_VALIDATE_EMAIL)) {
        return TRUE;
    } else {
        return FALSE;
    }
}

$mailcheck = spamcheck($_REQUEST['email']);
if ($mailcheck == FALSE) {
    echo "Illegal e-mail format."; //Illegal e-mail format.
    die();
}
if ($usr_len >= 4 && $usr_len <= 20 && $pwd_len == 32) {
    $sql = "select * from user where username = '" . $usrname . "'";
    $list = $db->getAll($sql);
    if (empty($list)) {
        $sql = "select * from user where email = '" . $email . "'";
        $list = $db->getAll($sql);
        if(!empty($list)){
            echo "Registered e-mail.";// Registered e-mail.
        }else{
            $sql = "INSERT INTO user (username, password,email) VALUES ('".$usrname."', '".$password."','".$email."')";
            $db->query($sql);
            $sql = "select * from user where username = '" . $usrname."'";
            $list = $db->getAll($sql);
            if (!empty($list)) {
                echo 0;
                $uid->setSessionById($list[0]["id"]);
            } else {
                echo "Database Wrong.";
            }
        }
    } else {
        echo "Existing username."; // Existing username.
    }
} else {
    echo "Illegal length of username or password."; //Illegal length of username or password.
}
session_write_close();

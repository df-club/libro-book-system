<?php
header('content-type:text/html;charset=utf-8');
session_start();
include './class/ConnectMysqli.php';
include './class/UserSessionAction.php';
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

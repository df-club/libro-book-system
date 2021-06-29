<?php
header('content-type:text/html;charset=utf-8');
session_start();
include './class/ConnectMysqli.php';
include './class/UserSessionAction.php';
$db = ConnectMysqli::getIntance();
$uid = UserSessionAction::getIntance();
if ($uid->getStatus()) {
    echo 3;
    die(0);
}
$usrname = $_POST['username'];
$password = $_POST["password"];
$usrname = trim($usrname);
$password = trim($password);
$usr_len = strlen($usrname);
$pwd_len = strlen($password);
$str_reg="<,>/?~`!@#%^&*()+|\='";
if(similar_text($usrname,$str_reg)>0){
    echo 1;
    session_write_close();
    die(0);
}
if ($usr_len >= 4 && $usr_len <= 20 && $pwd_len == 32) {
    $sql = "select * from user where username = '" . $usrname . "' AND password = '" . $password . "'";
    $list = $db->getAll($sql);

    if (!empty($list)) {
        echo 0;
        $uid->setSessionById($list[0]["id"]);
    } else {
        echo 1; // Wrong username or password.
    }
} else {
    echo 2; //Illegal length of username or password.
}

session_write_close();


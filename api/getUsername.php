<?php
header('content-type:text/html;charset=utf-8');
session_start();
include './class/ConnectMysqli.php';
include './class/UserSessionAction.php';
$db = ConnectMysqli::getIntance();
$uid = UserSessionAction::getIntance();
if(!isset($_POST["username"])){
    die(0);
}
if (!$uid->getStatus()) {
    echo 0;
    die(0);
}
$uid->init();
$sql = "select * from user where id = '" . $uid -> uid ."'";
$list = $db->getAll($sql);

if (!empty($list)) {
    echo $list[0]["username"];
} else {
    $uid -> destroySessionUID();
    echo 0;
}

session_write_close();


<?php
header('content-type:text/html;charset=utf-8');
session_start();
include './class/ConnectMysqli.php';
include './class/UserSessionAction.php';
$uid = UserSessionAction::getIntance();
$uid ->  init();
if(!isset($_POST["logout"])){
    die(0);
}
$uid -> destroySessionUID();
$uid -> init();
if(!$uid -> getStatus()){
    echo "success";
}
session_write_close();

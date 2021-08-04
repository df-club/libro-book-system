
<?php
header('content-type:text/html;charset=utf-8');
session_start();
include './class/ConnectMysqli.php';
include './class/UserSessionAction.php';
$uid = UserSessionAction::getIntance();
$uid ->  init();
if(!isset($_POST["authority"])){
    die(0);
}
if(!isset($_SESSION["uid"])||!isset($_SESSION["authority"])){
    echo "wrong"; // unset uid or authority
}
echo $_SESSION["authority"];

session_write_close();

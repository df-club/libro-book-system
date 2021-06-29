<?php
header('content-type:text/html;charset=utf-8');
session_start();
include './class/UserSessionAction.php';
$uid = UserSessionAction::getIntance();
if(!isset($_GET["checkLogged"])){
    die(0);
}
if ($uid->getStatus()) {
    echo 0;
} else {
    echo 1;
}

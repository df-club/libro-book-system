
<?php
header('content-type:text/html;charset=utf-8');
session_start();
include './class/ConnectMysqli.php';
include './class/UserSessionAction.php';
$uid = UserSessionAction::getIntance();
$uid ->  init();
if(!$uid -> getStatus()){
    session_write_close();
    die(0);
}
$db = ConnectMysqli::getIntance();
$index = $_POST["index"];
$q = $_POST["q"];
$sql = "SELECT * FROM book WHERE {$index} LIKE '%{$q}%'";
$list = $db->getAll($sql);
echo json_encode($list);
session_write_close();

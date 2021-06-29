<?php
class UserSessionAction{
    private static $UserSession = false;
    private  $isLogin = false;
    private function __construct($config = array())
    {
        if(isset($_SESSION["uid"])){
            $this->isLogin = true;
        }
    }
    private function __clone()
    {
    }
    public static function getIntance(){
        if (self::$UserSession == false) {
            self::$UserSession = new self;
        }
        return self::$UserSession;
    }
    public function getStatus(){
        if(isset($_SESSION["uid"])){
            $this->isLogin = true;
        }else{
            $this->isLogin = false;
        }
        return $this->isLogin;
    }
    public function destroySessionUID(){
        if(isset($_SESSION["uid"])){
            unset($_SESSION['uid']);
            $this->isLogin = false;
            return true;
        }
        return false;
    }
    public function setSessionById($uid){
        if(isset($_SESSION["uid"])){
            return false;
        }
        $_SESSION["uid"] = $uid;
    }
}
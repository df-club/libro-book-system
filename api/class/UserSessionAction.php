<?php
class UserSessionAction{
    private static $UserSession = false;
    private  $isLogin = false;
    public $uid;
    public $authority;
    private function __construct($config = array())
    {
        if(isset($_SESSION["uid"])){
            $this->isLogin = true;
            $this -> uid = $_SESSION["uid"];
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
    public function init(){
        if(isset($_SESSION["uid"])){
            $this->isLogin = true;
            $this -> uid = $_SESSION["uid"];
            $this -> authority = $_SESSION["authority"];
        }
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
            unset($_SESSION['authority']);
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
        $this -> uid = $uid;
    }
    public function setAuthority($auth){
        if(!isset($_SESSION["uid"])){
            return false;
        }
        $_SESSION["authority"] = $auth;
    }
}
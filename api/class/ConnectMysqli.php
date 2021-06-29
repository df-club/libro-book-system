<?php
class ConnectMysqli
{
    //私有的属性
    private static $dbcon = false;
    private $host;
    private $port;
    private $user;
    private $pass;
    private $db;
    private $charset;
    private $link;
    //私有的构造方法
    private function __construct($config = array())
    {
        $this->host = 'localhost';
        $this->port = '3306';
        $this->user = 'root';
        $this->pass = '123456';
        $this->db = 'libro';
        $this->charset = 'utf8';

        $this->db_connect();
        //选择数据库
        $this->db_usedb();
        //设置字符集
        $this->db_charset();
    }
    //连接数据库
    private function db_connect()
    {
        $this->link = mysqli_connect($this->host . ':' . $this->port, $this->user, $this->pass);
        if (!$this->link) {
            echo "数据库连接失败<br>";
            echo "错误编码" . mysqli_errno($this->link) . "<br>";
            echo "错误信息" . mysqli_error($this->link) . "<br>";
            exit;
        }
    }

    private function db_charset()
    {
        mysqli_query($this->link, "set names {$this->charset}");
    }

    private function db_usedb()
    {
        mysqli_query($this->link, "use {$this->db}");
    }

    private function __clone()
    {
        die('clone is not allowed');
    }

    public static function getIntance()
    {
        if (self::$dbcon == false) {
            self::$dbcon = new self;
        }
        return self::$dbcon;
    }

    public function query($sql)
    {
        $res = mysqli_query($this->link, $sql);
        if (!$res) {
            echo "sql语句执行失败<br>";
            echo "错误编码是" . mysqli_errno($this->link) . "<br>";
            echo "错误信息是" . mysqli_error($this->link) . "<br>";
        }
        return $res;
    }

    public function p($arr)
    {
        echo "<pre>";
        print_r($arr);
        echo "</pre>";
    }
    public function v($arr)
    {
        echo "<pre>";
        var_dump($arr);
        echo "</pre>";
    }

    public function getInsertid()
    {
        return mysqli_insert_id($this->link);
    }

    public function getOne($sql)
    {
        $query = $this->query($sql);
        return mysqli_free_result($query);
    }

    public function getRow($sql, $type = "assoc")
    {
        $query = $this->query($sql);
        if (!in_array($type, array("assoc", 'array', "row"))) {
            die("mysqli_query error");
        }
        $funcname = "mysqli_fetch_" . $type;
        return $funcname($query);
    }

    public function getFormSource($query, $type = "assoc")
    {
        if (!in_array($type, array("assoc", "array", "row"))) {
            die("mysqli_query error");
        }
        $funcname = "mysqli_fetch_" . $type;
        return $funcname($query);
    }

    public function getAll($sql)
    {
        $query = $this->query($sql);
        $list = array();
        while ($r = $this->getFormSource($query)) {
            $list[] = $r;
        }
        return $list;
    }

    public function insert($table, $data)
    {

        $key_str = '';
        $v_str = '';
        foreach ($data as $key => $v) {
            if (empty($v)) {
                die("error");
            }

            $key_str .= $key . ',';
            $v_str .= "'$v',";
        }
        $key_str = trim($key_str, ',');
        $v_str = trim($v_str, ',');

        $sql = "insert into $table ($key_str) values ($v_str)";
        $this->query($sql);

        return $this->getInsertid();
    }

    public function deleteOne($table, $where)
    {
        if (is_array($where)) {
            foreach ($where as $key => $val) {
                $condition = $key . '=' . $val;
            }
        } else {
            $condition = $where;
        }
        $sql = "delete from $table where $condition";
        $this->query($sql);

        return mysqli_affected_rows($this->link);
    }

    public function deleteAll($table, $where)
    {
        if (is_array($where)) {
            foreach ($where as $key => $val) {
                if (is_array($val)) {
                    $condition = $key . ' in (' . implode(',', $val) . ')';
                } else {
                    $condition = $key . '=' . $val;
                }
            }
        } else {
            $condition = $where;
        }
        $sql = "delete from $table where $condition";
        $this->query($sql);
        return mysqli_affected_rows($this->link);
    }

    public function update($table, $data, $where)
    {
        $str = '';
        foreach ($data as $key => $v) {
            $str .= "$key='$v',";
        }
        $str = rtrim($str, ',');

        $sql = "update $table set $str where $where";
        $this->query($sql);

        return mysqli_affected_rows($this->link);
    }
}
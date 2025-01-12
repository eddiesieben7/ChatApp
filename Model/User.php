<?php


// Model/User.php
namespace Model;
use JsonSerializable;
class User implements JsonSerializable {
    private $username;
    private $foo;
    public function __construct($username)
    {
        $this->username = $username;
    }

    public function getUsername() {
        return $this->username;
    }

    public function getFoo() {
        return $this->foo;
    }

    public function setFoo($value) {
        $this->foo = $value;
    }

    public function jsonSerialize():mixed {
        return get_object_vars($this);
    }

    public static function fromJson($data) {
        $user = new User("");
        foreach ($data as $key => $value) {
            $user->{$key} = $value;
        }
        return $user;
    }
    
}


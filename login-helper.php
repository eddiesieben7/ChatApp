<?php
require("start.php");
var_dump($service->login("Tom", "12345678"));

$_SESSION['user']='Tom';

?>
<?php
init_set('display_errors', 1);
init_set('display_startup_errors', 1);
error_reporting(E_ALL);


//Standartroutine jeder Datei
//Nutzung des Backends

spl_autoload_register (function ($class_name) {
    include str_replace('\\', '/', $class) . '.php';
});

session_start();    


<?php
session_start();

spl_autoload_register(function ($class) {
    include str_replace('\\', '/', $class) . '.php';
});

// Die Collection-ID aus Ihrer Datei:
define('CHAT_SERVER_URL', 'https://online-lectures-cs.thi.de/chat/');
define('CHAT_COLLECTION_ID', 'ba1ad2f8-7e88-4ce4-92c2-6399ab16f647');

$service = new Utils\BackendService(CHAT_SERVER_URL, CHAT_COLLECTION_ID);
?>
<?php
// Fehlerberichterstattung aktivieren
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Autoload für Klassen
spl_autoload_register(function ($class_name) {
    include str_replace('\\', '/', $class_name) . '.php';
});

// Session starten
session_start();

// Backend-Konfiguration
define('CHAT_SERVER_URL', 'https://online-lectures-cs.thi.de/chat/');
define('CHAT_COLLECTION_ID', 'ba1ad2f8-7e88-4ce4-92c2-6399ab16f647');

// Initialisieren des Backend-Dienstes
$service = new Utils\BackendService(CHAT_SERVER_URL, CHAT_COLLECTION_ID);
?>
<?php
require "start.php";

if (!isset($_SESSION['user'])) {
    http_response_code(401); // not authorized
    header('Content-Type: application/json');
    echo json_encode(["message" => "No user in session stored"]);
    return;
}


// Backend aufrufen
try {
    $friends = $service->loadFriends();

    // Wenn keine Freunde vorhanden sind, wird eine leere Liste zurückgegeben
    if (empty($friends)) {
        http_response_code(200); // Kein Fehler, nur keine Freunde
        echo json_encode([]);
    } else {
        http_response_code(200); // Erfolgreich
        echo json_encode($friends);
    }
} catch (Exception $e) {
    // Fehler im Backend behandeln
    http_response_code(500); // Interner Serverfehler
    echo json_encode([
        "message" => "Could not load friends, see PHP error log for details",
        "error" => $e->getMessage()
    ]);
}
?>



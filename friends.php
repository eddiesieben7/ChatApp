<?php
require("start.php");

// Überprüfen, ob der Nutzer angemeldet ist
if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit();
}


$error = null;

// Query-Parameter verarbeiten
if (isset($_GET['action']) && isset($_GET['friend'])) {
    $action = $_GET['action'];
    $friend = $_GET['friend'];

    try {
        if ($action === 'accept') {
            $service->friendAccept($friend);
        } elseif ($action === 'reject') {
            $service->friendDismiss($friend);
        }
    } catch (Exception $e) {
        $error = "Error processing request: " . $e->getMessage();
    }

    // Nach der Verarbeitung zurück zur Hauptseite, um ein Neuladen der Aktionen zu verhindern
    header("Location: friends.php");
    exit();
}


try {
    // Freunde und Freundschaftsanfragen laden
    $friends = $service->loadFriends();
    $acceptedFriends = array_filter($friends, fn($friend) => $friend->getStatus() === 'accepted');
    $pendingRequests = array_filter($friends, fn($friend) => $friend->getStatus() === 'requested');
} catch (Exception $e) {
    $error = "Error loading friends: " . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Friends</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>



    <div class="content">
        <h1 class="left">Friends</h1>
        <a class="logout" href="logout.php">&lt; Logout</a> |
        <a class="text" href="Login.html">Settings</a>
        <hr>

        <!-- Freundeliste -->
        <div class="friendlist">
            
            <ul>
               
                        <li class="friend-item">
                            
                        </li>
                    
            </ul>
        </div>

        <!-- Freundschaftsanfragen -->
        	
        <hr>
        <h2 class="left">New Requests</h2>
        <ol>
        </ol>
        <hr>
        <form>
            <div class="bar">
                <input 
                    class="actionbar" placeholder="Add Friend to List" name="friendRequestName" id="friend-request-name" list="friend-selector">
                <datalist id="friend-selector"> 
                    
                </datalist>
                <button type="button" class="greybuttonroundaction">Add</button>
            </div>
        </form>
    </div>
    <script src="friends.js"></script> 
    
</body>
</html>
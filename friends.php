<?php


require("start.php");

// Überprüfen, ob der Nutzer angemeldet ist
if (!isset($_SESSION['user']['username'])) {
    header("Location: login.php");
    exit();
}

$currentUser = $_SESSION['user']['username'];

$error = "";

// Query-Parameter verarbeiten
if (isset($_GET['action']) && isset($_GET['friend'])) {
    $action = $_GET['action'];
    $friend = htmlspecialchars($_GET['friend']);

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
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <script>
    const currentUser = <?= json_encode($_SESSION['user']['username']); ?>;
</script>

</head>
<body>



    <div class="content">
    <h1 class="left">
            <?= htmlspecialchars($_SESSION['user']['username']) ?>'s Friends
        </h1>
        <a class="logout" href="logout.php">&lt; Logout</a> |
        <a class="text" href="Login.php">Settings</a>
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
        <form method= "post" action="friends.php" >
            <div class="bar">
                <input 
                    class="actionbar" placeholder="Add Friend to List" name="friendRequestName" id="friend-request-name" list="friend-selector">
                <datalist id="friend-selector"> 
                
                
                    
                </datalist>
                <button type="submit" class="greybuttonroundaction">Add</button>
            </div>
        </form>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>   
    <script src="friends.js"></script> 
    
</body>
</html>


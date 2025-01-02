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
<body class="bg-light">



<div class="container-md mt-3 ">
        <h1 class="left">
            <?= htmlspecialchars($_SESSION['user']['username']) ?>'s Friends
        </h1>

        <div class="btn-group btn-group-sm mb-3 mt-2 ">
        <a class="btn btn-secondary fs-6" href="logout.php">&lt; Logout</a> 
        <a class="btn btn-secondary fs-6" href="Login.php">Settings</a>
        </div>
        <hr>

        <!-- Freundeliste -->
        
            
            <ul class= "list-group list">
               
                        <li class="friend-item">
                            
                        </li>
                    
            </ul>
        

        <!-- Freundschaftsanfragen -->
        	
        <hr>
        <h2 class="left">New Requests</h2>
        <ol class="list-group list">
        
        </ol>


        <hr>
        <form method= "post" action="friends.php" >
            <div class="input-group mb-3">
                <input 
                    class="form-control" placeholder="Add Friend to List" name="friendRequestName" id="friend-request-name" list="friend-selector">
                <datalist id="friend-selector"> 
                
                
                    
                </datalist>
                <button type="submit" class="btn btn-primary">Add</button>
            </div>
        </form>

        <!-- Modal für Freundschaftsanfragen -->

<div class="modal" tabindex="-1" id="friendRequestModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="friendModalTitle">Friend Request</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="friendModalBody">
        <!-- Hier wird der Name des Freundes eingefügt -->
      </div>
      <div class="modal-footer" id="friendModalFooter">
        <!-- Hier werden die Buttons eingefügt -->
      </div>
    </div>
  </div>
</div>


    </div>

    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>   
    <script src="friends.js"></script> 
    
</body>
</html>


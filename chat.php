<?php
require("start.php");

if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit();
}

if (!isset($_GET['friend']) || empty($_GET['friend'])) {
    header("Location: friends.php");
    exit();
}

$chatPartner = htmlspecialchars($_GET['friend']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat with <?= $chatPartner ?></title>
    <link rel="stylesheet" href="style.css">
    <script src="js/chat.js" defer></script>
</head>
<body>
    <div class="content">
        <h1 class="center">Chat with <?= $chatPartner ?></h1>
        <ul class="message-list">
            <!-- Dynamische Nachrichten -->
        </ul>
        <form id="chat-form">
            <input type="text" id="message-input" placeholder="Type your message..." required>
            <button type="submit" class="bluebutton">Send</button>
        </form>
    </div>
</body>
</html>
<?php
require("start.php");

$error = ""; // Variable zur Speicherung von Fehlermeldungen

// Überprüfen, ob der Nutzer angemeldet ist
if (!isset($_SESSION['user']['username'])) {
    header("Location: login.php");
    exit();
}

$currentUser = $_SESSION['user']['username']; // Aktueller Benutzer
$chatPartner = htmlspecialchars($_GET['friend'] ?? '');

// Chat-Partner prüfen
if (empty($chatPartner)) {
    header("Location: friends.php");
    exit();
}

// Freund entfernen
if (isset($_GET['action']) && $_GET['action'] === 'remove-friend') {
    if ($service->removeFriend($chatPartner)) {
        header("Location: friends.php");
        exit();
    } else {
        $error = "Failed to remove friend.";
    }
}

$messages = [];

try {
    // Nachrichten laden
    $messages = $service->loadMessages($chatPartner);
} catch (Exception $e) {
    $error = "Error loading messages: " . $e->getMessage();
}

// Nachricht senden
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['message'])) {
    $messageContent = trim($_POST['message']);
    if (!empty($messageContent)) {
        try {
            $service->sendMessage((object)[
                "msg" => $messageContent,
                "to" => $chatPartner
            ]);
            header("Location: chat.php?friend=" . urlencode($chatPartner));
            exit();
        } catch (Exception $e) {
            $error = "Error sending message: " . $e->getMessage();
        }
    } else {
        $error = "Message cannot be empty.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat with <?= htmlspecialchars($chatPartner) ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>
<body>
    <div class="content">
        <h1 class="left">Chat with <?= htmlspecialchars($chatPartner) ?></h1>
        <div class="chat-controls">
            <a href="friends.php" class="logout">&lt; Back</a> |
            <a href="chat.php?action=remove-friend&friend=<?= urlencode($chatPartner) ?>" 
               class="special" 
               onclick="return confirm('Are you sure you want to remove this friend?');">
               Remove Friend
            </a>
        </div>
        <hr>
        <div class="chat">
            <ul class="message-list">
                <?php if (count($messages) === 0): ?>
                    <li class="chat-item">
                        <div class="message-content">No messages yet.</div>
                    </li>
                <?php else: ?>
                    <?php foreach ($messages as $msg): ?>
                        <li class="chat-item">
                            <div class="message-content">
                                <?php
                                $timestamp = intval($msg->time);
                                if (strlen((string)$timestamp) > 10) {
                                    $timestamp = intval($timestamp / 1000);
                                }
                                ?>
                                <span class="message-time"><?= date("d.m.Y | H:i", $timestamp) ?></span>
                                <span class="bold"><?= htmlspecialchars($msg->from) ?>:</span>
                                <?= htmlspecialchars($msg->msg) ?>
                            </div>
                        </li>
                    <?php endforeach; ?>
                <?php endif; ?>
            </ul>
        </div>
        <hr>
        <form method="POST" action="chat.php?friend=<?= urlencode($chatPartner) ?>" class="chat-form">
            <div class="bar">
                <input type="text" id="message-input" name="message" placeholder="New Message" class="actionbar" required>
                <button type="submit" class="greybuttonroundaction">Send</button>
            </div>
        </form>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="chat.js"></script>
</body>
</html>
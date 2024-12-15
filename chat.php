<?php
require("start.php");

// Überprüfen, ob der Nutzer angemeldet ist
if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit();
}

// Chat-Partner prüfen
if (!isset($_GET['friend']) || empty($_GET['friend'])) {
    die("No chat partner specified.");
}

$chatPartner = htmlspecialchars($_GET['friend']);

// Freund entfernen
if (isset($_GET['action']) && $_GET['action'] === 'remove-friend') {
    if ($service->removeFriend($chatPartner)) {
        header("Location: friends.php");
        exit();
    } else {
        die("Failed to remove friend.");
    }
}

$messages = [];

try {
    // Nachrichten laden
    $messages = $service->loadMessages($chatPartner);
} catch (Exception $e) {
    die("Error loading messages: " . $e->getMessage());
}

// Nachricht senden
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['message'])) {
    $messageContent = trim($_POST['message']);
    if (!empty($messageContent)) {
        $service->sendMessage((object)[
            "msg" => $messageContent,
            "to" => $chatPartner
        ]);
        header("Location: chat.php?friend=" . urlencode($chatPartner));
        exit();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat with <?= htmlspecialchars($chatPartner) ?></title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="content">
        <h1 class="left">Chat with <?= htmlspecialchars($chatPartner) ?></h1>
        <div class="chat-controls">
            <a href="friends.php" class="logout">&lt; Back</a> |
            <a href="chat.php?action=remove-friend&friend=<?= urlencode($chatPartner) ?>" class="special">Remove Friend
            <script src="removefriend.js"></script> 
            </a>
        </div>
        <hr>
        <fieldset class="chatbox">
        <div class="chat-area">
            <ul class="message-list">
                <?php if (!empty($messages)): ?>
                    <?php for ($i = 0; $i < count($messages); $i++): ?>
                        <li class="chat-item">
                            <div class="message-content">
                                <span class="message-time"><?= date("d.m.Y | H:i", intval($messages[$i]->time / 1000)) ?></span>
                                <span class="bold"><?= htmlspecialchars($messages[$i]->from) ?>:</span>
                                <?= htmlspecialchars($messages[$i]->msg) ?>
                            </div>
                        </li>
                    <?php endfor; ?>
                <?php else: ?>
                    <p>No messages yet.</p>
                <?php endif; ?>
            </ul>
        </div>
        </fieldset>

        <hr>

        <form method="POST" action="" class="chat-form">
            <div class="bar">
                <input type="text" name="message" placeholder="New Message" class="actionbar" required>
                <button type="submit" class="greybuttonroundaction">Send</button>
            </div>
        </form>
    </div>
</body>
</html>
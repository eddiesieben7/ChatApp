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
        <h1 class="center">Chat with <?= htmlspecialchars($chatPartner) ?></h1>
        <div class="chat-controls">
            <a href="friends.php" class="logout">&lt; Back</a> |
            <a href="remove_friend.php?friend=<?= urlencode($chatPartner) ?>" class="special">Remove Friend</a>
        </div>
        <hr>
        <div class="chat">
            <ul class="message-list">
                <?php if (!empty($messages)): ?>
                    <?php for ($i = 0; $i < count($messages); $i++): ?>
                        <li class="chat-item">
                            <span class="message-time"><?= date("H:i", intval($messages[$i]->time / 1000)) ?></span>
                            <div class="message-content">
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
        <form method="POST" action="" class="form">
            <input type="text" name="message" class="chat-input" placeholder="New Message" required>
            <button type="submit" class="bluebutton">Send</button>
        </form>
    </div>
</body>
</html>
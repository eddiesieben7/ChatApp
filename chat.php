<?php
require("start.php");

$error = "";

if (!isset($_SESSION['user']['username'])) {
    header("Location: login.php");
    exit();
}

$currentUser = $_SESSION['user']['username'];
$chatPartner = htmlspecialchars($_GET['friend'] ?? '');

if (empty($chatPartner)) {
    header("Location: friends.php");
    exit();
}

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
    $messages = $service->loadMessages($chatPartner);
} catch (Exception $e) {
    $error = "Error loading messages: " . $e->getMessage();
}

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
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>
<div class="container mt-5">
    <h1 class="text-left">Chat with <?= htmlspecialchars($chatPartner) ?></h1>
    <div class="btn-group mb-3">
        <a href="friends.php" class="btn btn-secondary">&lt; Back</a>
        <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#removeFriend">Remove Friend</button>
    </div>
    <ul class="list-group mb-3">
        <?php if (count($messages) === 0): ?>
            <li class="list-group-item text-center">No messages yet.</li>
        <?php else: ?>
            <?php foreach ($messages as $msg): ?>
                <li class="list-group-item">
                    <span class="fw-bold"><?= htmlspecialchars($msg->from) ?>:</span>
                    <?= htmlspecialchars($msg->msg) ?>
                </li>
            <?php endforeach; ?>
        <?php endif; ?>
    </ul>
    <form method="POST" action="chat.php?friend=<?= urlencode($chatPartner) ?>">
        <div class="input-group">
            <input type="text" name="message" class="form-control" placeholder="New Message" required>
            <button class="btn btn-primary" type="submit">Send</button>
        </div>
    </form>
</div>

<div class="modal fade" id="removeFriend" tabindex="-1" aria-labelledby="removeFriendModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="removeFriendModalLabel">Remove Friend</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Are you sure you want to remove <?= htmlspecialchars($chatPartner) ?> as a friend?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <a href="chat.php?action=remove-friend&friend=<?= urlencode($chatPartner) ?>" class="btn btn-danger">Remove</a>
            </div>
        </div>
    </div>
</div>
</body>
</html>
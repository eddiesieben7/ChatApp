<?php
require("start.php");

if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit();
}

try {
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
        <a class="logout" href="logout.php">&lt; Logout</a>
        <hr>
        
        <div class="friendlist">
            <h2 class="left">Your Friends</h2>
            <ul>
                <?php if (!empty($acceptedFriends)): ?>
                    <?php foreach ($acceptedFriends as $friend): ?>
                        <li>
                            <?= htmlspecialchars($friend->getUsername()) ?>
                            <span class="message-time">Last active: <?= htmlspecialchars($friend->getLastActive()) ?></span>
                        </li>
                    <?php endforeach; ?>
                <?php else: ?>
                    <p>No friends yet.</p>
                <?php endif; ?>
            </ul>
        </div>
        
        <div class="friend-requests">
            <h2 class="left">Friend Requests</h2>
            <ul>
                <?php if (!empty($pendingRequests)): ?>
                    <?php foreach ($pendingRequests as $request): ?>
                        <li>
                            <?= htmlspecialchars($request->getUsername()) ?>
                            <form method="POST" action="process_request.php" style="display: inline;">
                                <input type="hidden" name="request_id" value="<?= htmlspecialchars($request->getId()) ?>">
                                <button type="submit" name="action" value="accept" class="acceptbutton">Accept</button>
                                <button type="submit" name="action" value="reject" class="rejectbutton">Reject</button>
                            </form>
                        </li>
                    <?php endforeach; ?>
                <?php else: ?>
                    <p>No pending requests.</p>
                <?php endif; ?>
            </ul>
        </div>
    </div>
</body>
</html>
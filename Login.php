<?php
require("start.php");

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    if (!empty($username) && !empty($password)) {
        try {
            if ($service->login($username, $password)) {
                $_SESSION['user'] = $username;
                header("Location: friends.php");
                exit();
            } else {
                $error = "Invalid username or password.";
            }
        } catch (Exception $e) {
            $error = "Error during login: " . $e->getMessage();
        }
    } else {
        $error = "Please fill in all fields.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="content">
        <img src="images/chat.png" class="images" alt="Chat Icon">
        <h1 class="center">Please sign in</h1>
        <form class="form" method="POST" action="">
            <fieldset>
                <legend>Login</legend>
                <label for="username">Username</label>
                <input type="text" id="username" name="username" placeholder="Username" required>
                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Password" required>
            </fieldset>
            <button class="bluebutton" type="submit">Login</button>
        </form>
        <?php if ($error): ?>
            <p class="error"><?= htmlspecialchars($error) ?></p>
        <?php endif; ?>
    </div>
</body>
</html>
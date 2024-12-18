<?php
require("start.php");

$error = ""; // Fehlernachricht

// Überprüfen, ob der Benutzer bereits eingeloggt ist
if (isset($_SESSION['user']['username'])) {
    header("Location: friends.php");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (empty($username) || empty($password)) {
        $error = "Please fill in all fields.";
    } else {
        // Versuche den Benutzer einzuloggen
        try {
            if ($service->login($username, $password)) {
                $_SESSION['user'] = ['username' => $username]; // Benutzer speichern
                header("Location: friends.php");
                exit();
            } else {
                $error = "Invalid username or password.";
                error_log("Login failed for user: $username");
            }
        } catch (Exception $e) {
            $error = "Login error: " . $e->getMessage();
            error_log("Login error: " . $e->getMessage());
        }
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

        <?php if (!empty($error)): ?>
            <p class="error"><?= htmlspecialchars($error) ?></p>
        <?php endif; ?>

        <form method="POST" action="login.php" class="form">
            <fieldset class="login">
                <legend>Login</legend>
                <div class="formcontent">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" placeholder="Username" required>
                    <br>
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Password" required>
                </div>
            </fieldset>
            <div class="extrabuttons">
                <a href="register.php" class="greyroundbutton">Register</a>
                <button type="submit" class="blueroundbutton">Login</button>
            </div>
        </form>
    </div>
</body>
</html>
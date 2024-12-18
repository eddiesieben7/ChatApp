<?php
require("start.php");

// Wenn der Nutzer bereits angemeldet ist, zur Freundesliste weiterleiten
if (!isset($_SESSION['user']['username'])) {
    header("Location: friends.php");
    exit();
}



$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if (!empty($username) && !empty($password)) {
        if ($service->login($username, $password)) {
            $_SESSION['user'] = ['username' => $username];  // Speichere ein Array in der Session
            header("Location: friends.php");
            exit();
        }
        } else {
            $error = "Invalid username or password.";
        }
    } else {
        $error = "Please fill in all fields.";
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
            <div class = "formcontent">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" placeholder="Username" required><br>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Password" required>
            </div>
            </fieldset>

            <div class= "extrabuttons">

            <a href="register.php" class="greyroundbutton">Register</a> 
            <button type="submit" class="blueroundbutton">Login</button>
            </div>
        </form>
    </div>
</body>
</html>
<?php
require("start.php");

$error = ""; // Variable zur Speicherung von Fehlermeldungen

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $confirmPassword = trim($_POST['confirm_password'] ?? '');

    // Serverseitige Validierung
    if (empty($username)) {
        $error = "Username is required.";
    } elseif (strlen($username) < 3) {
        $error = "Username must be at least 3 characters long.";
    } elseif ($service->userExists($username)) { // Benutzername auf Existenz prüfen
        $error = "Username already exists.";
    } elseif (empty($password)) {
        $error = "Password is required.";
    } elseif (strlen($password) < 8) {
        $error = "Password must be at least 8 characters long.";
    } elseif ($password !== $confirmPassword) {
        $error = "Passwords do not match.";
    } else {
        // Wenn alle Eingaben korrekt sind, Benutzer registrieren
        if ($service->register($username, $password)) {
            $_SESSION['user'] = ['username' => $username]; // Benutzername in der Session speichern
            header("Location: friends.php"); // Weiterleitung zur Freundesliste
            exit();
        } else {
            $error = "Registration failed. Please try again.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="content">
        <img src="images/user.png" class="images" alt="User Icon">
        <h1 class="center">Register yourself</h1>

        <?php if (!empty($error)): ?>
            <p class="error"><?= htmlspecialchars($error) ?></p>
        <?php endif; ?>

        <form method="POST" action="register.php" class="form">
        <fieldset class="register">
            <legend>Register</legend>
            <div class="formcontent">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
            </div>

            <div class="formcontent">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>

            <div class="formcontent">
                <label for="confirm_password">Confirm Password:</label>
                <input type="password" id="confirm_password" name="confirm_password" required>
            </div>
        </fieldset>

        <div class="extrabuttons">
            <a href="login.php" class="greyroundbutton" >Cancel</a>
            <button type="submit" class="blueroundbutton" id="register-button" >Create Account</button>
        </div>
    </form>
</div>

    <script src="register.js"></script>
</body>
</html>
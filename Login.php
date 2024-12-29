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
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>
<body>
    <div class="container-sm">
        <img src="images/chat.png" class="rounded mx-auto d-block" alt="Chat Icon">
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
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>
</html>
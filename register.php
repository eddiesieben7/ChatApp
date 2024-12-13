<?php
require("start.php");

$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';

    if (!empty($username) && !empty($password) && $password === $confirmPassword) {
        if (strlen($username) >= 3 && strlen($password) >= 8) {
            if (!$service->userExists($username)) {
                if ($service->register($username, $password)) {
                    $_SESSION['user'] = $username;
                    header("Location: friends.php");
                    exit();
                } else {
                    $error = "Registration failed. Please try again.";
                }
            } else {
                $error = "Username already exists.";
            }
        } else {
            $error = "Invalid input: username must be at least 3 characters, password at least 8 characters.";
        }
    } else {
        $error = "Passwords do not match or fields are missing.";
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
        <h1 class="center">Register</h1>
        <?php if (!empty($error)): ?>
            <p class="error"><?= htmlspecialchars($error) ?></p>
        <?php endif; ?>
        <form method="POST" action="register.php" class="form">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <label for="confirm_password">Confirm Password:</label>
            <input type="password" id="confirm_password" name="confirm_password" required>
            <button type="submit" class="bluebutton">Register</button>
        </form>
    </div>
</body>
</html>
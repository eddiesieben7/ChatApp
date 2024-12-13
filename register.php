<?php
require("start.php");

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    $confirmPassword = trim($_POST['password2']);

    if (strlen($username) >= 3 && strlen($password) >= 8 && $password === $confirmPassword) {
        try {
            if ($service->register($username, $password)) {
                $_SESSION['user'] = $username;
                header("Location: friends.php");
                exit();
            } else {
                $error = "Registration failed. Username might already exist.";
            }
        } catch (Exception $e) {
            $error = "Error during registration: " . $e->getMessage();
        }
    } else {
        $error = "Ensure username is at least 3 characters, password is at least 8 characters, and passwords match.";
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
        <form class="form" method="POST" action="">
            <fieldset>
                <legend>Register</legend>
                <label for="username">Username</label>
                <input type="text" id="username" name="username" placeholder="Username" required>
                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Password" required>
                <label for="password2">Confirm Password</label>
                <input type="password" id="password2" name="password2" placeholder="Confirm Password" required>
            </fieldset>
            <button class="bluebutton" type="submit">Create Account</button>
        </form>
        <?php if ($error): ?>
            <p class="error"><?= htmlspecialchars($error) ?></p>
        <?php endif; ?>
    </div>
</body>
</html>
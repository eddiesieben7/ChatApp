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
<body class="bg-light">
<div class="container-md mt-3 text-center">
        <img src="images/chat.png" class="rounded-circle" alt="Chat Icon" style= "width:200px; height: 200px;" >
        <div class="container-sm bg-white mt-5 border border-gray-500 p-5 w-50 ">
        <h1 class="text-center m-3 fs-2">Please sign in</h1>

        <?php if (!empty($error)): ?>
            <p class="error"><?= htmlspecialchars($error) ?></p>
        <?php endif; ?>


        <div class="d-flex justify-content-center">

        <form method="POST" action="login.php" class="needs-validation w-50" novalidate>
            
        <div class="form-floating mb-3">
                    <input class="form-control" type="text" id="username" name="username" placeholder="Username" required>
                    <label for="username">Username</label>
                </div>
                    
                <div class="form-floating mb-3">
                    <input class="form-control" type="password" id="password" name="password" placeholder="Password" required>
                    <label for="password">Password</label>
                </div>
           
                <div class="d-flex justify-content-between">
                <a href="register.php" class="btn btn-secondary w-50 rounded-0 rounded-start">Register</a>
                <button type="submit" class="btn btn-primary w-50 rounded-0 rounded-end">Login</button>
            </div>
        </form>
    </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>
</html>
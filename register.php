<?php
require("start.php");

$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $confirmPassword = trim($_POST['confirm_password'] ?? '');

    if (empty($username)) {
        $error = "Username is required.";
    } elseif (strlen($username) < 3) {
        $error = "Username must be at least 3 characters long.";
    } elseif ($service->userExists($username)) {
        $error = "Username already exists.";
    } elseif (empty($password)) {
        $error = "Password is required.";
    } elseif (strlen($password) < 8) {
        $error = "Password must be at least 8 characters long.";
    } elseif ($password !== $confirmPassword) {
        $error = "Passwords do not match.";
    } else {
        if ($service->register($username, $password)) {
            $_SESSION['user'] = ['username' => $username];
            header("Location: friends.php");
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
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body class="bg-light">

<div class="container-md mt-3 text-center">

<img src="images/user.png" class="rounded-circle " alt="User Icon" style= "width: 150px; height: 150px;">
<div class="container-sm bg-white mt-5 border border-gray-500 p-5 w-50 ">

<h1 class="text-center m-3">Register</h1>

<?php if (!empty($error)): ?>
    <div class="alert alert-danger"><?= htmlspecialchars($error) ?></div>
<?php endif; ?>

<div class="d-flex justify-content-center">

<form method="POST" action="register.php" class="needs-validation w-50" novalidate>

    <div class="form-floating mb-3">
        <input type="text" class="form-control" id="username" name="username" placeholder="Username" required>
        <label for="username">Username</label>
        <div class="invalid-feedback">Username must be at least 3 characters long.</div>
    </div>

    <div class="form-floating mb-3">
        <input type="password" class="form-control" id="password" name="password" placeholder="Password" required>
        <label for="password">Password</label>
        <div class="invalid-feedback">Password must be at least 8 characters long.</div>
    </div>

    <div class="form-floating mb-3">
        <input type="password" class="form-control" id="confirm_password" name="confirm_password" placeholder="Confirm Password" required>
        <label for="confirm_password">Confirm Password</label>
        <div class="invalid-feedback">Passwords must match.</div>
    </div>

    <div class="d-flex justify-content-between">
        <a href="login.php" class="btn btn-secondary w-50 rounded-0 rounded-start">Cancel</a>
        <button type="submit" class="btn btn-primary w-50 rounded-0 rounded-end">Register</button>
    </div>
</form>
</div>
</div>

<script>
(function () {
'use strict';
const forms = document.querySelectorAll('.needs-validation');
Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('validated');
    }, false);
});
})();
</script>
</body>
</html>
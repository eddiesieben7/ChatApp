<?php
require("start.php");
session_unset();
//header("Location: login.php");
//exit();

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logout</title>
    <link rel="stylesheet"  href="style.css">
</head>
<body>
    <div class="content">
    <img src="images/logout.png" class="images">
    <h1 class="center">Logged out...</h1>
    <p class="pcenter">See u!</p>
    <a class="center" href="Login.php" class="center">Login again</a>
    </div>
    
</body>
</html>
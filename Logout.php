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
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

</head>
<body class="bg-light">

    <div class="container-md mt-3 text-center">
    <img src="images/logout.png" class="rounded-circle" alt="Logout Icon" style= "width:200px; height: 200px;">

    <div class="container-sm bg-white mt-5 border border-gray-500 p-5 w-50 ">

    <h1 class="center fs-2">Logged out...</h1>
    <p class="pcenter">See u!</p>

    <div class="d-grid  col-8 mx-auto">
    <a class="btn btn-secondary" href="Login.php" >Login again</a>
    </div>
    </div>
</div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

    
</body>
</html>
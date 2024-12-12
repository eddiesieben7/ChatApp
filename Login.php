<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" type="text/css" href="style.css">

    <?php include 'start.php'; ?>
</head>
<body>
    <div class="content">
        <img src="images/chat.png" class="images" alt="Chat Icon">
        <h1 class="center">Please sign in</h1>

        <form class="form" action="login.php" method="post">
            <fieldset>
                <legend>Login</legend>
                <div class="formcontent">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" placeholder="Username" required><br>
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Password" required><br>
                </div>
            </fieldset>
            
            <div class="extrabuttons">
                <a href="register.html" class="greyroundbutton">Register</a> 
                <button class="blueroundbutton" type="submit">Login</button>
            </div>
        </form>
    </div>
     
</body>
</html>

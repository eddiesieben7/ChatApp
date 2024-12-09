<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
    <div class="content">
        <img src="images/user.png" class="images" alt="User Icon">
        <h1 class="center">Register yourself</h1>

        <form class="form" action="friends.html" method="post">
            <fieldset>
                <legend>Register</legend>
                
                <div class="formcontent">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" placeholder="Username" required>
                </div>
                
                <div class="formcontent">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Password" required>
                </div>

                <div class="formcontent">
                    <label for="password2">Confirm Password</label>
                    <input type="password" id="password2" name="password2" placeholder="Confirm Password" required>
                </div>
            </fieldset>

            <div class="extrabuttons">
                <a href="login.html" class="greyroundbutton">Cancel</a>
                <button class="blueroundbutton"><a href="Login.html" class="buttontext">Create Account</a></button>
            </div>
        </form>
    </div>
</body>
</html>

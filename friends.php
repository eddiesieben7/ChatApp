<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Friends</title>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
    <div class="content">
        <h1 class="left">Friends</h1>

        <a class="logout" href="Logout.html">&lt; Logout</a> |  
        <a class="text" href="Login.html">Settings</a>

        <hr>

        <div class="friendlist">
            <ul>
            </ul>
        </div>

        <hr>

        <h2 class="left">New Requests</h2>
        <ol>
        </ol>

        <hr>

        <form>
            <div class="bar">
                <input 
                    class="actionbar" placeholder="Add Friend to List" name="friendRequestName" id="friend-request-name" list="friend-selector">
                <datalist id="friend-selector"> 
                    


                </datalist>
                <button type="button" class="greybuttonroundaction">Add</button>
            </div>
        </form>
    </div>
    <script src="friends.js"></script> 
</body>
</html>

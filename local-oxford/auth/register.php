<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" type="text/css" href="styles.css">
        <title>Register</title>
        
        
    </head>
    <body>
    <div class="centered">
    <form action="registration.php" method="POST" id="form">
    <label >Email:<br/></label>
    <p style="font-size: 10px;">*This will not be visible to the public and will be needed to log in to your account.</p>
    <input type="text" name="user"/><br/>
    <label >Password:<br/></label>
    <input type="password" name="password"><br/>
    <input class="button" type="submit" value="Apply"/><br/><br/>
    <a class="button" href="login.php">Go Back</a>
    </form>
    
    </body>
</html> 
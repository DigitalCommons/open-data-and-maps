<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Changed</title>
        
    </head>
    <body>
    <div class="centered">
    <?php if(isset($_GET['id'])){$id = $_GET['id']; if($id=='nope'){echo "<p>Email/Pass didn't work</p>";}}; ?>
    <form action="start.php" method="POST" id="form">
    <label>login<br/><br/></label>
    <label class="smaller">username:<br/></label>
    <input type="text" name="user"/><br/>
    <label class="smaller">password:<br/></label>
    <input type="text" name="password"><br/>
    <input type="submit" value="Log In!"/><br/><br/>
    <a href="register.php">Register</a><br/><br/>
    <a href="forgot.php">Forget your password?</a>
    </form>
    
    </body>
</html> 
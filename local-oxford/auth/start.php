<?php 

session_save_path('/home/pareccoc/cgi-bin/tmp');
session_start();


require 'password.php';
$hasher = new PasswordHash(8, false);
		
        // Include our login information
		include('db_login.php');
        
if( isset($_POST['user']) && isset($_POST['password']) )
{   
        $user =  $_POST["user"];
        $password =  $_POST["password"]; 
        if ($stmt = mysqli_prepare($conn, "SELECT * FROM users WHERE email=?;")) {
            mysqli_stmt_bind_param($stmt, "s", $user);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            $row = mysqli_fetch_all($result)[0];
            };

        if ($hasher->CheckPassword($password,$row[2]) && $row[4] == 1){
        // auth okay, setup session
       $_SESSION['user'] = $user;
        // redirect to required page
        header( "Location: index.php" );
        exit();
     } 
     else {
        // didn't auth go back to loginform
        header( "Location: login.php?id=nope" );
        exit();
     }
 } 
 else {
     header( "Location: login.php" );
     exit();
 };

        
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <link rel="stylesheet" type="text/css" href="styles.css">
        <meta charset="utf-8">
        <title>Start</title>
    </head>
    <body>
    </body>
</html>
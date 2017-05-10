<?php 

session_save_path('/home/pareccoc/cgi-bin/tmp');
session_start();


require 'password.php';
$hasher = new PasswordHash(8, false);
		
        // Include our login information
		include('db_login.php');
        
if( isset($_POST['user']) && isset($_POST['password']) )
{   
        $user =  mysqli_real_escape_string($conn,$_POST["user"]);
        $password =  mysqli_real_escape_string($conn,$_POST["password"]); 
     $query = "SELECT * FROM users WHERE email='".$user."';";
       $result = mysqli_query( $conn, $query ); 
        $row = mysqli_fetch_row($result);
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
        <meta charset="utf-8">
        <title>Start</title>
    </head>
    <body>
    </body>
</html>
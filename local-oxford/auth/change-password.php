<?php   session_save_path('/home/pareccoc/cgi-bin/tmp');
		session_start();
		session_regenerate_id();
		if(!isset($_SESSION['user']))      // if there is no valid session
			{
    			header("Location: login.php");
    			exit();
			};
		$user = $_SESSION['user'];
		?>


<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" type="text/css" href="styles.css">
        <title>Change Password</title>
    </head>
    <body><div class="centered">

<?php	

		require 'password.php';
		$hasher = new PasswordHash(8, false);
		include('db_login.php');
						
		if (!isset($_POST['password'])){
			echo '<form action="change-password.php" method="POST">
  				<label >Please write your new password and double-check it:<br/></label>
    			<input type="text" name="password"/><br/>
   				<input class="button" type="submit" value="Submit"/><br/><br/>
    			</form>';
		}
		else{
			$secret = $_POST["password"];
				//hash password
			$hash = $hasher->HashPassword($secret);
				//store in database
			if ($stmt = mysqli_prepare($conn, 'UPDATE users SET password = ? WHERE email = ?;')) {
   				mysqli_stmt_bind_param($stmt, "ss", $hash, $user);
    			mysqli_stmt_execute($stmt); };

 			echo '<p>Please go and <a href="login.php">login</a> with your new password.</p>';
			};
		
			mysqli_close($conn);
		?>
  		 
    </div></body>
</html> 
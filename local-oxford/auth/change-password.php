<?php   session_save_path('C:\wamp64\cgi-bin\tmp');
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

        <title>Change Password</title>
        
        <style type="text/css">
        	
        </style>
    </head>
    <body>

<?php	

		require 'password.php';
		$hasher = new PasswordHash(8, false);
		include('db_login.php');
						
		if (!isset($_POST['password'])){
			echo '<form action="change-password.php" method="POST">
  				<label >Please write your new password and double-check it:<br/></label>
    			<input type="text" name="password"/><br/>
   				<input type="submit" value="Submit"/><br/><br/>
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
				//send unhashed version to email with login link
    		/*$subject = "Data Registration";
			$msg = "Hi ".$user.",\nYou've requested a new password, please login (http://link.com) using your email and the following password and then change it to something more memorable:\n".$random;
 			$headers = 'From: dan@solidarityeconomics.org' . "\r\n" .'X-Mailer: PHP/' . phpversion();
 			mail($user,$subject,$msg,$headers);*/
				//echo message to check emails
 			echo '<p>Please go and <a href="login.php">login</a> with your new password.</p>';
			};
		

		?>
  		 
    </body>
</html> 
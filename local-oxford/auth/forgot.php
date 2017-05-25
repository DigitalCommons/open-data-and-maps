<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" type="text/css" href="styles.css">
        <title>Get New Password</title>

    </head>
    <body>

<?php	

		require 'password.php';
		$hasher = new PasswordHash(8, false);
		include('db_login.php');
						
		if (!isset($_POST['email'])){
			echo '
				<div class="centered">
				<form action="forgot.php" method="POST">
  				<label >Please write your username/email:<br/></label>
    			<input type="text" name="email"/><br/>
   				<input class="button" type="submit" value="Submit"/><br/><br/>
    			</form>
				<a class="button" href="login.php">Back to Login</a>
    			</div>';
		}
		else{
			//check legitimacy
			$user = mysqli_real_escape_string($conn,$_POST["email"]);
			$checkuser =  "SELECT * FROM users WHERE email='".$user."';";
			$result0 = mysqli_query($conn, $checkuser);
		
			if(mysqli_num_rows($result0) == 1){
				//create password
			$random = substr(str_shuffle(str_repeat('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', mt_rand(1,5))),1,10);
				//hash password
			$hash = $hasher->HashPassword($random);
				//store in database
			if ($stmt = mysqli_prepare($conn, 'UPDATE users SET password = ? WHERE email = ?;')) {
   				mysqli_stmt_bind_param($stmt, "ss", $hash, $user);
    			mysqli_stmt_execute($stmt); };
				//send unhashed version to email with login link
    		$subject = "Oxford Solidarity Economy Mapping";
			$msg = "Hi ".$user.",\nYou've requested a new password, please login (http://internal.parecco.co.uk/oxford-data/login.php) using your email and the following password and then change it to something more memorable:\n".$random;
 			$headers = 'From: dan@solidarityeconomics.org' . "\r\n" .'X-Mailer: PHP/' . phpversion();
 			mail($user,$subject,$msg,$headers);
				//echo message to check emails
 			echo '<p>Please go and check your emails for your new password and then <a href="login.php">login</a>.</p>';
			}
			else{
				//echo "email not recognised please register(link) or try again(link)."
			echo '<p>Email not recognised please <a href="register.php">register</a> or <a href="forgot.php">try again</a>.</p>';
			};
		};

		?>
  			
  		 
    </body>
</html> 
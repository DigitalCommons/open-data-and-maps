<!DOCTYPE html>
<html lang="en">
    <head>
   </head>
    <body>

<?php	
		
		// Include our login information
		include('db_login.php');

		$match = htmlentities($_GET["id"]);  //needs securing
		
		// Check verification code and if present change 'verify' from 0 to 1.
		$getmatch = 'SELECT * FROM users WHERE verification ="'.$match.'";';
    	$result = mysqli_query( $conn, $getmatch );
		if (mysqli_num_rows($result) == 1){
			$verify = 'UPDATE users SET verified = 1 WHERE verification = "'.$match.'";';
			$update = mysqli_query( $conn, $verify );

			echo "<p> Your email has been verified, please <a href='login.php'>log in</a>.</p>";
		}
		
		else { echo "<p> Your verification link wasn't correct please try again</p>";};
			
		mysqli_close($conn);
		
?>

    
    </body>
</html>

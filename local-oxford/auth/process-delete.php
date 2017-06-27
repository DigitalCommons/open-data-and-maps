<?php  session_save_path('/home/pareccoc/cgi-bin/tmp');
		session_start();
		session_regenerate_id();
		if(!isset($_SESSION['user']))      // if there is no valid session
			{
    			header("Location: login.php");
    			exit();
			}; ?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" type="text/css" href="styles.css">

        <title>Account Deleted</title>

    </head>
    <body>

<?php	


		// Connect to database
		include('db_login.php');

		$user = $_SESSION["user"];
		$code = $_POST["code"];
		$reason = $_POST["reason"];	



		// Check if user has that code
		$checkuser =  "SELECT * FROM users WHERE email='".$user."';";

        if ($stmt = mysqli_prepare($conn, $checkuser)) {
			mysqli_stmt_execute($stmt); 
			$result = mysqli_stmt_get_result($stmt);
			$row = mysqli_fetch_row($result);
			}; 		
		
		if ($row[3]==$code){
			//Delete User
			if ($stmt = mysqli_prepare($conn, 'DELETE FROM users WHERE email=?;')) {
				mysqli_stmt_bind_param($stmt, "s", $user);
				mysqli_stmt_execute($stmt); };
			//Delete Data
			if ($stmt = mysqli_prepare($conn, 'DELETE FROM data WHERE email=?;')) {
				mysqli_stmt_bind_param($stmt, "s", $user);
				mysqli_stmt_execute($stmt); };
			//Add reason to table
			if ($stmt = mysqli_prepare($conn, 'INSERT INTO leaving_reasons (reason) VALUES (?);')) {
				mysqli_stmt_bind_param($stmt, "s", $reason);
				mysqli_stmt_execute($stmt); };
		};



		echo "<h2>Your account has been deleted!</h2>";
			
		mysqli_close($conn);

					
		?>


 
  			<a href="login.php">Back to Map</a>
  		 
    </body>
</html> 


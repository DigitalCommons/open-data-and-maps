<?php  session_save_path('/home/pareccoc/cgi-bin/tmp');
		session_start();
		session_regenerate_id();
		if(!isset($_SESSION['user']))      // if there is no valid session
			{
    			header("Location: login.php");
    			exit();
			};
 		
?>	

<!DOCTYPE html>
<html lang="en">
    <head>
    <link rel="stylesheet" type="text/css" href="styles.css">
   </head>
    <body class="main"><div class="content">

<?php	
		$user = $_SESSION['user'];
		$id = $_POST['id'];
		$reason = htmlentities($_POST['reason']);
		$sendto = "dan@solidarityeconomics.org";
		$subject = "Local Map Report";
		$msg = "The user: ".$user."\nHas reported the initiative with the following id in the data table: ".$id."\nThe reason they gave for reporting was:\n".$reason;
 		$headers = 'From: dan@solidarityeconomics.org' . "\r\n" .
    		'X-Mailer: PHP/' . phpversion();
 		mail($sendto,$subject,$msg,$headers);

			
?>
	<h2>Thanks for reporting that issue</h2>
	<a class="button" href="index.php">Go back to the Map</a>
    
    </div></body>
</html>

<?php  session_save_path('/home/pareccoc/cgi-bin/tmp');
		session_start();
		session_regenerate_id();
		if(!isset($_SESSION['user']))      // if there is no valid session
			{
    			header("Location: login.php");
    			exit();
			};
 		
        $user = $_SESSION['user'];

        include('db_login.php');

        $random = substr(str_shuffle(str_repeat('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', mt_rand(1,5))),1,10);

        //Secure from SQL injection

        if ($stmt = mysqli_prepare($conn, 'UPDATE users SET verification = ? WHERE email = ?;')) {

        mysqli_stmt_bind_param($stmt, "ss", $random, $user);

        mysqli_stmt_execute($stmt); };

        $subject = "Oxford Solidarity Economy Mapping - DELETE ACCOUNT";
        $msg = "Hello,\nYour code to confirm that you want to delete your account is: ".$random."\nThanks,\nSolidarity Economy Association";
        $headers = 'From: dan@solidarityeconomics.org' . "\r\n" .
            'X-Mailer: PHP/' . phpversion();
        mail($user,$subject,$msg,$headers);

        mysqli_close($conn);
?>	

<!DOCTYPE html>
<html lang="en">
    <head>
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7/leaflet.css"/>
    <link rel="stylesheet" type="text/css" href="styles.css">
        <meta charset="utf-8">
   </head>
    <body class="main" ><div class="content">

    <h1 id="title">Oxford Solidarity Economy Mapping</h1>
    <h2>Delete Your Account</h2>
    <p>You have been sent an email with a deletion code. Once you fill in this form your account and all its data will be <strong>completely deleted</strong> and will not be recoverable.</p>


    <form action="process-delete.php" method="POST" id="form">
    <label >Deletion Code:<br/></label>
    <input type="text" name="code"/><br/>
    <label >Reason why you're leaving:<br/></label>
    <input type="text" name="reason"><br/>
    <label> If you're totally sure...<br/></label>
    <input class="submit" type="submit" value="DELETE YOUR ACCOUNT"/><br/><br/>
    </form>

    </div>


    </body>
</html>
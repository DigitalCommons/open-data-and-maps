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
        <meta charset="utf-8">
   </head>
    <body class="main" ><div class="content">

    <h2>Welcome to Oxford SE Data</h2>
    <p>We currently don't have any information on your initiative, please answer the following questions, it's ok to skip some.</p>
    <p>There are just three sections - 1.Basic Info - 2.Initiative Description - 3.Extra Bits</p>
    <h3>1/3. Basic Info</h3>
    <form action="survey-initiative.php" method="POST" id="form">
    <label >Initiative's Name:<br/></label>
    <input type="text" name="name"/><br/>
    <label >Public email:<br/></label>
    <input type="text" name="contact"><br/>
    <label >Website address:<br/></label>
    <input type="text" name="website"><br/>
    <label >Phone Number:<br/></label>
    <input type="text" name="phone"><br/>
    <label >Address (building and street):<br/></label>
    <input type="text" name="street"><br/>
    <label >Postcode<br/></label>
    <input type="text" name="postcode"><br/>
    <input type="submit" value="Submit"/><br/><br/>
    </form>
    

    </div></body>
</html>
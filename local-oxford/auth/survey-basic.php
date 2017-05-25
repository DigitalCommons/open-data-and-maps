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

    <h2 id="title">Oxford Solidarity Economy Mapping</h2>
    <p style="margin-top: 20px; margin-bottom: 50px;">We currently don't have any information on your initiative, please answer the following questions, block of text explaining shit... blah blah... It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>


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
    <input class="submit" type="submit" value="Submit"/><br/><br/>
    </form>
    <h3>Progress:</h3>
    <div class="progress-container">
        <div class="progress" style="width:33%">33%</div>
    </div>

    </div></body>
</html>
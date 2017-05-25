<?php  session_save_path('/home/pareccoc/cgi-bin/tmp');
		session_start();
		session_regenerate_id();
		if(!isset($_SESSION['user']))      // if there is no valid session
			{
    			header("Location: login.php");
    			exit();
			};
 		
        // Connect to database
        include('db_login.php');
        $user = $_SESSION['user'];
        
        //Process data to be uploaded
        isset($_POST['sentence']) ? $sentence = $_POST['sentence'] : $sentence = '';
        isset($_POST['description']) ? $description = $_POST['description'] : $description = '';
        isset($_POST['provides']) ? $provides = $_POST['provides'] : $provides = ['','',''];
        isset($_POST['identity']) ? $identity = $_POST['identity'] : $identity = ['','',''];
        isset($_POST['interaction']) ? $interaction = $_POST['interaction'] : $interaction = ['','',''];

        //Make sure all arrays are exactly of size 3
        $provides = array_slice(array_pad($provides,3,''),0,3);
        $identity = array_slice(array_pad($identity,3,''),0,3);
        $interaction = array_slice(array_pad($interaction,3,''),0,3);

        //Upload Data
        $addinfo = 'UPDATE data SET sentence = "'.$sentence.'", description = "'.$description.'", providesa = "'.$provides[0].'", providesb = "'.$provides[1].'", providesc = "'.$provides[2].'", identitya = "'.$identity[0].'", identityb = "'.$identity[1].'", identityc = "'.$identity[2].'", interactiona = "'.$interaction[0].'", interactionb = "'.$interaction[1].'", interactionc = "'.$interaction[2].'" WHERE email = "'.$user.'";';
        $result = mysqli_query( $conn, $addinfo ); //needs securing

        
?>	

<!DOCTYPE html>
<html lang="en">
    <head>
        <link rel="stylesheet" type="text/css" href="styles.css">
        <meta charset="utf-8">
   </head>
    <body class="main" ><div class="content">
    <h3>3/3. Extra Info</h3>
        <form action="survey-finish.php" method="POST" id="form">
    <label >If your initiative has members, how many?<br/></label>
    <input type="text" name="members"/><br/>
    <label >In which year was your initiative founded?:<br/></label>
    <input type="text" name="foundingyear"><br/>
    <label >What is your initiative's legal form?:<br/></label>
    <input type="text" name="legal"><br/>
    <label >Does your initiative have a registering body (eg Companies House, Charity Commission)?<br/></label>
    <input type="text" name="registrar"><br/>
    <label >What is your registered number with that registrar?<br/></label>
    <input type="text" name="registerednum"><br/>
    <input class="submit" type="submit" value="Submit"/><br/><br/>
    </form>
    <h3>Progress:</h3>
    <div class="progress-container">
        <div class="progress" style="width:100%">100%</div>
    </div>

    </div></body>
</html>
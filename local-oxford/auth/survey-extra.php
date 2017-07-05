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
        isset($_POST['icon']) ? $icon = $_POST['icon'] : $icon = '';
        isset($_POST['provides']) ? $provides = $_POST['provides'] : $provides = ['','',''];
        isset($_POST['identity']) ? $identity = $_POST['identity'] : $identity = ['','',''];
        isset($_POST['interaction']) ? $interaction = $_POST['interaction'] : $interaction = ['','',''];

        //Make sure all arrays are exactly of size 3
        $provides = array_slice(array_pad($provides,3,''),0,3);
        $identity = array_slice(array_pad($identity,3,''),0,3);
        $interaction = array_slice(array_pad($interaction,3,''),0,3);

        //Upload Data
        $addinfo = 'UPDATE data SET sentence = ?, description = ?, icon = ?, providesa = ?, providesb = ?, providesc = ?, identitya = ?, identityb = ?, identityc = ?, interactiona = ?, interactionb = ?, interactionc = ? WHERE email = ?;';

        if ($stmt = mysqli_prepare($conn, $addinfo)) {
            mysqli_stmt_bind_param($stmt, "sssssssssssss", $sentence,$description,$icon,$provides[0],$provides[1],$provides[2],$identity[0],$identity[1],$identity[2],$interaction[0],$interaction[1],$interaction[2],$user);
            mysqli_stmt_execute($stmt);
        };




        $query_leg = "SELECT label, definition FROM fields WHERE type = 'Legal Form';"; 
        $result4 = mysqli_query( $conn, $query_leg );
        $legal = mysqli_fetch_all($result4);

        
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
    <input type="text" name="members" form="form"/><br/>
    <label >In which year was your initiative founded?:<br/></label>
    <input type="text" name="foundingyear" form="form"/><br/>
    <label >What is your initiative's legal form?:<br/></label>
    <select name="legal" form="form"><option selected disabled>Choose</option>
                <?php 
                foreach($legal as $array){
                    echo '<option value="'.$array[0].'">'.$array[0].'</option>';
                };
                ?>
            </select>
    <br/>
    <label >Does your initiative have a registering body (eg Companies House, Charity Commission)?<br/></label>
    <input type="text" name="registrar"/><br/>
    <label >What is your registered number with that registrar?<br/></label>
    <input type="text" name="registerednum"/><br/>
    <input class="submit" type="submit" value="Submit"/><br/><br/>
    </form>
    <h3>Progress:</h3>
    <div class="progress-container">
        <div class="progress" style="width:100%">100%</div>
    </div>

    </div></body>
</html>
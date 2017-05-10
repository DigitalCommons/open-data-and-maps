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
        isset($_POST['members']) ? $members = $_POST['members'] : $members = '';
        isset($_POST['volunteervac']) ? $volunteervac = $_POST['volunteervac'] : $volunteervac = '';
        isset($_POST['jobvac']) ? $jobvac = $_POST['jobvac'] : $jobvac = '';
        isset($_POST['foundingyear']) ? $foundingyear = $_POST['foundingyear'] : $foundingyear = '';
        isset($_POST['legal']) ? $legal = $_POST['legal'] : $legal = '';
        isset($_POST['registrar']) ? $registrar = $_POST['registrar'] : $registrar = '';
        isset($_POST['registerednum']) ? $registerednum = $_POST['registerednum'] : $registerednum  = '';



        //Upload Data
        $addinfo = 'UPDATE data SET members = '.$members.', volunteervac = "'.$volunteervac.'", jobvac = "'.$jobvac.'", foundingyear = '.$foundingyear.', legal = "'.$legal.'", legal = "'.$legal.'", registrar = "'.$registrar.'", registerednum = "'.$registerednum.'" WHERE email = "'.$user.'";';
        $result = mysqli_query( $conn, $addinfo ); //needs securing

        header("Location: index.php");
        exit();
        
?>	

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
   </head>
    <body>
    <p>didn't redirect</p>
    

    </body>
</html>
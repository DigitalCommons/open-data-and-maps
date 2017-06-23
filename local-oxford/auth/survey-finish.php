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
        isset($_POST['foundingyear']) ? $foundingyear = $_POST['foundingyear'] : $foundingyear = '';
        isset($_POST['legal']) ? $legal = $_POST['legal'] : $legal = '';
        isset($_POST['registrar']) ? $registrar = $_POST['registrar'] : $registrar = '';
        isset($_POST['registerednum']) ? $registerednum = $_POST['registerednum'] : $registerednum  = '';


        //Upload Data
        $addinfo = 'UPDATE data SET  members = ?,  foundingyear = ?, legal = ?, registrar = ?, registerednum = ? WHERE email = ?;';

        if ($stmt = mysqli_prepare($conn, $addinfo)) {
            mysqli_stmt_bind_param($stmt, "iissss", $members,$foundingyear,$legal,$registrar,$registerednum,$user);
            mysqli_stmt_execute($stmt);
        };

        header("Location: profile.php");
        exit();
        
?>	

<!DOCTYPE html>
<html lang="en">
    <head>
        <link rel="stylesheet" type="text/css" href="styles.css">
        <meta charset="utf-8">
   </head>
    <body>
    <p>didn't redirect</p>
    

    </body>
</html>
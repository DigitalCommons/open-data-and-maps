<?php  session_save_path('/home/pareccoc/cgi-bin/tmp');
		session_start();
		session_regenerate_id();
		if(!isset($_SESSION['user']))      // if there is no valid session
			{
    			header("Location: login.php");
    			exit();
			};
 		
        $id=$_GET['id'];
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
    <h2>Report An Initiative</h2>
    <p>Could you please give a reason why you think this initiative should be removed from the map?</p>
    <form action="report.php" method="POST" id="form">
    <label >Reason:<br/></label>
    <input type="text" name="reason"/><br/>
    <?php echo '<input type="hidden" name="id" value="'.$id.'"/><br/>';?>
    <input class="submit" type="submit" value="Report"/><br/><br/>
    </form>

    </div>


    </body>
</html>
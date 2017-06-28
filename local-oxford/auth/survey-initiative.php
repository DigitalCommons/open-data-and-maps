<?php  session_save_path('/home/pareccoc/cgi-bin/tmp');
		session_start();
		session_regenerate_id();
		if(!isset($_SESSION['user']))      // if there is no valid session
			{
    			header("Location: login.php");
    			exit();
			};

        include('db_login.php');
        $user = $_SESSION['user'];
        $name = $_POST['name'];
        $contact = $_POST['contact'];
        $website = $_POST['website'];
        $phone = $_POST['phone'];
        $street = $_POST['street'];
        $postcode = $_POST['postcode'];
        $latitude = $_POST['latitude'];
        $longitude = $_POST['longitude'];


        // Check if user already exists, don't want double entries
        $checkuser =  "SELECT * FROM data WHERE email='".$user."';";

        if ($statemt = mysqli_prepare($conn, $checkuser)) {
            mysqli_stmt_execute($statemt); 
            $result0 = mysqli_stmt_get_result($statemt);
            };      
        
        if(mysqli_num_rows($result0) == 0){

        //PARAMETRISE
        $addinfo = 'INSERT INTO data (email,contact,street,postcode,website,name,phone,latitude,longitude) VALUES(?,?,?,?,?,?,?,?,?);';

        if ($stmt = mysqli_prepare($conn, $addinfo)) {
            mysqli_stmt_bind_param($stmt, "sssssssdd", $user,$contact,$street,$postcode,$website,$name,$phone,$latitude,$longitude);
            mysqli_stmt_execute($stmt);
        };

        };

        $query_activities = "SELECT label, definition FROM fields WHERE type = 'Activities';"; 
        $result1 = mysqli_query( $conn, $query_activities ); 
        $activities = mysqli_fetch_all($result1); //All these arrays take the form [[label1,def1],[label2,def2]]

        $query_qual = "SELECT label, definition FROM fields WHERE type = 'Qualifiers';"; 
        $result2 = mysqli_query( $conn, $query_qual ); 
        $qualifiers = mysqli_fetch_all($result2);

        $query_lab = "SELECT label, definition FROM fields WHERE type = 'Type of Labour';"; 
        $result3 = mysqli_query( $conn, $query_lab ); 
        $labour = mysqli_fetch_all($result3);

        $query_icons = "SELECT label, definition FROM fields WHERE type = 'Icon';"; 
        $result5 = mysqli_query( $conn, $query_icons ); 
        $icons = mysqli_fetch_all($result5);
?>	

<!DOCTYPE html>
<html lang="en">
    <head>
        <link rel="stylesheet" type="text/css" href="styles.css">
        <script src="https://use.fontawesome.com/76c1f7b47f.js"></script>
        <meta charset="utf-8">
   </head>
    <body class="main" ><div class="content">
    <h3>2/3. Initiative Description</h3>
    <form action="survey-extra.php" method="POST" id="form">
    <label >How would you describe your initiative in one sentence:<br/></label>
    <input type="text" name="sentence"/><br/><br/>
    <label >If you would like to give a longer description please do so here:<br/></label>
    <textarea rows="10" cols="50" name="description"></textarea><br/><br/>
    <label >Pick an icon for the Map which best represents you*:<br/></label>
        <ul class="checkboxes">
            <?php 
                foreach($icons as $array){
                    echo '<li><input type="radio" name="icon" value="'.$array[0].'" /><i class="fa '.$array[0].' fa-lg"></i></li>';
                };
            ?>
                </ul>
    <label >Does your organisation work in any of the following sectors? (choose up to 3):<br/></label>

            <?php 
                foreach($activities as $array){
                    echo '<input type="checkbox" name="provides[]" form="form" value="'.$array[0].'"><label>'.$array[0].'</label><br/>';
                };
            ?>

    <br/>
    <label >Does your initiative identify with any of the following principles? (choose up to 3):<br/></label>
            <?php 
                foreach($qualifiers as $array){
                    echo '<input type="checkbox" name="identity[]" form="form" value="'.$array[0].'"><label class="tooltip">'.$array[0].'<span class="tooltiptext">'.$array[1].'</span></label><br/>';
                };
            ?>
    <br/>
    <label >What kinds of labour does your organisation use? (choose up to 3):<br/></label>
            <?php 
                foreach($labour as $array){
                    echo '<input type="checkbox" name="interaction[]" form="form" value="'.$array[0].'"><label class="tooltip">'.$array[0].'<span class="tooltiptext">'.$array[1].'</span></label><br/>';
                };
            ?>
    <br/>
    <input class="submit" type="submit" value="Submit"/><br/><br/>
    </form>
    <h3>Progress:</h3>
    <div class="progress-container">
        <div class="progress" style="width:66%">66%</div>
    </div>

    </div></body>
</html>
<?php  session_save_path('/home/pareccoc/cgi-bin/tmp');
		session_start();
		session_regenerate_id();
		if(!isset($_SESSION['user']))      // if there is no valid session
			{
    			header("Location: login.php");
    			exit();
			};

        //If there is no data for this user then redirect to initial survey
        include('db_login.php');
        $user = $_SESSION['user'];
        $query = "SELECT * FROM data WHERE email='".$user."';";
        $result = mysqli_query( $conn, $query ); //needs securing
        if (mysqli_num_rows($result) == 0){
            header("Location: survey-basic.php");
                exit();
        };
        $row = mysqli_fetch_row($result);

        $query_activities = "SELECT label, definition FROM fields WHERE type = 'Activities';"; 
        $result1 = mysqli_query( $conn, $query_activities ); //needs securing
        $activities = mysqli_fetch_all($result1); //All these arrays take the form [[label1,def1],[label2,def2]]

        $query_qual = "SELECT label, definition FROM fields WHERE type = 'Qualifiers';"; 
        $result2 = mysqli_query( $conn, $query_qual ); //needs securing
        $qualifiers = mysqli_fetch_all($result2);

        $query_lab = "SELECT label, definition FROM fields WHERE type = 'Type of Labour';"; 
        $result3 = mysqli_query( $conn, $query_lab ); //needs securing
        $labour = mysqli_fetch_all($result3);

        $query_leg = "SELECT label, definition FROM fields WHERE type = 'Legal Form';"; 
        $result4 = mysqli_query( $conn, $query_leg ); //needs securing
        $legal = mysqli_fetch_all($result4);

        $query_icons = "SELECT label, definition FROM fields WHERE type = 'Icon';"; 
        $result5 = mysqli_query( $conn, $query_icons ); //needs securing
        $icons = mysqli_fetch_all($result5);
 		
?>	


<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7/leaflet.css"/>
        <link rel="stylesheet" type="text/css" href="styles.css">
        <script src="https://use.fontawesome.com/76c1f7b47f.js"></script>
   </head>
    <body class="main" ><div class="content">
    <h2>Your Information</h2>
    <p>View and change your information below</p>
    <form action="change-data.php" method="POST" id="form"></form>
    <table>
        <tr>
            <th>Field</th>
            <th>Current Info</th>
            <th>Add or Change Info</th>
            <th></th>
        </tr>    
        <tr><th colspan="4">Basic Info</th>
        </tr>
        <tr>
            <td>Username/email</td>
            <td><?php echo $row[0]; ?></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td>Your Map Location</td>
            <td><p>Latitude: <?php echo round($row[24],2); ?></p><p>Longitude: <?php echo round($row[25],2); ?></p></td>
            <td><p>Click your location, then submit</p><div id="map" style="height: 400px; margin:auto;"></div><p>Latitude: <span id="myLat"></span></p><p>Longitude: <span id="myLng"></span></p>
            <input type="hidden" id="lat" form="form" value="" name="latitude" />
            <input type="hidden" id="lng" form="form" value="" name="longitude" /></td>
            <td><input type="submit" value="Submit" form="form"/></td>
        </tr>
        
        <tr>
            <td>Name</td>
            <td><?php echo $row[5]; ?></td>
            <td><input type="text" name="name" form="form"/></td>
            <td><input type="submit" value="Submit" form="form"/></td>
        </tr>
        <tr>
            <td>Public Email</td>
            <td><?php echo $row[1]; ?></td>
            <td><input type="text" name="contact" form="form"/></td>
            <td><input type="submit" value="Submit" form="form"/></td>
        </tr>
        <tr>
            <td>Website</td>
            <td><?php echo $row[4]; ?></td>
            <td><input type="text" name="website" form="form"/></td>
            <td><input type="submit" value="Submit" form="form"/></td>
        </tr>
        <tr>
            <td>Phone Number</td>
            <td><?php echo $row[6]; ?></td>
            <td><input type="text" name="phone" form="form"/></td>
            <td><input type="submit" value="Submit" form="form"/></td>
        </tr>
        <tr>
            <td>Address</td>
            <td><?php echo $row[2]; ?></td>
            <td><input type="text" name="street" form="form"/></td>
            <td><input type="submit" value="Submit" form="form"/></td>
        </tr>
        <tr>
            <td>Postcode</td>
            <td><?php echo $row[3]; ?></td>
            <td><input type="text" name="postcode" form="form"/></td>
            <td><input type="submit" value="Submit" form="form"/></td>
        </tr>

        </tr>    
        <tr><th colspan="4">Initiative Description</th>
        </tr>
        <tr>
            <td>Pick a Map Icon</td>
            <td><i class= <?php echo '"fa '.$row[23].' fa-2x"'; ?> ></i></td>
            <td>
                <ul class="checkboxes">
                <?php 
                foreach($icons as $array){
                    echo '<li><input type="radio" form="form" name="icon" value="'.$array[0].'" /><i class="fa '.$array[0].' fa-2x"></i></li>';
                };
            ?>
                </ul></td>
            <td><input type="submit" value="Submit" form="form"/></td>
        </tr>
        <tr>
            <td>Sentence Description</td>
            <td><?php echo $row[7]; ?></td>
            <td><input type="text" name="sentence" form="form"/></td>
            <td><input type="submit" value="Submit" form="form"/></td>
        </tr>
        <tr>
            <td>Full Description</td>
            <td><?php echo $row[8]; ?></td>
            <td><textarea rows="10" cols="50" name="description" form="form"></textarea></td>
            <td><input type="submit" value="Submit" form="form"/></td>
        </tr>
        <tr>
            <td>Provides (direct needs)</td>
            <td><?php echo $row[14].'<br/>'.$row[15].'<br/>'.$row[16]; ?></td>
            <td><label >Does your organisation work in any of the following sectors? (choose up to 3):<br/><br/></label>
            <?php 
                foreach($activities as $array){
                    echo '<input type="checkbox" name="provides[]" form="form" value="'.$array[0].'"><label>'.$array[0].'</label><br/>';
                };
            ?>
        </td>
            <td><input type="submit" value="Submit" form="form"/></td>
        </tr>
        <tr>
            <td>Identity</td>
            <td><?php echo $row[17].'<br/>'.$row[18].'<br/>'.$row[19]; ?></td>
            <td><label >Does your initiative identify with any of the following principles? (choose up to 3):<br/><br/></label>
            <?php 
                foreach($qualifiers as $array){
                    echo '<input type="checkbox" name="identity[]" form="form" value="'.$array[0].'"><label class="tooltip">'.$array[0].'<span class="tooltiptext">'.$array[1].'</span></label><br/>';
                };
            ?>
            </td>
            <td><input type="submit" value="Submit" form="form"/></td>
        </tr>
        <tr>
            <td>Interaction</td>
            <td><?php echo $row[20].'<br/>'.$row[21].'<br/>'.$row[22]; ?></td>
            <td><label >What kinds of labour does your organisation use? (choose  up to 3):<br/><br/></label>
            <?php 
                foreach($labour as $array){
                    echo '<input type="checkbox" name="interaction[]" form="form" value="'.$array[0].'"><label>'.$array[0].'</label><br/>';
                };
            ?>
        </td>
            <td><input type="submit" value="Submit" form="form"/></td>
        </tr>


        <tr><th colspan="4">Extra Info</th>
        </tr>

        <tr>
            <td>How many members does your initiative have?</td>
            <td><?php echo $row[13]; ?></td>
            <td><input type="text" form="form" name="members"/></td>
            <td><input type="submit" value="Submit" form="form"/></td>
        </tr>

        <tr>
            <td>In which year were you founded?</td>
            <td><?php echo $row[10]; ?></td>
            <td><input type="text" form="form" name="foundingyear"></td>
            <td><input type="submit" value="Submit" form="form"/></td>
        </tr>

        <tr>
            <td>Which legal form does you initiative have?</td>
            <td><?php echo $row[9]; ?></td>
            <td><select name="legal" form="form"><option selected disabled>Choose</option>
                <?php 
                foreach($legal as $array){
                    echo '<option value="'.$array[0].'">'.$array[0].'</option>';
                };
                ?>
            </select></td>
            <td><input type="submit" value="Submit" form="form"/></td>
        </tr>

        <tr>
            <td>Does your initiative have a registering body (eg Companies House, Charity Commission)?</td>
            <td><?php echo $row[11]; ?></td>
            <td><input type="text" form="form" name="registrar"></td>
            <td><input type="submit" value="Submit" form="form"/></td>
        </tr>

        <tr>
            <td>What is your registered number with that registrar?</td>
            <td><?php echo $row[12]; ?></td>
            <td><input type="text" form="form" name="registerednum"></td>
            <td><input type="submit" value="Submit" form="form"/></td>
        </tr>

    </table>

    <a class="button" href="http://solidarityeconomics.org">Go to the Main Site</a>
    <a class="button" href="change-password.php">Click to Change Password</a>



    </div>

<script
        src="http://cdn.leafletjs.com/leaflet-0.7/leaflet.js">
    </script>

    <script>
        var map = L.map('map').setView([51.75, -1.25], 12);
        mapLink = 
            '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
            }).addTo(map);
       <?php if($row[24]!=0){

        echo "L.marker([$row[24],$row[25]],
                {
                icon: L.divIcon({
        className: \"fa-icon\",
        // html here defines what goes in the div created for each marker
        html: '<i class=\"fa fa-user fa-2x\"></i>',
        // and the marker width and height
        iconSize: [40, 40]})
}).addTo(map);";};
?>


        document.getElementById('map').style.cursor = 'crosshair';

        map.on('click', function(e) {

    var gpsLat = e.latlng.lat;
    var gpsLng = e.latlng.lng;

        document.getElementById("myLat").innerHTML=gpsLat;
        document.getElementById("myLng").innerHTML=gpsLng;

        document.getElementById('lat').value = gpsLat;
        document.getElementById('lng').value = gpsLng;


});


    </script>

    </body>
</html>



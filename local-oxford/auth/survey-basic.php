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
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7/leaflet.css"/>
    <link rel="stylesheet" type="text/css" href="styles.css">
        <meta charset="utf-8">
   </head>
    <body class="main" ><div class="content">

    <h1 id="title">Oxford Solidarity Economy Mapping</h1>
    <p style="margin-top: 20px;">Thanks for registering! We currently don't have any information on your initiative, please answer the following questions. </p><p>It should take about <strong>5 minutes</strong> to answer them all, but feel free to <strong>skip some.</strong></p><p style="padding-bottom:20px; margin-bottom:20px; border-bottom: 3px solid #0bb696;">All of the information you enter here will be open data, accessible to anyone, but you will be able to <strong>change it at any time.</strong> Please see our <a href=privacy.php>privacy policy</a> for more information.</p>


    <form action="survey-initiative.php" method="POST" id="form">
    <label >Initiative's Name*:<br/></label>
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
    <label>Choose your location on the map, zoom in to be more precise, then press submit*:<br/></label>
    <p>Latitude: <span id="myLat">____</span></p><p>Longitude: <span id="myLng">____</span></p><br/>
    <div id="map" style="height: 400px; width:600px;"></div>
    <input type="hidden" id="lat" form="form" value="" name="latitude" />
    <input type="hidden" id="lng" form="form" value="" name="longitude" />
    <input class="submit" type="submit" value="Submit"/><br/><br/>
    </form>
    <h3>Progress:</h3>
    <div class="progress-container">
        <div class="progress" style="width:33%">33%</div>
    </div>

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
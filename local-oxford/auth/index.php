 <?php  session_save_path('/home/pareccoc/cgi-bin/tmp');
        session_start();
        session_regenerate_id();
        if(isset($_SESSION['user']))      //Keep user logged in
            {
            $user = $_SESSION['user'];
            };


        include('db_login.php');



        //Retrieve data securely
        if ($stmt = mysqli_prepare($conn, "SELECT * FROM data;")) {
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            //all data for this user stored in this array
            $data = mysqli_fetch_all($result);

            };


        mysqli_close($conn);
        
?>  


<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7/leaflet.css"/>
        <link rel="stylesheet" type="text/css" href="styles.css">
        <link rel="stylesheet" href="leaflet.awesome-markers.css">
        <script src="https://use.fontawesome.com/76c1f7b47f.js"></script>

   </head>
    <body style="padding:0px; margin:0px;">
    <div class="header row" id="navbar">
            <a class="button" href="info.php">About</a>            
            <a class="button" href="login.php">Log in</a>
            <a class="button" href="register.php">Register</a>
    </div>
    <div class="body row">
        <div class="left col scroll-y" id="detail">
            <h1>Welcome to the Solidarity Economy in Oxford</h1>
    <p>Please explore some of the great things that are happening in Oxford. If you are involved in an initiative which is beneficial for people or planet please take 5 minutes to register and add yourself to the map!</p>
<p>Click on a marker to display information for that initiative</p>
        </div>
        <div class="right col" id="map">
        </div>
    </div>





<script src="http://cdn.leafletjs.com/leaflet-0.7/leaflet.js"></script>
<script src="leaflet.awesome-markers.js"></script>
<script>

        var map = L.map('map').setView([51.75, -1.25], 12);
        mapLink = 
            '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
            }).addTo(map);

        <?php
            foreach($data as $row){
                if(!is_null($row[24])){
                echo "
                var marker = new L.marker([$row[24],$row[25]],
                {
                icon: L.AwesomeMarkers.icon({icon: '".ltrim($row[23],'fa-')."',iconColor:'white', markerColor: 'darkpurple', prefix: 'fa'}),
                title: '$row[5]'
                })
                .addTo(map).bindPopup('$row[5]');

                marker.contact = '$row[1]';
                marker.street = '$row[2]';
                marker.postcode = '$row[3]';
                marker.website = '$row[4]';
                marker.name = '$row[5]';
                marker.phone = '$row[6]';
                marker.sentence = '$row[7]';
                marker.description = '$row[8]';
                marker.legal = '$row[9]';
                marker.foundingyear = '$row[10]';
                marker.registrar = '$row[11]';
                marker.registerednum = '$row[12]';
                marker.members = '$row[13]';
                marker.providesa = '$row[14]';
                marker.providesb = '$row[15]';
                marker.providesc = '$row[16]';
                marker.identitya = '$row[17]';
                marker.identityb = '$row[18]';
                marker.identityc = '$row[19]';
                marker.interactiona = '$row[20]';
                marker.interactionb = '$row[21]';
                marker.interactionc = '$row[22]';

                marker.on('click', onMarkerClick);
                ";
                };
            };
        ?>

        function onMarkerClick(e) {
                document.getElementById("detail").innerHTML = "<h1>"+e.target.name+"</h1><p>"+e.target.sentence+"</p>";
        }


    </script>


    </body>
</html>

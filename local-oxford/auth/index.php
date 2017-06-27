<?php  session_save_path('/home/pareccoc/cgi-bin/tmp');
        session_start();
        session_regenerate_id();




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
        <link rel="stylesheet" type="text/css" href="http://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/0.4.0/MarkerCluster.css" />
        <link rel="stylesheet" type="text/css" href="http://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/0.4.0/MarkerCluster.Default.css" />
        <script src="https://use.fontawesome.com/76c1f7b47f.js"></script>

   </head>
    <body style="padding:0px; margin:0px;">
    <div class="header row" id="navbar">
            <a class="button" href="info.php">About</a>
<?php       
        if (isset($_SESSION['user'])){
            echo'<a class="button" href="profile.php">Access your Data</a>';
        }
        else{
            echo '<a class="button" href="login.php">Log in</a>
            <a class="button" href="register.php">Register</a>';
            };?>
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
<script type='text/javascript' src='http://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/0.4.0/leaflet.markercluster.js'></script>
<script>

        var map = L.map('map').setView([51.75, -1.25], 12);
        mapLink = 
            '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
            }).addTo(map);

        var markerClusters = L.markerClusterGroup(
            {
                maxClusterRadius:20
            });

        //Convert the Data to JSON
        var data = <?php echo json_encode($data, JSON_HEX_TAG);?>;


        var dataLength = data.length;

        for (var i = 0; i < dataLength; i++) {

            var marker = L.marker([data[i][24],data[i][25]],
                {
                icon: L.AwesomeMarkers.icon({icon: data[i][23].replace(" ","").substr(3), iconColor:'white', markerColor: 'darkpurple', prefix: 'fa'}),
                title: data[i][5]
                })
                .bindPopup(data[i][5]);

                marker.dataId = i;

                marker.on('click', onMarkerClick);

                markerClusters.addLayer(marker);
};

        map.addLayer(markerClusters);

        var descriptionLayout = [["<h1>",[5],"</h1>"],["<p>",[7],"</p>"],["<h2>","Contact Info","</h2>"],["<p>",[1,2,3,4,6],"</p>"],["<h2>","Sectors of Activity","</h2>"],["<p>",[14,15,16],"</p>"],["<h2>","Values","</h2>"],["<p>",[17,18,19],"</p>"],["<h2>","Types of Labour","</h2>"],["<p>",[20,21,22],"</p>"],["<h2>","Description","</h2>"],["<p>",[8],"</p>"],["<h2>","Extra Info","</h2>"],["<p>Number of Members - ",[13],"</p>"],["<p>Legal Form - ",[9],"</p>"],["<p>Founding Year - ",[10],"</p>"],["<p>Registrar - ",[11],"</p>"],["<p>Registered Number - ",[12],"</p>"],["<h2>","Data Last Updated","</h2>"],["<p>",[27],"</p>"]];

        function onMarkerClick(e) {

                var initiativeDescription = '';

                for (var x = 0; x < descriptionLayout.length; x++) {
                    if( typeof descriptionLayout[x][1] === 'string') {
                        initiativeDescription += descriptionLayout[x][0]+descriptionLayout[x][1]+descriptionLayout[x][2];
                    }
                    else{
                        for (var y = 0; y < descriptionLayout[x][1].length; y++) {
                            if(data[e.target.dataId][descriptionLayout[x][1][y]]!= '' && data[e.target.dataId][descriptionLayout[x][1][y]]!= null){
                            initiativeDescription += descriptionLayout[x][0]+data[e.target.dataId][descriptionLayout[x][1][y]]+descriptionLayout[x][2];
                            };
                        };
                    }
                }

                <?php //Add a report option for registered users
                    if(isset($_SESSION['user']))    
                    {
                    echo 'initiativeDescription += "<br/><a href=report.php?id="+data[e.target.dataId][26]+">Click to Report if this initiative should not be on the map</a>";';
                    };
                ?>


                document.getElementById("detail").innerHTML = initiativeDescription;
        }


    </script>


    </body>
</html>

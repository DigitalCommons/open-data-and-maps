<?php  session_save_path('/home/pareccoc/cgi-bin/tmp');
		session_start();
		session_regenerate_id();
 		
?>	

<!DOCTYPE html>
<html lang="en">
    <head>
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7/leaflet.css"/>
    <link rel="stylesheet" type="text/css" href="styles.css">
        <meta charset="utf-8">
   </head>
    <body class="main" ><div class="content">

    <h1 id="title">About</h1>
    
    <p>The Oxford Solidarity Economy Map has been created to help Oxfordians discover the great initiatives in their local area.</p>

    <p>It is a part of the "Linked Open Data" project at the Solidarity Economy Association, also based in Oxford. This application will be making all the data we collect available in a really open and accessible way, which will mean that when other people make other applications it'll be easy for them to use the same data.</p>

    <p>The Solidarity Economy Association's aim is to support the Solidarity Economy movement through education, research, and finding opportunities for collaboration. Our website is will be launched soon.

    <p>It is important to us that this map isn't just a snapshot of Oxford, but that it stays up to date and accurate, to do this we have given each initiative a user profile where they can login and change their data at any time.</p>

    <p>While the majority of data will be publicly available, private emails and passwords are kept very securely, as explained in our <a href="privacy.php">Privacy Policy</a>.</p>

    <p>Also, all the code used to create this application is openly available <a href="https://github.com/p6data-coop/ise-linked-open-data/tree/master/local-oxford"> on GitHub here</a>.

    <p><strong>Thanks for visiting the map, and enjoy!</strong></p>


    <a class="button" href="index.php">Go to the Map</a>
    <a class="button" href="profile.php">Go to your data</a>

    </div>



    </body>
</html>
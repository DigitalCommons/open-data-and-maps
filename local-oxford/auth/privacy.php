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

    <h1 id="title">Privacy Policy</h1>
    
    <p>The Oxford Solidarity Economy Map is a project to make data about local initiatives visible to everyone, not only that but we intend to share the data in the most open format we can, Linked Open Data, which will make it easier for developers to build applications on top of it.</p><p>For this reason you can understand why the data you share is in no sense private, the whole point is for you to be discovered!</p>
    <p>On the other hand, the email you choose for us to contact you on, and the password you choose, will be completely secure and private. Here is how we are handling the various aspects of your data.</p>
    <h2>Your Private Email</h2>
    <p>When you register with us you are asked to use an email as your login ID, this email is not the same as the one which is publicly displayed on the map</p>
    <p>In line with the Data Protection Act, this email is processed as follows:</p>
    <p><strong>Fairly and lawfully</strong> - this means that we must <ul style="list-style-type: circle; margin-left:30px;"><li>have legitimate grounds for collecting and using the personal data;</li><li>not use the data in ways that have unjustified adverse effects on the individuals concerned;</li><li>be transparent about how we intend to use the data, and give individuals appropriate privacy notices when collecting their personal data;</li><li>handle people’s personal data only in ways they would reasonably expect;</li><li>make sure we do not do anything unlawful with the data</li></ul></p>
<p><strong>Processed for limited purposes</strong> - We won't use your email for anything other than the map.</p>
<p><strong>Adequate, relevant and not excessive</strong></p>
<p><strong>Accurate and up to date</strong> - as far as is possible for us.</p>
<p><strong>Not kept for longer than is necessary</strong> - if you leave the map your email will not be kept.</p>
<p><strong>Processed in line with your rights</strong></p>
<p><strong>Secure</strong> - The email is held on an SQL database on our server, our application is written carefully so that the database cannot be hacked into. Only by logging into our private server can the database be accessed. When other data from the database is displayed, your personal email is removed in a secure way.</p>
<p><strong>Not transferred to other countries without adequate protection</strong></p>

    <h2>Your Password</h2>
    <p>Your password is encrypted in a way that not even the website's administrators can see what it is. If our database was ever stolen or hacked into then your password would appear as a string of random characters and would be useless.</p>
    <p>If you forget your password, you can generate a new one to be sent to your email address, we cannot see what this new password is, although if anyone got access to your email account they would, so we recommend you change it straight away.</p>

    <h2>The rest of the data</h2>
    <p>All other fields will be openly published and we cannot be held responsible for what anybody chooses to do with this data.</p>
    <p>You will have the ability to delete your account and all of its data at any point, however it is likely that copies of it will remain on the internet.</p>
    <p>You will have the ability to change your data at any time, to make sure that it is up to date and you are presented on our map as you prefer.</p>

    <a class="button" href="index.php">Go to the Map</a>
    <a class="button" href="profile.php">Go to your data</a>

    </div>



    </body>
</html>
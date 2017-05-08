<?php
$servername='localhost'; 
$dbname='oxford_data'; 
$username='root'; 
$password='yourpass';

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>
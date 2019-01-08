<?php

// Experiment using dummy data:
//$res = [
//TODO - if you ever want to use this mechanism again, you need to update it to match the current JSON API.
	//[ "name" => "Fred's hypothetical co-op", "uri" => "http://bla.org/1", "lat" => 51.2, "lng" => 0.01, "www" => "http://bla.org" ],
	//[ "name" => "Jane's hypothetical co-op", "uri" => "http://bla.org/1", "lat" => 52.2, "lng" => -0.01, "www" => "http://bla.org" ],
//];
//echo json_encode($res);

$res = file_get_contents('initiatives.json');
echo $res;
?>


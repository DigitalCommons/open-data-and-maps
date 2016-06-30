<?php
// Just create some dummy data for now.
$res = [
	[ "name" => "Fred's hypothetical co-op", "uri" => "http://bla.org/1", "lat" => 51.2, "lng" => 0.01, "www" => "http://bla.org" ],
	[ "name" => "Jane's hypothetical co-op", "uri" => "http://bla.org/1", "lat" => 52.2, "lng" => -0.01, "www" => "http://bla.org" ],
];
echo json_encode($res);
?>


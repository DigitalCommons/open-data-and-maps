<html>
<head>
<link rel="stylesheet" type="text/css" href="style.css">
<head/>
<body>

<form action="index.php" method="get">
	Start Search again:<br>
 	<input type="text" name="company">
	<input type="submit" value="Submit">
</form>

<?php
if($_GET){$input = htmlspecialchars($_GET["company"]);

	#Generate $query with $input as argument
	include 'competitors-query.php';

	#Get $endpoint
	$endpoint = trim(file_get_contents('endpoint.txt'));

	#Execute query with arguments, $query and $endpoint, returning json object, $response
	include 'request-results.php';

	#Quick Description of SIC Label 
	echo '<h3>Here are all the nearby companies with the SIC label "';
	$res = json_decode($response, true);
	echo $res["results"]["bindings"][0]["siclabel"]["value"].'":</h3>';

	#Create a table, with $headings $parameters and $json string
	$headings = array('Competitor Name','Postcode');
	$parameters	= array('name','postcode');
	$json = $response;
	include 'create-table.php';
	

}
?>

</body>
</html>
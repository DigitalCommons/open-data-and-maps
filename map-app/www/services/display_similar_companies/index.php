<html>
<head>
<link rel="stylesheet" type="text/css" href="style.css">
<head/>
<body>

<form action="index.php" method="get">
	Type in some text to search for a company:<br>
 	<input type="text" name="company">
	<input type="submit" value="Submit">
</form>

<?php
if($_GET){$input=htmlspecialchars($_GET["company"]);

	#Generate $query with $input as argument
	include 'search-query.php';

	#Get $endpoint
	$endpoint = trim(file_get_contents('endpoint.txt'));

	#Execute query with arguments, $query and $endpoint, returning json object, $response
	include 'request-results.php';
	$json=$response;

	#CREATE TABLE

	#write the table headers
	echo '<table><tr><td>Company</td></tr>' ;

	$res = json_decode($json, true);

	foreach($res["results"]["bindings"] as $item) {
	
		echo '<tr>' ;
		echo '<td><a href="display-competitors.php?company=	'.$item["company"]["value"].'">'.$item["companyName"]["value"].'</a></td>' ;
		}
		echo '</tr>' ;
	}

	echo '</table>' ;

	

?>

</body>
</html>
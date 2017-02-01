<html>
<head>
<link rel="stylesheet" type="text/css" href="style.css">
<head/>
<body>

<?php
function report_error_and_die($msg)
{
	$result = array();
	// API response uses JSend: https://labs.omniti.com/labs/jsend
	$result["status"] = "error";
	$result["message"] = $msg;
	if (function_exists('http_response_code')) {
		http_response_code(500);
	}
	else {
		// TODO - use header() function
	}
	echo json_encode($result);
	exit(1);
}

function request($url){

	// is curl installed?
	if (!function_exists('curl_init')){ 
		report_error_and_die("PHP can't find function curl_init. Is CURL installed?");
	}
	$ch= curl_init();

	$headers = array(
		"Accept: application/sparql-results+json"
	);

	// set request url
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

	// return response, don't print/echo
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	//curl_setopt($ch, CURLOPT_TIMEOUT, 300);
	//curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 60);

	// See curl docs: http://www.php.net/curl_setopt

	$response = curl_exec($ch);
	if (curl_errno($ch)) { 
		report_error_and_die("PHP curl_exec produces error: " . curl_error($ch)); 
	}

	curl_close($ch);

	return $response;
}
if ($_GET) {
	$input = htmlspecialchars($_GET["company"]);

	#Generate $query with $input as argument
	include 'competitors-query.php';

	#Get $endpoint
	$endpoint = trim(file_get_contents('endpoint.txt'));

	#Execute query with arguments, $query and $endpoint, returning json object, $response
	$requestURL = $endpoint.'?' .'query='.urlencode($query);
	$response = request($requestURL);
	//include 'request-results.php';

	echo '<p>'.$input.'</p>';
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

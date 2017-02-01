<html>
<head>
<link rel="stylesheet" type="text/css" href="style.css">
<head/>
<body>
<p>foo</p>

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
function sparql_query($company_uri) {
	return '

PREFIX spatial: <http://data.ordnancesurvey.co.uk/ontology/spatialrelations/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX terms: <http://business.data.gov.uk/companies/def/terms/>
PREFIX postcode: <http://data.ordnancesurvey.co.uk/ontology/postcode/>
PREFIX rov: <http://www.w3.org/ns/regorg#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>


SELECT ?name ?postcode ?siclabel WHERE {

#Finds Companys Postcode and SIC code
?add postcode:postcode ?pc .														
<'.$company_uri.'> terms:registeredAddress ?add ;    
rov:orgActivity ?sic .
?sic skos:prefLabel ?siclabel .


#Go to OS for finding postcodes in same sector
SERVICE <http://data.ordnancesurvey.co.uk/datasets/os-linked-data/apis/sparql> {
	?pc spatial:within ?sec .
	?sec a postcode:PostcodeSector .
	?x rdfs:label ?postcode .
  ?x a postcode:PostcodeUnit .
  ?x spatial:within ?sec.
}

#Find companies that have those postcodes and SIC code										
?company terms:registeredAddress ?address . 
?address postcode:postcode ?x .
?company rov:orgActivity ?sic .
?company rov:legalName ?name .

}
';
}
if ($_GET) {
	$input = htmlspecialchars($_GET["company"]);

	#Generate $query with $input as argument
	//include 'competitors-query.php';
	$query = sparql_query($input);

	#Get $endpoint
	$endpoint = trim(file_get_contents('endpoint.txt'));

	#Execute query with arguments, $query and $endpoint, returning json object, $response
	$requestURL = $endpoint.'?' .'query='.urlencode($query);
	$response = request($requestURL);

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

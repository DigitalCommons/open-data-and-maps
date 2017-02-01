<html>
<head>
<link rel="stylesheet" type="text/css" href="style.css">
<head/>
<body>
<p>foo1</p>

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
function create_table($headings, $parameters, $res) {
	echo '<table><tr>';
	foreach($headings as $heading) {
		echo '<td>'.$heading.'</td>' ;
	};
	echo '</tr>' ;

	foreach($res["results"]["bindings"] as $item) {

		echo '<tr>' ;
		foreach($parameters as $key) {
			echo '<td>'.$item[$key]["value"].'</td>' ;
		}
		echo '</tr>' ;
	}

	echo '</table>' ;
}
if ($_GET) {
	$input = htmlspecialchars($_GET["company"]);

	$query = sparql_query($input);

	$endpoint = 'business.data.gov.uk/companies/query';

	#Execute query with arguments, $query and $endpoint, returning json object, $response
	$sparqlURL = $endpoint.'?' .'query='.urlencode($query);
	$json = request($sparqlURL);

	echo '<p>'.$input.'</p>';
	$res = json_decode($json, true);
	if (array_key_exists(0, $res["results"]["bindings"])) {
		echo '<h3>Here are all the nearby companies with the SIC label "';
		echo $res["results"]["bindings"][0]["siclabel"]["value"].'":</h3>';

		$headings = array('Company Name','Postcode');
		$parameters	= array('name','postcode');
		create_table($headings, $parameters, $res);
	}
	else {
		echo '<p>No results found</p>';
	}
}
?>

</body>
</html>

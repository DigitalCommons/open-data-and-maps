<html>
<head>
<link rel="stylesheet" type="text/css" href="style.css">
<head/>
<body>
<h1>SPARQL query demonstration</h1>
We perform a query on the Linked Open Data for Companies House to obtain a list of companies that are within the same postcode sector as our target company, and are in the same line of business.
The relationship between postcodes and postcode sectors is obtained from Linked Open Data published by Ordnance Survey.

<?php
function report_error_and_die($msg)
{
	echo '<h3>Sorry - there was an error</h3>';
	echo '<p>'.$msg.'</p>';
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

SELECT ?name ?res_comp_uri ?res_comp_name ?res_postcode ?res_postcode_uri ?sic ?siclabel ?sec ?sec_label WHERE {

	#Finds Company\'s Postcode and SIC code
	<'.$company_uri.'> terms:registeredAddress ?add ;
		rov:orgActivity ?sic ;
		rov:legalName ?name .
	?sic skos:prefLabel ?siclabel .
	?add postcode:postcode ?pc .
	?pc spatial:within ?sec .
	?sec a postcode:PostcodeSector ;
		rdfs:label ?sec_label .

	#Find companies that have those postcodes and SIC code
	?res_comp_uri terms:registeredAddress ?address .
	?address postcode:postcode ?res_postcode_uri .
	?res_postcode_uri spatial:within ?sec ;
		rdfs:label ?res_postcode .
	?res_comp_uri rov:orgActivity ?sic ;
		rov:legalName ?res_comp_name .
}
';
}
function create_table($headings, $parameters, $res) {
	echo '<h3>Results</h3>';
	echo '<table><tr>';
	foreach($headings as $heading) {
		echo '<th>'.$heading.'</th>' ;
	};
	echo '</tr>' ;

	foreach($res["results"]["bindings"] as $item) {

		echo '<tr>' ;
		echo '<td><a href="'.$item["res_comp_uri"]["value"].'">'.$item["res_comp_name"]["value"].'</a></td>';
		echo '<td><a href="'.$item["res_postcode_uri"]["value"].'">'.$item["res_postcode"]["value"].'</a></td>';
		//foreach($parameters as $key) {
			//echo '<td>'.$item[$key]["value"].'</td>' ;
		//}
		echo '</tr>' ;
	}

	echo '</table>' ;
}
if (isset($_GET["company"])) {
	$companyURI = htmlspecialchars($_GET["company"]);
	$query = sparql_query($companyURI);
	$endpoint = 'business.data.gov.uk/companies/query';

	#Execute query with arguments, $query and $endpoint, returning json object, $response
	$sparqlURL = $endpoint.'?' .'query='.urlencode($query);
	$json = request($sparqlURL);

	$res = json_decode($json, true);
	if (array_key_exists(0, $res["results"]["bindings"])) {
		echo '<table>';
		echo '<tr>';
		echo '<th>Target company:</th>';
		echo '<td><a href="'.$companyURI.'">'.$res["results"]["bindings"][0]["name"]["value"].'</a></td>';
		echo '</tr>';
		echo '<tr>';
		echo '<th>Line of Business:</th>';
		echo '<td><a href="'.$res["results"]["bindings"][0]["sic"]["value"].'">'.$res["results"]["bindings"][0]["siclabel"]["value"].'</a></td>';
		echo '</tr>';
		echo '<tr>';
		echo '<th>Postcode sector:</th>';
		echo '<td><a href="'.$res["results"]["bindings"][0]["sec"]["value"].'">'.$res["results"]["bindings"][0]["sec_label"]["value"].'</a></td>';
		echo '</tr>';
		echo '</table>';

		$headings = array('Company Name','Postcode');
		$parameters	= array('res_comp_name','res_postcode');
		create_table($headings, $parameters, $res);
	}
	else {
		echo '<p>No results found using the company URI <a href="'.$companyURI.'">'.$companyURI.'</a>. This may be because the company is dissolved, and so no longer included in results from Companies House.</p>';
	}
	echo '<h3>SPARQL query</h3>';
	echo '<p> For those who are interested in the techincal details...</p>';
	echo '<p>SPARQL endpoint: <code>'. htmlspecialchars($endpoint). '</code></p>';
	echo '<p>Here is the SPARQL query that was used to obtain the results shown above:</p>';
	echo '<div class="code"><pre>'.htmlspecialchars($query).'</pre></div>';
}
else {
	report_error_and_die('Expected parameter "company" not found.');
}
?>

</body>
</html>

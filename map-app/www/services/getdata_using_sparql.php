<?php 
// Based on code originally written by:
// Author: John Wright
// Website: http://johnwright.me/blog
// This code is live @ 
// http://johnwright.me/code-examples/sparql-query-in-code-rest-php-and-json-tutorial.php
function report_success($response) 
{
	$result = array();
	// API response uses JSend: https://labs.omniti.com/labs/jsend
	$result["status"] = "success";
	$result["data"] = $response;
	echo json_encode($result);
}
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
function getSparqlUrl($query_name)
{
	// TODO - pass in SPARQL parameters as script arguments?

	$query = file_get_contents(__DIR__ . '/' . $query_name.'/query.rq');
	$endpoint = trim(file_get_contents(__DIR__ . '/' . $query_name.'/endpoint.txt'));
	$default_graph_uri = trim(file_get_contents(__DIR__ . '/' . $query_name.'/default-graph-uri.txt'));

	// TODO - Consider using HTTP POST?
	$searchUrl = $endpoint.'?'
		.'default-graph-uri='.urlencode($default_graph_uri)
		.'&query='.urlencode($query);

	return $searchUrl;
}
function request($url){

	// is curl installed?
	if (!function_exists('curl_init')){ 
		report_error_and_die("PHP can't find function curl_init. Is CURL installed?");
	}
	$ch= curl_init();

	$headers = array(
		"Accept: application/json"
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
$query_name = 'coops-uk2017';
$requestURL = getSparqlUrl($query_name);
$response = request($requestURL);
$res = json_decode($response, true);

// The keys correspond to two things:
//   1. The names of the variables used in the SPARQL query (see Initiative::create_sparql_files in generate-triples.rb)
//   2. The names used in the JSON that is returned to the map-app
$keys = array("name", "uri", "within", "lat", "lng", "www", "regorg");

$result = array();
foreach($res["results"]["bindings"] as $item) {
	$obj = array();
	foreach($keys as $key) {
		// Some keys are optional (e.g. www and regorg). Check a key is defined before using it:
		if (array_key_exists($key, $item)) {
			$obj[$key] = $item[$key]["value"];
		}
	}
	array_push($result, $obj);
}
report_success($result);
?>

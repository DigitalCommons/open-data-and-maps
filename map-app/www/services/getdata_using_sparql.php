<?php 
// Author: John Wright
// Website: http://johnwright.me/blog
// This code is live @ 
// http://johnwright.me/code-examples/sparql-query-in-code-rest-php-and-json-tutorial.php
function getSparqlUrl($query_name)
{
	// TODO - pass in SPARQL parameters as script arguments?

	$query = file_get_contents($query_name.'/query.rq');
	$endpoint = trim(file_get_contents($query_name.'/endpoint.txt'));
   $default_graph_uri = trim(file_get_contents($query_name.'/default-graph-uri.txt'));
 
   // TODO - Consider using HTTP POST?
   $searchUrl = $endpoint.'?'
	  .'default-graph-uri='.urlencode($default_graph_uri)
      .'&query='.urlencode($query);
	  
   return $searchUrl;
}
function request($url){
 
   // is curl installed?
   if (!function_exists('curl_init')){ 
      die('CURL is not installed!');
   }
   //echo 'curl_init OK';
 
   // get curl handle
   $ch= curl_init();

   $headers = array(
	   "Accept: application/json"
   );
 
   // set request url
   curl_setopt($ch, CURLOPT_URL, $url);
   curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
 
   // return response, don't print/echo
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
   //echo 'curl_setopt OK';
 
   /*
   Here you find more options for curl:
   http://www.php.net/curl_setopt
   */		
 
   $response = curl_exec($ch);
   if (curl_errno($ch)) { 
	   // TODO - grown-up error handling!
	   print "Error: " . curl_error($ch); 
   }
   //echo 'curl_exec OK';
 
   curl_close($ch);
 
   //var_dump($response);
   return $response;
}
$query_name = 'map-app';
$requestURL = getSparqlUrl($query_name);
print $requestURL;
echo request($requestURL);
//$responseArray = json_decode(
	//request($requestURL),
	//true); 
?>

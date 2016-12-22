<?php 
// Author: John Wright
// Website: http://johnwright.me/blog
// This code is live @ 
// http://johnwright.me/code-examples/sparql-query-in-code-rest-php-and-json-tutorial.php
function getSparqlUrl()
{
	// TODO - pass in SPARQL parameters as script arguments?
   $query = file_get_contents('map-app-query.rq');
   $default_graph_uri = trim(file_get_contents('global.graph'));
 
   // TODO - Consider using HTTP POST?
   // TODO - read SPAQRL endpoint from somewhere - don't hardcode it here
   $searchUrl = 'http://163.172.187.51:8890/sparql?'
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
function printArray($array, $spaces = "")
{
   $retValue = "";
	
   if(is_array($array))
   {	
      $spaces = $spaces
         ."&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
      $retValue = $retValue."<br/>";
      foreach(array_keys($array) as $key)
      {
         $retValue = $retValue.$spaces
            ."<strong>".$key."</strong>"
            .printArray($array[$key], 
               $spaces);
      }		
      $spaces = substr($spaces, 0, -30);
   }
   else $retValue = 
      $retValue." - ".$array."<br/>";
	
   return $retValue;
}
$requestURL = getSparqlUrl();
//print $requestURL;
echo request($requestURL);
//$responseArray = json_decode(
	//request($requestURL),
	//true); 
?>

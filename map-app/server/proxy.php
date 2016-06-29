<?PHP

// Script: Simple PHP Proxy: Get external HTML, JSON and more!
//
// *Version: 1.6, Last updated: 1/24/2009*
// 
// Project Home - http://benalman.com/projects/php-simple-proxy/
// GitHub       - http://github.com/cowboy/php-simple-proxy/
// Source       - http://github.com/cowboy/php-simple-proxy/raw/master/ba-simple-proxy.php
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// This working example, complete with fully commented code, illustrates one way
// in which this PHP script can be used.
// 
// Simple - http://benalman.com/code/projects/php-simple-proxy/examples/simple/
// 
// About: Release History
// 
// 1.6 - (1/24/2009) Now defaults to JSON mode, which can now be changed to
//       native mode by specifying ?mode=native. Native and JSONP modes are
//       disabled by default because of possible XSS vulnerability issues, but
//       are configurable in the PHP script along with a url validation regex.
// 1.5 - (12/27/2009) Initial release
// 
// Topic: GET Parameters
// 
// Certain GET (query string) parameters may be passed into ba-simple-proxy.php
// to control its behavior, this is a list of these parameters. 
// 
//   url - The remote URL resource to fetch. Any GET parameters to be passed
//     through to the remote URL resource must be urlencoded in this parameter.
//   mode - If mode=native, the response will be sent using the same content
//     type and headers that the remote URL resource returned. If omitted, the
//     response will be JSON (or JSONP). <Native requests> and <JSONP requests>
//     are disabled by default, see <Configuration Options> for more information.
//   callback - If specified, the response JSON will be wrapped in this named
//     function call. This parameter and <JSONP requests> are disabled by
//     default, see <Configuration Options> for more information.
//   user_agent - This value will be sent to the remote URL request as the
//     `User-Agent:` HTTP request header. If omitted, the browser user agent
//     will be passed through.
//   send_cookies - If send_cookies=1, all cookies will be forwarded through to
//     the remote URL request.
//   send_session - If send_session=1 and send_cookies=1, the SID cookie will be
//     forwarded through to the remote URL request.
//   full_headers - If a JSON request and full_headers=1, the JSON response will
//     contain detailed header information.
//   full_status - If a JSON request and full_status=1, the JSON response will
//     contain detailed cURL status information, otherwise it will just contain
//     the `http_code` property.
// 
// Topic: POST Parameters
// 
// All POST parameters are automatically passed through to the remote URL
// request.
// 
// Topic: JSON requests
// 
// This request will return the contents of the specified url in JSON format.
// 
// Request:
// 
// > ba-simple-proxy.php?url=http://example.com/
// 
// Response:
// 
// > { "contents": "<html>...</html>", "headers": {...}, "status": {...} }
// 
// JSON object properties:
// 
//   contents - (String) The contents of the remote URL resource.
//   headers - (Object) A hash of HTTP headers returned by the remote URL
//     resource.
//   status - (Object) A hash of status codes returned by cURL.
// 
// Topic: JSONP requests
// 
// This request will return the contents of the specified url in JSONP format
// (but only if $enable_jsonp is enabled in the PHP script).
// 
// Request:
// 
// > ba-simple-proxy.php?url=http://example.com/&callback=foo
// 
// Response:
// 
// > foo({ "contents": "<html>...</html>", "headers": {...}, "status": {...} })
// 
// JSON object properties:
// 
//   contents - (String) The contents of the remote URL resource.
//   headers - (Object) A hash of HTTP headers returned by the remote URL
//     resource.
//   status - (Object) A hash of status codes returned by cURL.
// 
// Topic: Native requests
// 
// This request will return the contents of the specified url in the format it
// was received in, including the same content-type and other headers (but only
// if $enable_native is enabled in the PHP script).
// 
// Request:
// 
// > ba-simple-proxy.php?url=http://example.com/&mode=native
// 
// Response:
// 
// > <html>...</html>
// 
// Topic: Notes
// 
// * Assumes magic_quotes_gpc = Off in php.ini
// 
// Topic: Configuration Options
// 
// These variables can be manually edited in the PHP file if necessary.
// 
//   $enable_jsonp - Only enable <JSONP requests> if you really need to. If you
//     install this script on the same server as the page you're calling it
//     from, plain JSON will work. Defaults to false.
//   $enable_native - You can enable <Native requests>, but you should only do
//     this if you also whitelist specific URLs using $valid_url_regex, to avoid
//     possible XSS vulnerabilities. Defaults to false.
//   $valid_url_regex - This regex is matched against the url parameter to
//     ensure that it is valid. This setting only needs to be used if either
//     $enable_jsonp or $enable_native are enabled. Defaults to '/.*/' which
//     validates all URLs.
// 
// ############################################################################

// Change these configuration options if needed, see above descriptions for info.
$enable_jsonp    = false;
$enable_native   = true;
$valid_url_regex = '/.*/';

// ############################################################################

ini_set("log_errors", 1);
ini_set("error_log", "/tmp/php-error.log");
error_log( "server/proxy.php" );

$url = $_GET['url'];


function HandleHeaderLine( $curl, $header_line ) {
	// See http://tools.ietf.org/html/draft-ietf-httpbis-p1-messaging-14#section-7.1.3
	// See http://php.net/manual/en/function.header.php for why "Location is here"
	$headers_to_squash = array("location", "connection", "keep-alive", "proxy-authenticate", "proxy-authorization", "te", "trailer", "transfer-encoding", "upgrade");	// MUSE BE LOWER CASE!!
	
	$trimmed = trim( $header_line );
	if (strlen($trimmed) > 0) {	// Ignore the separator between 2 sets of headers (e.g. with 303)
		$h = explode(":", $trimmed, 2);
		if ( in_array(strtolower($h[0]), $headers_to_squash) ) {
			error_log( "Squashing  Header Line: " . $trimmed . "(" . $h[0]);
		}
		else {
			// The idea is that when we get two sets of headers (e.g. for a 303 redirect)
			// then the most recent headers (from the final response) replace the earlier headers (from the 303 Response)
			header( $trimmed );
			error_log( "Preserving Header Line: " . $trimmed . "(" . $h[0]);
		}
	}

    return strlen($header_line);
}
	

if ( !$url ) {
  
  // Passed url not specified.
  $contents = 'ERROR: url not specified';
  $status = array( 'http_code' => 'ERROR' );
  
} else if ( !preg_match( $valid_url_regex, $url ) ) {
  
  // Passed url doesn't match $valid_url_regex.
  $contents = 'ERROR: invalid url';
  $status = array( 'http_code' => 'ERROR' );
  
} else {
  $ch = curl_init( $url );
  
  if ( strtolower($_SERVER['REQUEST_METHOD']) == 'post' ) {
    curl_setopt( $ch, CURLOPT_POST, true );
    curl_setopt( $ch, CURLOPT_POSTFIELDS, $_POST );
  }
  
  // TODO - on localhost/~matt these GET lookups are causing errors to appear in the output.
  //        Perhaps that's becasue of some debuggin PHP settings??
  //        Try uncommenting this when deployed to data.solidarityeconomics.org.
  //        Alternatively, we don't really want to support send_cookies and send_session anyway, do we?
  //if ( $_GET['send_cookies'] ) {
    //$cookie = array();
    //foreach ( $_COOKIE as $key => $value ) {
      //$cookie[] = $key . '=' . $value;
    //}
    //if ( $_GET['send_session'] ) {
      //$cookie[] = SID;
    //}
    //$cookie = implode( '; ', $cookie );
    //
    //curl_setopt( $ch, CURLOPT_COOKIE, $cookie );
  //}

  // IMPORTANT TODO!!
  // This "proxy" is not passing on important header information, e.g. Accept-bla: application/rdf+xml
  //
  $request_headers = array();
  $request_headers_to_preserve = array("accept");	// All in lower case!!
  foreach ( getallheaders() as $name => $value ) {
	  if (in_array(strtolower($name), $request_headers_to_preserve) ) {
		  array_push($request_headers, $name . ": " . $value );
		  error_log( "Preserving Request header: " . $name . ": " . $value );
	  }
	  else {
		  error_log( "Ignoring   Request header: " . $name . ": " . $value );
	  }
  }

  
  curl_setopt( $ch, CURLOPT_HTTPHEADER, $request_headers);
  curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, true );
  //curl_setopt( $ch, CURLOPT_HEADER, true );
  curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
  curl_setopt($ch, CURLOPT_HEADERFUNCTION, "HandleHeaderLine");
  // TODO - on localhost/~matt these GET lookups are causing errors to appear in the output.
  //        Perhaps that's becasue of some debuggin PHP settings??
  //        Try uncommenting this when deployed to data.solidarityeconomics.org.
  //        Alternatively, we don't really want to support setting the user_agent anyway, do we?
  //curl_setopt( $ch, CURLOPT_USERAGENT, $_GET['user_agent'] ? $_GET['user_agent'] : $_SERVER['HTTP_USER_AGENT'] );
  curl_setopt( $ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT'] );
  
  $contents = curl_exec( $ch );
  error_log( "Response: " . $contents );
  error_log( "CURLINFO_HTTP_CODE: " . curl_getinfo($ch, CURLINFO_HTTP_CODE));
  error_log( "CURLINFO_CONTENT_TYPE: " . curl_getinfo($ch, CURLINFO_CONTENT_TYPE));
  $first_line = strtok($contents, "\n");
  error_log( "Line One: " . $first_line);
  // We're using CURLOPT_HEADERFUNCTION, so we can dispense with this:
  //list( $header, $contents ) = preg_split( '/([\r\n][\r\n])\\1/', $contents, 2 );
  
  //list( $header, $contents ) = preg_split( '/([\r\n][\r\n])\\1/', curl_exec( $ch ), 2 );
  
  $status = curl_getinfo( $ch );
  
  curl_close( $ch );

  //error_log( "Status: " . $status );
  //error_log( "Header: " . $header );
  //error_log( "Content: " . $contents );
}

// Split header text into an array.
//$header_text = preg_split( '/[\r\n]+/', $header );

if ( $_GET['mode'] == 'native' ) {
  //if ( !$enable_native ) {
    //$contents = 'ERROR: invalid mode';
    //$status = array( 'http_code' => 'ERROR' );
  //}
  
  // Propagate headers to response.
  //foreach ( $header_text as $header ) {
    //if ( preg_match( '/^(?:Content-Type|Content-Language|Set-Cookie):/i', $header ) ) {
		//error_log("Propagate header: " . $header);
      //header( $header );
    //}
  //}
  
  print $contents;
  
} else {
  
  // $data will be serialized into JSON data.
  $data = array();
  
  // Propagate all HTTP headers into the JSON data object.
  if ( $_GET['full_headers'] ) {
    $data['headers'] = array();
    
    foreach ( $header_text as $header ) {
      preg_match( '/^(.+?):\s+(.*)$/', $header, $matches );
      if ( $matches ) {
        $data['headers'][ $matches[1] ] = $matches[2];
      }
    }
  }
  
  // Propagate all cURL request / response info to the JSON data object.
  if ( $_GET['full_status'] ) {
    $data['status'] = $status;
  } else {
    $data['status'] = array();
    $data['status']['http_code'] = $status['http_code'];
  }
  
  // Set the JSON data object contents, decoding it from JSON if possible.
  $decoded_json = json_decode( $contents );
  $data['contents'] = $decoded_json ? $decoded_json : $contents;
  
  // Generate appropriate content-type header.
  $is_xhr = strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
  header( 'Content-type: application/' . ( $is_xhr ? 'json' : 'x-javascript' ) );
  
  // Get JSONP callback.
  $jsonp_callback = $enable_jsonp && isset($_GET['callback']) ? $_GET['callback'] : null;
  
  // Generate JSON/JSONP string
  $json = json_encode( $data );
  
  print $jsonp_callback ? "$jsonp_callback($json)" : $json;
  
}

?>

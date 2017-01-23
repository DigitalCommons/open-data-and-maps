<?php

# takes arguments $json as object, and array of $headings.

#write the table headers
echo '<table><tr>';
foreach($headings as $heading) {
		echo '<td>'.$heading.'</td>' ;
	};
echo '</tr>' ;

$res = json_decode($json, true);

foreach($res["results"]["bindings"] as $item) {
	
	echo '<tr>' ;
	foreach($parameters as $key) {
		echo '<td>'.$item[$key]["value"].'</td>' ;
	}
	echo '</tr>' ;
}

echo '</table>' ;

?>
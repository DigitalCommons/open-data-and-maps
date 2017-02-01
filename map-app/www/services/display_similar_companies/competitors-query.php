<?php

$query = '

PREFIX spatial: <http://data.ordnancesurvey.co.uk/ontology/spatialrelations/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX terms: <http://business.data.gov.uk/companies/def/terms/>
PREFIX postcode: <http://data.ordnancesurvey.co.uk/ontology/postcode/>
PREFIX rov: <http://www.w3.org/ns/regorg#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>


SELECT ?name ?postcode ?siclabel WHERE {

#Finds Companys Postcode and SIC code
?add postcode:postcode ?pc .														
<'.$input.'> terms:registeredAddress ?add ;    
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
?>
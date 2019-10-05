This page is out of date. Bringing it up to date is the subject of [this issue](https://github.com/SolidarityEconomyAssociation/open-data-and-maps/issues/32)

# map-app
The web application in this directory is a geographical map and directory visualisation of Linked Databases of solidarity economy initiatives, e.g. [Solidarity Oxford](https://oxford.solidarityeconomy.coop/map.html). 

## Using the map-app
The map can be explored using conventional mouse and touch methods to zoom and pan the map. Each icon on the map is an initiative. Touching/clicking on an initiative opens up a dialog displaying the available information found in the database about the initiative.
The '>' tab opens a side panel displaying the directory. The directory presents the data as a menu, based on a preconfigured primary characteristic. At time of writing, Activities and Countries are supported. The option All is also provided. Selecting from this menu opens up another menu off all the initiatives with this characteristic. Selecting an initiative from the list pans the map to centre the initiative on the map and opens a dialog displaying the available information found in the database about the initiative. 

## Responsive
The application is responsive and will behave differently and appropriately depending on the size of the screen available to the application.

## About
The side panel has a clickable information icon which open an About dialog. The dialog displays link links to a simple html view of the linked data used to populate this instance of the map-app. For example the Oxford SE map uses data that can be seen [here](https://w3id.org/sea-lod/oxford/)
However the map-app actually gets its information directly from a Linked database using a SPARQL query. 

When the map-app runs:

1. The map-app requests data from the web server. 
1. On receiving this request, the web server issues a SPARQL query to the Virtuoso database (currently hosted by SEA).
3. The web server returns the results of the SPARQL query to the map-app (as JSON). 

## What's in the data?
The data is still limited - 
It is intended to achieve the following goals:

* Basic use of the original [ESS Global DCAP-SSE](http://purl.org/essglobal/wiki).
* The data contains links to external datasets. e.g. [Ordnance Survey postcode](http://data.ordnancesurvey.co.uk/id/postcodeunit/OX2 6TP).
* Data is retrieved from external datasets via the SPARQL query (we get lat/long from Ordnance Survey via the co-op's postcode URI).
The latest version of ESS Global DCAP-SSE is now hosted [here](https://github.com/essglobal-linked-open-data/map-sse)
The map-app can currently diplay the following fields for each initiative.
Unique Resource Identifier, Name, Description, Organisational Structure, Primary Activity, Street Address, Locality, Region, 	
Postcode, Country Name, Website, Phone, Email, Companies House Number, Geo Container URI, Latitude & Longitude.

## The Linked Open Data
The URI for the index into a dataset looks like https://w3id.org/sea-lod/oxford/.  
URIs for individual co-ops look like this: https://w3id.org/sea-lod/oxford/65
at one of those URIs, you'll get back HTML;
if you ask for RDF/XML, then that is what you'll get - try this:

```
curl  -H "Accept: application/rdf+xml" -L https://w3id.org/sea-lod/oxford/65
```


This page is out of date. Bringing it up to date is the subject of [this issue](https://github.com/SolidarityEconomyAssociation/open-data-and-maps/issues/32)

# map-app

This [web application](http://data.solidarityeconomics.org/map-app/) displays Solidarity Economy initiatives on a map. It is provided as an experimental demonstration platform to exercise linked open data being developed as part of the [P6Data](https://github.com/p6data-coop) project.
This version displays information taken from the [Co-ops UK open dataset 2016](http://www.uk.coop/resources/co-operative-economy-open-dataset-2016). 
The data has been converted into Linked Open Data; see [software for LOD conversion on GitHub](https://github.com/p6data-coop/ise-linked-open-data/tree/master/data/co-ops-uk/2016-06).

## Using the map-app

[Run it](http://data.solidarityeconomics.org/map-app/), and it will start up, then load the data. This may take a short time, depending on the usual set of things that influence web speed.
Once the data has loaded, you'll see a UK map, with a bunch of numbers in circles.
Each circle is a cluster of co-ops, the number tells you how many co-ops are in the cluster.
Click on numbered circles until you get down to icons without numbers. 
These are the individual co-ops.
Click on a co-op to see some information in a pop-up. 
The pop-up includes a link that will open up the full data (HTML version) for that co-op.

## Where does the app get its data?

The [data](http://data.solidarityeconomics.org/id/experimental/co-ops-uk) has been loaded into an [Ontowiki](http://aksw.org/Projects/OntoWiki.html) instance. 
Ontowiki provides a [triple store](https://en.wikipedia.org/wiki/Triplestore), and supports [SPARQL](https://en.wikipedia.org/wiki/SPARQL) queries. 
When the map-app runs:

1. The map-app requests data from the web server. 
1. On receiving this request, the web server issues a SPARQL query to the OntoWiki instance.
3. The web server returns the results of the SPARQL query to the map-app (as JSON). 

## What's in the data?

The data is limited - it does not (yet) contain much that expresses what an SSE Initiative actually does.
Instead, it is intended to achieve the following goals:

* Basic use of the [ESS Global DCAP-SSE](http://purl.org/essglobal/wiki).
* The data contains links to external datasets. e.g. [Ordnance Survey postcode](http://data.ordnancesurvey.co.uk/id/postcodeunit/OX11BP).
* Data is retrieved from external datasets via the SPARQL query (we get lat/long from Ordnance Survey via the co-op's postcode URI).
* The dataset is big enough to explore basic performance issues, with over 10,000 co-ops.

## The Linked Open Data
The URI for the index into the dataset is http://data.solidarityeconomics.org/id/experimental/co-ops-uk.
URIs for individual co-ops look like this: http://data.solidarityeconomics.org/id/experimental/co-ops-uk/R008807.
If you point a browser [there](http://data.solidarityeconomics.org/id/experimental/co-ops-uk/R008807), you'll get back HTML;
if you ask for RDF/XML, then that is what you'll get - try this:

```
curl  -H "Accept: application/rdf+xml" -L http://data.solidarityeconomics.org/id/experimental/co-ops-uk/R008807
```

## Limitations

Although the Co-ops UK dataset includes co-ops in Northern Ireland, the map-app does not show them, because Ordnance Survey doesn't publish data for Northern Ireland free of charge.

Other co-ops have also been omitted. 
The most common cause for this is URI clashes - we're constructing URIs by concatenating `Co-ops UK Organization ID` and `Postcode`.
These two fields are not sufficient to guarantee uniqueness.

The URIs for the Linked Open Data should not be regarded as persistent. They will definitely change (see previous point).

There is currently no taxonomical information in the data. That will come later, hopefully by collaborating with others, to continue to evolve standards.

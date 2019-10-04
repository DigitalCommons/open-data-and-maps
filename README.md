# open-data-and-maps
[Colm Massey](https://github.com/COlmMassey) is reponsible for this repository.

Linked Open Data and geographic maps for the Solidarity Economy produced by the [Solidarity Economy Association](https://www.solidarityeconomy.coop/).

This work started with the [ISE strategy for data, 2016](http://solidarityeconomics.org/2016/02/16/ise-strategy-for-data/).
Implementing this strategy is work in progress, documented here in this repository's [Wiki](../../wiki) and the [issue tracker](../../issues).

## Data

The currently deployed source is in the [data directory](https://github.com/SolidarityEconomyAssociation/open-data-and-maps/tree/development/data).
It contains raw data for some datasets, together with the tools for tunning it into Linked Data, and deploying it to a website from which its URIs can be dereferenced, and deploying it to a Virtuoso database, with a SPARQL endpoint.

## Maps
The source for the map application is in the [map-app directory](https://github.com/SolidarityEconomyAssociation/open-data-and-maps/tree/development/map-app).

## DCAP-SSE and ESS Global

We are using [DCAP-SSE](http://purl.org/essglobal/wiki) and the ESSGlobal RDF Vocabulary, created by the ESS Global Taskforce and RIPESS Europe. 
There's a detailed document about it [here](http://ripess.eu/wp-content/uploads/2014/07/ESSglobal_interop_guidelines.pdf).

The source for the [ESSGlobal RDF vocabulary is now on GitHub](https://github.com/essglobal-linked-open-data/map-sse). That is the best place to raise issues. Older issues may be found on the original [ESS Global wiki](http://www.maltas.org/wiki-essglobal/doku.php?id=process#issues).


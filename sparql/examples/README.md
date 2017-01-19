# SPARQL examples

These examples have been generated in the course of research. They may not relate directly to the linked open data for the solidarity economy.
## Running SPARQL queries from the command line
Suppose we have a directory called `map-app` containing files relating to the query:
```
$ ls map-app
default-graph-uri.txt    endpoint.txt        query.rq
```
We can use `curl` to run the query:
```
$ curl -i -H "Accept: application/json" --data-urlencode default-graph-uri=$(< map-app/default-graph-uri.txt) --data-urlencode query@map-app/query.rq $(< map-app/endpoint.txt) > result.json
$ curl -i -H "Accept: text/html" --data-urlencode default-graph-uri=$(< map-app/default-graph-uri.txt) --data-urlencode query@map-app/query.rq $(< map-app/endpoint.txt) > result.html
```
In this example, `default-graph-uri` is used when querying our Virtuoso triple store via OntoWiki. Many SPARQL endpoint won't need this parameter. Other parameters can be added in a similar way.

## Description of examples

### companies-in-sector

Using Companies House endpoint, and servicing Ordnance Survey's endpoint, this query will find every company in the same postcode sector as the given company, it will list their names along with their postcodes, it includes an OPTIONAL command which returns empty postcodes as well.

### list-postcodes-in-pcArea

Using Ordnance Survey's endpoint, this will find all the postcodes in a given postcode area.

### SIC-and-postcode-sector

This query is directed at the Companies House endpoint. It takes a specific company, and finds its postcode and SIC code. It then uses the SERVICE command to go to the Ordnance Survey endpoint, which finds all postcode units that belong to the same postcode sector. Then all the companies with those postcodes and the same SIC code are found.

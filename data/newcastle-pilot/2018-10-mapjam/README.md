# NewBridge MapJam data

## Creating and deploying the Linked Data

Here are a simple list of steps to create the `experimental` edition of the data. 
Fuller documentation is available describing [Converting Coops UK 2017 open data into Linked Open Data](https://github.com/SolidarityEconomyAssociation/open-data-and-maps/tree/master/data/co-ops-uk/2017-06).

### Convert the CSV to standard form

Download the latest version of the [google spreadseet](https://docs.google.com/spreadsheets/d/1JbeJrBpWDaifBzMpe9g1p6bLCDLKEOf_ayaDuuC7lO0), and move it into the `original-data` dir.
For example:
```
~/SEA/open-data-and-maps/data/newcastle-pilot/2018-10-mapjam$ mv ~/Downloads/Deep\ Adaptation\ Map\ Data\ -\ map\ data.csv original-data/2018-11-06-original.csv 
```

Check that the above filename matches the one in `csv.mk`:
```
~/SEA/open-data-and-maps/data/newcastle-pilot/2018-10-mapjam$ grep '^ORIGINAL_CSV :=' *.mk
csv.mk:ORIGINAL_CSV := $(SRC_CSV_DIR)2018-11-06-original.csv
```

Create the CSV in 'standard' format:
```
$ make -f csv.mk edition=experimental
```

It's important to note warnings issued during this process - they usually indicate problems with the input CSV.

We now have generated a CSV file in standard format. See the headings row:
```
~/SEA/open-data-and-maps/data/newcastle-pilot/2018-10-mapjam$ head -1 generated-data/experimental/csv/initiatives.csv
Identifier,Name,Description,Legal Forms,Street Address,Locality,Region,Postcode,Country Name,Website,Companies House Number,Latitude,Longitude,Geo Container,Geo Container Latitude,Geo Container Longitide
```

### Generate Linked Data from the CSV

With caution, remove any previous versions of Linked Data:
```
~/SEA/open-data-and-maps/data/newcastle-pilot/2018-10-mapjam$ rm -r generated-data/experimental/www/doc/*
```

Generate Linked Data from the standard CSV:
```
~/SEA/open-data-and-maps/data/newcastle-pilot/2018-10-mapjam$ make -f ../../tools/se_open_data/makefiles/generate.mk edition=experimental
```

### Deploy the Linked Data to the web server

Perform a dry-run of pushing the generated linked data to the web server:
```
~/SEA/open-data-and-maps/data/newcastle-pilot/2018-10-mapjam$ make -f ../../tools/se_open_data/makefiles/deploy.mk edition=experimental --dry-run
```

Look carefully at the output!! , Make sure you understand the implications of what you are seeing, especially if you see the `--delete`` flag to `rsync`.
The presence of the `--delete` flag is controlled here:
```
~/SEA/open-data-and-maps/data/newcastle-pilot/2018-10-mapjam$ grep RSYNC_FLAGS editions/experimental.mk 
DEPLOYMENT_RSYNC_FLAGS := --delete
```

If you're happy, go ahead and deploy the Linked Data to the web server:
```
~/SEA/open-data-and-maps/data/newcastle-pilot/2018-10-mapjam$ make -f ../../tools/se_open_data/makefiles/deploy.mk edition=experimental
```

### Content negotiation

We assume here that content negotiation has already been set up. 
If not, follow the [pattern described for Co-ops UK 2017](https://github.com/SolidarityEconomyAssociation/open-data-and-maps/tree/master/data/co-ops-uk/2017-06#set-up-content-negotiation).

Test the deployment to the web server:
```
~/SEA/open-data-and-maps/data/newcastle-pilot/2018-10-mapjam$ make -f ../../tools/se_open_data/makefiles/deploy.mk edition=experimental test

Accept:	text/html
TEST:	https://w3id.solidarityeconomy.coop/sea-lod/newcastle-mapjam/
CODE:	303
RES:	https://data1.solidarityeconomy.coop/sea-lod/newcastle-mapjam/index.html

Accept:	text/html
TEST:	https://w3id.solidarityeconomy.coop/sea-lod/newcastle-mapjam/ChilliStudios
CODE:	303
RES:	https://data1.solidarityeconomy.coop/sea-lod/newcastle-mapjam/ChilliStudios.html
.
.
.
```
The `303` codes are good - that means that the content negotiation is working.

### Deploy Linked Data to the Virtuoso triplestore
 
With extreme caution!! You may want to delete the existing named graph from Virtuoso.
Do so with `conductor`:

[!Delete named graph using conductor](images/conductor-delete-graph.png)

(Re-)populate the triplestore:
```
~/SEA/open-data-and-maps/data/newcastle-pilot/2018-10-mapjam$ make -f ../../tools/se_open_data/makefiles/triplestore.mk edition=experimental
Creating files for upload to Virtuoso...
Creating generated-data/experimental/virtuoso/essglobal_vocab.rdf from http://purl.org/solidarityeconomics/experimental/essglobal/vocab/...
Creating generated-data/experimental/virtuoso/legal-form.skos from http://purl.org/solidarityeconomics/experimental/essglobal/standard/legal-form...
Creating generated-data/experimental/virtuoso/global.graph...
Creating generated-data/experimental/virtuoso/loaddata.sql...
Transfering directory 'generated-data/experimental/virtuoso/' to virtuoso server 'ise-0-admin:/home/admin/Virtuoso/BulkLoading/Data/20181106153956/'
building file list ... done
./
all.rdf
essglobal_vocab.rdf
global.graph
legal-form.skos
loaddata.sql

sent 33047 bytes  received 136 bytes  22122.00 bytes/sec
total size is 178499  speedup is 5.38
****
**** IMPORTANT! ****
**** The final step is to load the data into Virtuoso with graph named https://w3id.solidarityeconomy.coop/sea-lod/newcastle-mapjam/:
**** Execute the following command, providing the password for the Virtuoso dba user:
****	ssh ise-0-admin 'isql-vt localhost dba <password> /home/admin/Virtuoso/BulkLoading/Data/20181106153956/loaddata.sql'
```

Don't forget that `IMPORTANT!` last step!

Test the data in the triplestore:
```
~/SEA/open-data-and-maps/data/newcastle-pilot/2018-10-mapjam$ make -f ../../tools/se_open_data/makefiles/triplestore.mk edition=experimental test
```

You should see chosen fields from the entire dataset being dumped out.

### Ensure the map-app uses the correct SPARQL query

A SPARQL query will have been generated for this dataset:

```
~/SEA/open-data-and-maps/data/newcastle-pilot/2018-10-mapjam$ cat generated-data/experimental/sparql/query.rq 
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dc: <http://purl.org/dc/terms/>
PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX essglobal: <http://purl.org/solidarityeconomics/experimental/essglobal/vocab/>
PREFIX gr: <http://purl.org/goodrelations/v1#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX ospostcode: <http://data.ordnancesurvey.co.uk/id/postcodeunit/>
PREFIX rov: <http://www.w3.org/ns/regorg#>
PREFIX osspatialrelations: <http://data.ordnancesurvey.co.uk/ontology/spatialrelations/>
PREFIX : <https://w3id.solidarityeconomy.coop/sea-lod/newcastle-mapjam/>

SELECT ?name ?uri ?within ?lat ?lng ?www ?regorg ?sameas ?desc
WHERE {
	?uri rdf:type essglobal:SSEInitiative .
	?uri gr:name ?name .
	OPTIONAL { ?uri foaf:homepage ?www . }
	OPTIONAL { ?uri owl:sameAs ?sameas . }
	OPTIONAL { ?uri dc:description ?desc . }
	?uri essglobal:hasAddress ?addr .
	OPTIONAL { ?uri rov:hasRegisteredOrganization ?regorg . }
	?addr osspatialrelations:within ?within .
	?within geo:lat ?lat.
	?within geo:long ?lng.
}
LIMIT 179
```

Note in particular that the `LIMIT` corresponds to the number of initiatives in the dataset.
You must ensure that the sparql query used by the map-app matches this.
For example:
```
~/SEA/open-data-and-maps/data/newcastle-pilot/2018-10-mapjam$ find ../../../map-app/www -name query.rq
../../../map-app/www/map-app/services/newcastle-pilot/query.rq
../../../map-app/www/map-app/services/newcastle-mapjam/query.rq
../../../map-app/www/map-app/services/coops-uk2016/query.rq
../../../map-app/www/map-app/services/coops-uk2017/query.rq
../../../map-app/www/map-app/services/dotcoop/query.rq

~/SEA/open-data-and-maps/data/newcastle-pilot/2018-10-mapjam$ diff generated-data/experimental/sparql/query.rq ../../../map-app/www/map-app/services/newcastle-mapjam/query.rq
~/SEA/open-data-and-maps/data/newcastle-pilot/2018-10-mapjam$
```



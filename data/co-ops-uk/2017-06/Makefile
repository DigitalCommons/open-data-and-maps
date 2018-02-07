# Hint: type 'make' to get the usage message.

GENERATE_target := generate
CSV_target := csv
DEPLOY_target := deploy
TRIPLESTORE_target := triplestore
HELP_target := help
SPARQLTEST_target := sparqltest
.PHONY: $(HELP_target) $(GENERATE_target) $(DEPLOY_target) $(TRIPLESTORE_target) $(SPARQLTEST_target) $(CSV_target)
.DEFAULT_GOAL: $(HELP_target)

date ?= $(shell date -u +%Y%m%d)
version ?= $(shell date -u +%Y%m%d%H%M%S)

$(HELP_target):
	@echo USAGE
	@echo -----
	@echo "make $(HELP_target)"
	@echo "\tPrints help."
	@echo "make $(HELP_target) edition=x"
	@echo "\tPrints help about a edition."
	@echo "\tValid editions are: {$(EDITIONS)}"
	@echo "make $(GENERATE_target) edition=x"
	@echo "\tGenerates RDF/XML and turtle data from the Co-ops UK files:"
	@echo "\t    $(COOPS_UK_ORGS_CSV)"
	@echo "\t    $(COOPS_UK_OUTLETS_CSV)"
	@$(call echo_if_edition_ok,"\\tResults are stored in the local directory $(GEN_DATA_DIR).")
	@echo "make $(DEPLOY_target) edition=x"
	@echo "\tDeploys the generated data to the data server $(SERVER)"
	@$(call echo_if_edition_ok,"\\tLocal directory $(GEN_DATA_DIR) is copied to $(SERVER_PATH).")
	@$(call echo_if_edition_ok,"\\tAfter deployment \(assuming content negotiation is configured properly\) data can be accessed at this URI:")
	@$(call echo_if_edition_ok,"\\t\\t$(URI_BASE)$(DATASET)")
	@echo "\tWARNING: This replaces the directory on the server (i.e. files on the server may be deleted)."
	@echo "make $(TRIPLESTORE_target) edition=x"
	@echo "\tInstall deployed data into the triple store."
	@echo "make $(SPARQLTEST_target) edition=x"
	@echo "\tRuns some sparql queries, and by doing so documents some things."

# Variables to be overridden from the command line:
#
# The value of SERVER would often be the name of a host set up in an ssh config file. 
# See http://nerderati.com/2011/03/17/simplify-your-life-with-an-ssh-config-file/
SERVER ?= parecco

# SERVER_DIR must already exist when the DEPLOY_target is invoked
SERVER_DIR ?= public_html/subdomains/solidarityeconomics.org/data/
DATA_SERVER_URL ?= http://data.solidarityeconomics.org

# "one big file" of RDF will be created, mostly to make it straightforward to load the whole thing into Virtuoso.
# See generate-triples.rb for how this is used.
ONE_BIG_FILE_SUFFIX := _all

CHECK_WEBSITES_FLAG := --no-check-websites
ALLOW_BLANK_NODES_FLAG := --allow-blank-nodes

# We maintain different editions of the data.
# The 'edition' variable should be passed in as a command line argument.
# Generated data for each edition is kept in it's own separate directory.
EDITIONS := final test2017
ifeq ($(words $(filter $(edition),$(EDITIONS))),0)
  edition_errmsg := Unrecognized edition - you must use 'make edition=x' where x is one of {$(EDITIONS)}
  BAD_EDITION := yup
endif
ifeq ($(edition),final)
  ESSGLOBAL_URI := http://purl.org/essglobal/experimental/
  IDENTIFIER_PATH ?= experimental/
  # There is no max number of CSV rows:
  MAX_CSV_ROWS :=  100
else ifeq ($(edition),test2017)
  ESSGLOBAL_URI := http://purl.org/solidarityeconomics/experimental/essglobal/
  IDENTIFIER_PATH ?= experimental/$(edition)/
  #MAX_CSV_ROWS := 100
  MAX_CSV_ROWS :=
  #CHECK_WEBSITES_FLAG := --check-websites
  ALLOW_BLANK_NODES_FLAG := --no-allow-blank-nodes
else ifndef BAD_EDITION
  edition_errmsg := Error in Makefile - missing configuration for edition $(edition)
  BAD_EDITION := yup
endif

define echo_if_edition_ok
@[ -z "$(BAD_EDITION)" ] && echo "$(1)" || true
endef
define check_valid_edition
@[ -z "$(BAD_EDITION)" ] || { echo "$(edition_errmsg)" && false; }
endef

# See https://github.com/p6data-coop/ise-linked-open-data/wiki/URIs for a discussion about "experimental"
DATASET ?= co-ops-uk2017

# Following data.gov.uk principles, URIs for real-world objects are under `id`, ...
URI_PATTERN ?= id/$(IDENTIFIER_PATH)
# ... and those for the documents about them are under `doc`:
SERVER_DOC_DIR ?= doc/$(IDENTIFIER_PATH)

URI_BASE := $(DATA_SERVER_URL)/$(URI_PATTERN)
DOC_URL_BASE := $(DATA_SERVER_URL)/$(SERVER_DOC_DIR)

# Programs used within this makefile:
SCP := scp
RUBY := ruby2.4
RSYNC := rsync -avz 
SSH := ssh

# TODO - use rsync for transferring files to server. 
# N.B. http://unix.stackexchange.com/questions/94421/how-to-use-ssh-config-setting-for-each-server-by-rsync

# Source files:
CSV_DIR := co-ops-uk-csv-data/
COOPS_UK_OUTLETS_CSV := $(CSV_DIR)open_data_outlets.csv
COOPS_UK_ORGS_CSV := $(CSV_DIR)open_data_organisations.csv

# Programs/scripts:
GEN_TRIPLES := generate-triples.rb

# Directories
GEN_DATA_DIR := generated-data/$(edition)/$(IDENTIFIER_PATH)
GEN_SPARQL_DIR := generated-data/$(edition)/sparql/
GEN_VIRTUOSO_DIR := generated-data/$(edition)/virtuoso/$(version)/
DATA_DIR := $(GEN_DATA_DIR)$(DATASET)
CSS_SRC_DIR := css/
CSS_GEN_DIR := $(GEN_DATA_DIR)$(DATASET)/css/
CSS_FILES := $(wildcard $(CSS_SRC_DIR)*.css)

GEN_CSV_DIR := generated-data/csv/
STD_CSV_DIR := $(GEN_CSV_DIR)standard/
STD_COOPS_UK_OUTLETS_CSV := $(STD_CSV_DIR)open_data_outlets.csv
STD_COOPS_UK_ORGS_CSV := $(STD_CSV_DIR)open_data_organisations.csv
STD_COOPS_UK_MERGED_CSV := $(STD_CSV_DIR)co-ops-uk-merged.csv
STD_COOPS_UK_DE_DUPED_CSV := $(STD_CSV_DIR)co-ops-uk-de-duplicated.csv
STD_COOPS_UK_DUPS_CSV := $(STD_CSV_DIR)co-ops-uk-ignored-duplicates.csv
STD_COOPS_UK_WITH_LAT_LNG := $(STD_CSV_DIR)co-ops-uk-with-lat-lng.csv
COOPS_UK_ORGS_CSV_CONVERTER := co-ops-uk-orgs-converter.rb
COOPS_UK_OUTLETS_CSV_CONVERTER := co-ops-uk-outlets-converter.rb
CSV_MERGER := ../../../lib/se-open-data/csv/merge.rb
CSV_DE_DUPER := ../../../lib/se-open-data/csv/de-duplicator.rb
CSV_POSTCODEUNIT_ADDER := ../../../lib/se-open-data/csv/add-ospostcodeunit.rb
POSTCODE_LAT_LNG_CACHE := postcode_lat_lng.json



$(STD_COOPS_UK_OUTLETS_CSV) : $(COOPS_UK_OUTLETS_CSV) $(COOPS_UK_OUTLETS_CSV_CONVERTER) | $(dir $(STD_COOPS_UK_OUTLETS_CSV))
	$(RUBY) $(COOPS_UK_OUTLETS_CSV_CONVERTER) $< > $@

$(STD_COOPS_UK_ORGS_CSV) : $(COOPS_UK_ORGS_CSV) $(COOPS_UK_ORGS_CSV_CONVERTER) | $(dir $(STD_COOPS_UK_ORGS_CSV))
	$(RUBY) $(COOPS_UK_ORGS_CSV_CONVERTER) $< > $@

$(STD_COOPS_UK_MERGED_CSV) : $(STD_COOPS_UK_OUTLETS_CSV) $(STD_COOPS_UK_ORGS_CSV) $(CSV_MERGER) 
	$(RUBY) $(CSV_MERGER) $(STD_COOPS_UK_OUTLETS_CSV) $(STD_COOPS_UK_ORGS_CSV) > $@

$(STD_COOPS_UK_DE_DUPED_CSV) : $(CSV_DE_DUPER) $(STD_COOPS_UK_MERGED_CSV) 
	$(RUBY) $^ > $@ 2> $(STD_COOPS_UK_DUPS_CSV)
	@echo "Ignored duplicates have been written to $(STD_COOPS_UK_DUPS_CSV)"
	@echo Total ignored: `wc -l $(STD_COOPS_UK_DUPS_CSV)`

$(STD_COOPS_UK_WITH_LAT_LNG) : $(STD_COOPS_UK_DE_DUPED_CSV) $(CSV_POSTCODEUNIT_ADDER)
	$(RUBY) $(CSV_POSTCODEUNIT_ADDER) --postcodeunit-cache $(POSTCODE_LAT_LNG_CACHE) $< > $@

$(STD_CSV_DIR):
	$(check_valid_edition)
	mkdir -p $@

$(DATA_DIR):
	$(check_valid_edition)
	mkdir -p $@

$(GEN_SPARQL_DIR):
	$(check_valid_edition)
	mkdir -p $@

$(GEN_VIRTUOSO_DIR):
	$(check_valid_edition)
	mkdir -p $@

# Any css file in the source CSS dir will be copied to the corresponding geenrated_data dir.
# The list of CSS_FILES will be passed to the GEN_TRIPLES ruby script for linking in HTML.
$(CSS_GEN_DIR):
	$(check_valid_edition)
	mkdir -p $@
	cp -r $(CSS_SRC_DIR) $(CSS_GEN_DIR)

# Misc:
TIMESTAMP =  $(shell date +%Y-%m-%dT%H.%M.%S)

# Standard GNU make trick - see http://stackoverflow.com/a/7531247/685715
nullstring :=
space := $(nullstring) # end of the line
comma := ,

#$(CSV_target): $(STD_COOPS_UK_ORGS_CSV) $(STD_COOPS_UK_OUTLETS_CSV) | $(STD_CSV_DIR)
#$(CSV_target): $(STD_COOPS_UK_MERGED_CSV) | $(STD_CSV_DIR)
#$(CSV_target): $(STD_COOPS_UK_DE_DUPED_CSV) | $(STD_CSV_DIR)
$(CSV_target): $(STD_COOPS_UK_WITH_LAT_LNG) | $(STD_CSV_DIR)

ONE_BIG_RDFXML_FILE := $(GEN_DATA_DIR)$(DATASET)$(ONE_BIG_FILE_SUFFIX).rdf

# The GEN_SPARQL_DIR will be copied over to the map-app services dir, for use by a PHP script
# These file names must match exactly the filenames in the PHP script
MAP_APP_SPARQL_FILE := $(GEN_SPARQL_DIR)query.rq
MAP_APP_ENDPOINT_FILE := $(GEN_SPARQL_DIR)endpoint.txt
MAP_APP_GRAPH_FILE := $(GEN_SPARQL_DIR)default-graph-uri.txt

$(GENERATE_target): $(GEN_TRIPLES) $(COOPS_UK_ORGS_CSV) $(COOPS_UK_OUTLETS_CSV) $(CSS_GEN_DIR) | $(DATA_DIR) $(GEN_SPARQL_DIR) 
	$(check_valid_edition)
	echo "$(SPARQL_ENDPOINT)" > $(MAP_APP_ENDPOINT_FILE)
	echo "$(GRAPH_NAME)" > $(MAP_APP_GRAPH_FILE)
	$(RUBY) $(GEN_TRIPLES) --organizations-csv $(COOPS_UK_ORGS_CSV) \
		--outlets-csv $(COOPS_UK_OUTLETS_CSV) \
		--output-dir $(GEN_DATA_DIR) \
		--one-big-file-suffix $(ONE_BIG_FILE_SUFFIX) \
		--map-app-sparql $(MAP_APP_SPARQL_FILE) \
		--uri-base $(URI_BASE) \
		--doc-url-base $(DOC_URL_BASE) \
		--dataset $(DATASET) \
		--css-files '$(subst $(space),$(comma),$(CSS_FILES))' \
		--essglobal-uri $(ESSGLOBAL_URI) \
		--max-csv-rows $(MAX_CSV_ROWS) \
		$(CHECK_WEBSITES_FLAG) $(ALLOW_BLANK_NODES_FLAG)
	@echo "**** Don't forget to copy $(GEN_SPARQL_DIR) to map-app/www/services"


# Destination directory on server to which data is to be deployed:
SERVER_PATH := $(SERVER_DIR)$(SERVER_DOC_DIR)

# To deploy the generated data on the server, we need to 
#  - make sure the target directory exists on the server
#  - copy the generated data to the server
$(DEPLOY_target):
	$(SSH) $(SERVER) 'cd $(SERVER_DIR) && mkdir -p $(SERVER_DOC_DIR)'
	$(RSYNC) --delete $(GEN_DATA_DIR) $(SERVER):$(SERVER_PATH)

# We create a directory with the RDF that we need to load into our triplestore.
# We do this by downloading (using curl) RDF that has already been deployed to the web.

GET_RDFXML_CURL := curl --silent -H "Accept: application/rdf+xml" -L 
GET_RDFXML = echo "Creating $(2) from $(1)..." && $(GET_RDFXML_CURL) $(1) > $(2)
GET_RDFXML_FOR_VIRTUOSO = $(call GET_RDFXML,$(1),$(GEN_VIRTUOSO_DIR)$(2))
# Datasets on the Virtuoso server are put into a named graph:
GRAPH_NAME := http://163.172.187.51/OntoWiki/index.php/coopsuk/

# virtuoso server name, typically this is configured in ~/.ssh/config:
VIRTUOSO_SERVER := ise-0-admin
# Directory on virtuoso server which has been configured (DirsAllowed in virtuoso.ini)
# ready for Bulk data loading:
VIRTUOSO_ROOT_DATA_DIR := /home/admin/Virtuoso/BulkLoading/Data/
VIRTUOSO_DATA_DIR := $(VIRTUOSO_ROOT_DATA_DIR)$(version)/
# Virtuoso Buld RDF loading uses a file to provide the name of the graph:
VIRTUOSO_NAMED_GRAPH_FILE := $(GEN_VIRTUOSO_DIR)global.graph
# Name of SQL script (created here) to achieve the bulk data loading:
VIRTUOSO_SQL_SCRIPT_BASENAME := loaddata.sql
VIRTUOSO_SCRIPT_LOCAL := $(GEN_VIRTUOSO_DIR)$(VIRTUOSO_SQL_SCRIPT_BASENAME)
VIRTUOSO_SCRIPT_REMOTE := $(VIRTUOSO_DATA_DIR)$(VIRTUOSO_SQL_SCRIPT_BASENAME)

$(TRIPLESTORE_target): | $(GEN_VIRTUOSO_DIR)
	$(check_valid_edition)
	@echo "Creating files for upload to Virtuoso..."
	@$(call GET_RDFXML_FOR_VIRTUOSO,$(URI_BASE)$(DATASET)$(ONE_BIG_FILE_SUFFIX),$(DATASET)$(ONE_BIG_FILE_SUFFIX).rdf)
	@$(call GET_RDFXML_FOR_VIRTUOSO,$(ESSGLOBAL_URI)vocab/,essglobal_vocab.rdf)
	@$(call GET_RDFXML_FOR_VIRTUOSO,$(ESSGLOBAL_URI)standard/legal-form,legal-form.skos)
	@echo "Creating $(VIRTUOSO_NAMED_GRAPH_FILE)..."
	@echo "$(GRAPH_NAME)" > $(VIRTUOSO_NAMED_GRAPH_FILE)
	@echo "Creating $(VIRTUOSO_SCRIPT_LOCAL)..."
	@echo "ld_dir('$(VIRTUOSO_DATA_DIR)','*.rdf',NULL);" > $(VIRTUOSO_SCRIPT_LOCAL)
	@echo "ld_dir('$(VIRTUOSO_DATA_DIR)','*.skos',NULL);" >> $(VIRTUOSO_SCRIPT_LOCAL)
	@echo "rdf_loader_run();" >> $(VIRTUOSO_SCRIPT_LOCAL)
	@echo "Transfering directory '$(GEN_VIRTUOSO_DIR)' to virtuoso server '$(VIRTUOSO_SERVER):$(VIRTUOSO_DATA_DIR)'"
	@$(SSH) $(VIRTUOSO_SERVER) 'mkdir -p $(VIRTUOSO_DATA_DIR)'
	@$(RSYNC) $(GEN_VIRTUOSO_DIR) $(VIRTUOSO_SERVER):$(VIRTUOSO_DATA_DIR)
	@echo "****"
	@echo "**** IMPORTANT! ****"
	@echo "**** The final step is to load the data into Virtuoso with graph named $(GRAPH_NAME):"
	@echo "**** Execute the following command, providing the password for the Virtuoso dba user:"
	@echo "****\tssh $(VIRTUOSO_SERVER) 'isql-vt localhost dba <password> $(VIRTUOSO_SCRIPT_REMOTE)'"

.PHONY: list_sparql_graphs get_info_for_map_app

#DEFAULT_GRAPH_URI := http://163.172.187.51/OntoWiki/index.php/CoopsUKwithlatlong/ 
DEFAULT_GRAPH_URI := $(GRAPH_NAME)
SPARQL_FOR_GRAPH_LIST := sparql/list-graphs.rq 
SPARQL_ENDPOINT := http://163.172.187.51:8890/sparql
SPARQL_CURL := curl -i -H "Accept: application/json" 

list_sparql_graphs:
	$(check_valid_edition)
	$(SPARQL_CURL) --data-urlencode query@$(SPARQL_FOR_GRAPH_LIST) $(SPARQL_ENDPOINT)

get_info_for_map_app:
	$(check_valid_edition)
	$(SPARQL_CURL) --data default-graph-uri=$(DEFAULT_GRAPH_URI) --data-urlencode query@$(MAP_APP_SPARQL_FILE) $(SPARQL_ENDPOINT)

$(SPARQLTEST_target): list_sparql_graphs get_info_for_map_app


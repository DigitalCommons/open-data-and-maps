# Hint: type 'make' to get the usage message.

GENERATE_target := generate
OLD_GENERATE_target := oldgenerate
CSV_target := csv
TEST_target := test
TESTGET_target := testget
DEPLOY_target := deploy
CLEAN_target := clean
TRIPLESTORE_target := triplestore
HELP_target := help
SPARQLTEST_target := sparqltest

.PHONY: $(GENERATE_target) $(OLD_GENERATE_target) $(CSV_target) $(TEST_target) $(TESTGET_target) $(DEPLOY_target) $(CLEAN_target) $(TRIPLESTORE_target) $(HELP_target) $(SPARQLTEST_target)

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
	@$(call echo_if_edition_ok,"\\tWith edition=$(edition): Results are stored in the local directory $(TOP_OUTPUT_DIR).")
	@echo "make $(DEPLOY_target) edition=x"
	@echo "\tDeploys the generated data to the data server $(DEPLOYMENT_SERVER)"
	@$(call echo_if_edition_ok,"\\tWith edition=$(edition): Data from local directory $(TOP_OUTPUT_DIR) are copied to the server.")
	@$(call echo_if_edition_ok,"\\tTo see exacly what is to be copied and how destructive that copy will be to the server:")
	@$(call echo_if_edition_ok,"\\t\\tmake --dry-run $(DEPLOY_target) edition=$(edition)")
	@echo "\tWARNING: This replaces the directory on the server (i.e. files on the server may be deleted)."
	@echo "make $(TRIPLESTORE_target) edition=x"
	@echo "\tInstall deployed data into the triple store."
	@echo "make $(CLEAN_target) edition=x"
	@echo "\tDeletes the generated data for edition x."
	@$(call echo_if_edition_ok,"\\tWith edition=$(edition): deletes $(TOP_OUTPUT_DIR)")
	@echo "make $(TESTGET_target) edition=x"
	@echo "\tTests the $(DEPLOY_target) step."
	@echo "\tCheck that redirection and content negotiation (done using w3id/.htaccess) is working."
	@$(call echo_if_edition_ok,"\\tWith edition=$(edition): Tests .htaccess at https://$(URI_HOST)/$(URI_PATH_PREFIX)")
	@echo "make $(TEST_target) edition=x stabledir=dir"
	@echo "\tTests the $(GENERATE_target) step."
	@echo "\tRun tests, and compare results with stabledir."
	@$(call echo_if_edition_ok,"\\tWith edition=$(edition): Compare stabledir with $(TOP_OUTPUT_DIR).")
	@echo "make $(SPARQLTEST_target) edition=x"
	@echo "\tTests the $(TRIPLESTORE_target) step."
	@echo "\tRuns some sparql queries: list named graphs; get map-app data."
	@$(call echo_if_edition_ok,"\\tWith edition=$(edition): You can see what commands will be run like this:")
	@$(call echo_if_edition_ok,"\\t\\tmake --dry-run $(SPARQLTEST_target) edition=$(edition)")

# Variables to be overridden from the command line:
#
# The value of DEPLOYMENT_SERVER would often be the name of a host set up in an ssh config file. 
# See http://nerderati.com/2011/03/17/simplify-your-life-with-an-ssh-config-file/
DEPLOYMENT_SERVER ?= ise-0-matt

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
  URI_HOST := w3id.org
  SRC_CSV_DIR := co-ops-uk-csv-data/
  ESSGLOBAL_URI := http://purl.org/solidarityeconomics/experimental/essglobal/
  # Does this one really exist? :
  #ESSGLOBAL_URI := http://purl.org/essglobal/experimental/
else ifeq ($(edition),test2017)
  URI_HOST := w3id.solidarityeconomy.coop
  SRC_CSV_DIR := co-ops-uk-csv-test-data/
  ESSGLOBAL_URI := http://purl.org/solidarityeconomics/experimental/essglobal/

  #CHECK_WEBSITES_FLAG := --check-websites
  ALLOW_BLANK_NODES_FLAG := --no-allow-blank-nodes
else ifndef BAD_EDITION
  edition_errmsg := Error in Makefile - missing configuration for edition $(edition)
  BAD_EDITION := yup
endif
URI_SCHEME := https
DATASET_PATH := coops-uk/2017
URI_PATH_PREFIX := $(DATASET_PATH)/
DATASET_URI_BASE := $(URI_SCHEME)://$(URI_HOST)/$(URI_PATH_PREFIX)

DEPLOYMENT_WEBROOT := /var/www/html/data1.solidarityeconomy.coop/
DEPLOYMENT_DOC_SUBDIR := $(URI_PATH_PREFIX)
DEPLOYMENT_DOC_DIR := $(DEPLOYMENT_WEBROOT)$(DEPLOYMENT_DOC_SUBDIR)
DEPLOYMENT_CSS_SUBDIR := css/$(URI_PATH_PREFIX)
DEPLOYMENT_CSS_DIR := $(DEPLOYMENT_WEBROOT)$(DEPLOYMENT_CSS_SUBDIR)

define echo_if_edition_ok
@[ -z "$(BAD_EDITION)" ] && echo "$(1)" || true
endef
define check_valid_edition
@[ -z "$(BAD_EDITION)" ] || { echo "$(edition_errmsg)" && false; }
endef

# Programs used within this makefile:
SCP := scp
#RUBY := ruby2.4
RUBY := ruby
RSYNC := rsync -avz 
SSH := ssh

# Source files:
COOPS_UK_OUTLETS_CSV := $(SRC_CSV_DIR)open_data_outlets.csv
COOPS_UK_ORGS_CSV := $(SRC_CSV_DIR)open_data_organisations.csv

# Programs/scripts:
GEN_TRIPLES := generate-triples.rb

# Everything produces for theis edition goes here:
TOP_OUTPUT_DIR := generated-data/$(edition)/
# Directories
GEN_SPARQL_DIR := $(TOP_OUTPUT_DIR)sparql/
GEN_VIRTUOSO_DIR := $(TOP_OUTPUT_DIR)virtuoso/
# "one big file" of RDF will be created, mostly to make it straightforward to load the whole thing into Virtuoso.
ONE_BIG_FILE_BASENAME := $(GEN_VIRTUOSO_DIR)all

CSS_SRC_DIR := css/
CSS_FILES := $(wildcard $(CSS_SRC_DIR)*.css)

# Where to put files to be transferred to the web server where RDF can be dereferenced, and HTML provided:
WWW_DIR := $(TOP_OUTPUT_DIR)www/
GEN_CSV_DIR := $(TOP_OUTPUT_DIR)csv/
GEN_DOC_DIR := $(WWW_DIR)doc/
GEN_CSS_DIR := $(WWW_DIR)css/
STD_CSV_DIR := $(GEN_CSV_DIR)standard/
STD_COOPS_UK_OUTLETS_CSV := $(STD_CSV_DIR)open_data_outlets.csv
STD_COOPS_UK_ORGS_CSV := $(STD_CSV_DIR)open_data_organisations.csv
STD_COOPS_UK_MERGED_CSV := $(STD_CSV_DIR)co-ops-uk-merged.csv
STD_COOPS_UK_FIXED_DUPS_CSV := $(STD_CSV_DIR)co-ops-uk-fixed-dups.csv
STD_COOPS_UK_DE_DUPED_CSV := $(STD_CSV_DIR)co-ops-uk-de-duplicated.csv
STD_COOPS_UK_DUPS_CSV := $(STD_CSV_DIR)co-ops-uk-ignored-duplicates.csv
STD_COOPS_UK_WITH_LAT_LNG := $(STD_CSV_DIR)co-ops-uk-with-lat-lng.csv
CSV_FOR_TESTING_TO_RDF := $(STD_CSV_DIR)co-ops-uk-with-lat-lng-for-testing.csv
COOPS_UK_ORGS_CSV_CONVERTER := co-ops-uk-orgs-converter.rb
COOPS_UK_OUTLETS_CSV_CONVERTER := co-ops-uk-outlets-converter.rb

SE_OPEN_DATA_BIN_DIR := ../../tools/se_open_data/bin/
SE_OPEN_DATA_LIB_DIR := $(abspath ../../tools/se_open_data/lib/)
CSV_MERGER := $(SE_OPEN_DATA_BIN_DIR)merge-csv-with-headers.rb
CSV_DUP_FIXER := $(SE_OPEN_DATA_BIN_DIR)csv/standard/fix-duplicates.rb
CSV_DE_DUPER := $(SE_OPEN_DATA_BIN_DIR)csv/standard/remove-duplicates.rb
CSV_POSTCODEUNIT_ADDER := $(SE_OPEN_DATA_BIN_DIR)csv/standard/add-postcode-lat-long.rb
CSV_TO_RDF := $(SE_OPEN_DATA_BIN_DIR)csv/standard/csv-to-rdf.rb
POSTCODE_LAT_LNG_CACHE := postcode_lat_lng.json

####################
# The pipeline for processing CSV files for Coops UK:

$(STD_COOPS_UK_OUTLETS_CSV) : $(COOPS_UK_OUTLETS_CSV) $(COOPS_UK_OUTLETS_CSV_CONVERTER) | $(dir $(STD_COOPS_UK_OUTLETS_CSV)) $(STD_CSV_DIR)
	$(RUBY) -I $(SE_OPEN_DATA_LIB_DIR) $(COOPS_UK_OUTLETS_CSV_CONVERTER) $< > $@

$(STD_COOPS_UK_ORGS_CSV) : $(COOPS_UK_ORGS_CSV) $(COOPS_UK_ORGS_CSV_CONVERTER) | $(dir $(STD_COOPS_UK_ORGS_CSV)) $(STD_CSV_DIR)
	$(RUBY) -I $(SE_OPEN_DATA_LIB_DIR) $(COOPS_UK_ORGS_CSV_CONVERTER) $< > $@

$(STD_COOPS_UK_MERGED_CSV) : $(STD_COOPS_UK_OUTLETS_CSV) $(STD_COOPS_UK_ORGS_CSV) $(CSV_MERGER)  | $(STD_CSV_DIR)
	$(RUBY) -I $(SE_OPEN_DATA_LIB_DIR) $(CSV_MERGER) $(STD_COOPS_UK_OUTLETS_CSV) $(STD_COOPS_UK_ORGS_CSV) > $@

$(STD_COOPS_UK_FIXED_DUPS_CSV) : $(CSV_DUP_FIXER) $(STD_COOPS_UK_MERGED_CSV)  | $(STD_CSV_DIR)
	$(RUBY) -I $(SE_OPEN_DATA_LIB_DIR) $^ > $@

$(STD_COOPS_UK_DE_DUPED_CSV) : $(CSV_DE_DUPER) $(STD_COOPS_UK_FIXED_DUPS_CSV)  | $(STD_CSV_DIR)
	$(RUBY) -I $(SE_OPEN_DATA_LIB_DIR) $^ > $@ 2> $(STD_COOPS_UK_DUPS_CSV)
	@echo "Ignored duplicates have been written to $(STD_COOPS_UK_DUPS_CSV)"
	@echo Total ignored: `wc -l $(STD_COOPS_UK_DUPS_CSV)`

$(STD_COOPS_UK_WITH_LAT_LNG) : $(STD_COOPS_UK_DE_DUPED_CSV) $(CSV_POSTCODEUNIT_ADDER) | $(STD_CSV_DIR)
	$(RUBY) -I $(SE_OPEN_DATA_LIB_DIR) $(CSV_POSTCODEUNIT_ADDER) --postcodeunit-cache $(POSTCODE_LAT_LNG_CACHE) $< > $@

####################
# Directories

$(STD_CSV_DIR):
	$(check_valid_edition)
	mkdir -p $@

$(GEN_DOC_DIR):
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

$(GEN_CSS_DIR):
	$(check_valid_edition)
	mkdir -p $@
	cp -r $(CSS_SRC_DIR) $(GEN_CSS_DIR)

# Standard GNU make trick - see http://stackoverflow.com/a/7531247/685715
nullstring :=
space := $(nullstring) # end of the line
comma := ,

$(CLEAN_target):
	$(check_valid_edition)
	rm -r $(TOP_OUTPUT_DIR)

#$(CSV_target): $(STD_COOPS_UK_ORGS_CSV) $(STD_COOPS_UK_OUTLETS_CSV) | $(STD_CSV_DIR)
#$(CSV_target): $(STD_COOPS_UK_MERGED_CSV) | $(STD_CSV_DIR)
#$(CSV_target): $(STD_COOPS_UK_DE_DUPED_CSV) | $(STD_CSV_DIR)
$(CSV_target): $(STD_COOPS_UK_WITH_LAT_LNG) | $(STD_CSV_DIR)

# For testing purposes, we generate a CSV with just the first 100 lines:
$(CSV_FOR_TESTING_TO_RDF): $(STD_COOPS_UK_WITH_LAT_LNG)
	head -1 $< > $@
	grep '[0-9],http' $<  | head -100 >> $@

$(GENERATE_target): $(STD_COOPS_UK_WITH_LAT_LNG) $(GEN_CSS_DIR) | $(GEN_DOC_DIR) $(GEN_VIRTUOSO_DIR) $(GEN_SPARQL_DIR)
	echo "$(SPARQL_ENDPOINT)" > $(MAP_APP_ENDPOINT_FILE)
	echo "$(GRAPH_NAME)" > $(MAP_APP_GRAPH_FILE)
	$(RUBY) -I $(SE_OPEN_DATA_LIB_DIR) $(CSV_TO_RDF) \
	  --output-directory $(GEN_DOC_DIR) \
	  --uri-prefix $(DATASET_URI_BASE) \
	  --essglobal-uri $(ESSGLOBAL_URI) \
	  --one-big-file-basename $(ONE_BIG_FILE_BASENAME) \
	  --map-app-sparql-query-filename $(MAP_APP_SPARQL_FILE) \
	  $<

$(TEST_target): $(GENERATE_target)
	diff -r $(stabledir) $(TOP_OUTPUT_DIR)

# ------------------------------------------------------------------
# Test content negotiation and redirection:
TEST_INITIATIVE_URI_PATHS := R000001 R013429/BD234AA R013429/BH205RQ/2
TEST_URI_PATHS := $(DATASET_PATH)/ $(addprefix $(URI_PATH_PREFIX),$(TEST_INITIATIVE_URI_PATHS))
TEST_URIS := $(addprefix https://$(URI_HOST)/,$(TEST_URI_PATHS))

define TESTGET_method
@for n in $(TEST_URIS); do \
	echo "\nAccept:\t$(1)";\
	echo "TEST:\t$$n";\
	curl -H 'Accept: $(1)' --silent --output /dev/null --write-out "CODE:\t%{http_code}\nRES:\t%{redirect_url}\n" $$n\
	; done
endef
$(TESTGET_target): 
	$(check_valid_edition)
	@$(call TESTGET_method,text/html)
	@$(call TESTGET_method,application/xhtml+xml)
	@$(call TESTGET_method,application/rdf+xml)
	@$(call TESTGET_method,text/turtle)

# ------------------------------------------------------------------

# The GEN_SPARQL_DIR will be copied over to the map-app services dir, for use by a PHP script
# These file names must match exactly the filenames in the PHP script
MAP_APP_SPARQL_FILE := $(GEN_SPARQL_DIR)query.rq
MAP_APP_ENDPOINT_FILE := $(GEN_SPARQL_DIR)endpoint.txt
MAP_APP_GRAPH_FILE := $(GEN_SPARQL_DIR)default-graph-uri.txt

$(OLD_GENERATE_target): $(GEN_TRIPLES) $(COOPS_UK_ORGS_CSV) $(COOPS_UK_OUTLETS_CSV) $(CSS_GEN_DIR) | $(DATA_DIR) $(GEN_SPARQL_DIR) 
	false
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
	$(SSH) $(DEPLOYMENT_SERVER) 'cd $(DEPLOYMENT_WEBROOT) && mkdir -p $(DEPLOYMENT_DOC_SUBDIR)'
	$(RSYNC) --delete $(GEN_DOC_DIR) $(DEPLOYMENT_SERVER):$(DEPLOYMENT_DOC_DIR)
	$(SSH) $(DEPLOYMENT_SERVER) 'cd $(DEPLOYMENT_WEBROOT) && mkdir -p $(DEPLOYMENT_CSS_SUBDIR)'
	$(RSYNC) --delete $(GEN_CSS_DIR) $(DEPLOYMENT_SERVER):$(DEPLOYMENT_CSS_DIR)

# We create a directory with the RDF that we need to load into our triplestore.
# We do this by downloading (using curl) RDF that has already been deployed to the web.

GET_RDFXML_CURL := curl --silent -H "Accept: application/rdf+xml" -L 
GET_RDFXML = echo "Creating $(2) from $(1)..." && $(GET_RDFXML_CURL) $(1) > $(2)
GET_RDFXML_FOR_VIRTUOSO = $(call GET_RDFXML,$(1),$(GEN_VIRTUOSO_DIR)$(2))
# Datasets on the Virtuoso server are put into a named graph:
GRAPH_NAME := $(DATASET_URI_BASE)

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

# TODO sort out path names here
$(TRIPLESTORE_target): | $(GEN_VIRTUOSO_DIR)
	$(check_valid_edition)
	@echo "Creating files for upload to Virtuoso..."
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


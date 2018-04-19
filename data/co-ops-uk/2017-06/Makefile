# Hint: type 'make' to get the usage message.

GENERATE_target := generate
TEST_target := test
TESTGET_target := testget
DEPLOY_target := deploy
CLEAN_target := clean
TRIPLESTORE_target := triplestore
HELP_target := help
SPARQLTEST_target := sparqltest

.PHONY: $(GENERATE_target) $(TEST_target) $(TESTGET_target) $(DEPLOY_target) $(CLEAN_target) $(TRIPLESTORE_target) $(HELP_target) $(SPARQLTEST_target)

.DEFAULT_GOAL := $(HELP_target)

date ?= $(shell date -u +%Y%m%d)

$(HELP_target):
	@echo USAGE
	@echo -----
	@echo "All options here require that the edition variable is defined on the command line:"
	@echo "\tmake edition=x"
	@echo "This will cause the file 'x.mk' to be included from the directory '$(EDITIONS_DIR)'."
	@echo "Looking at .mk files there, possible values for x include:"
	@echo "\t$(possible_editions)"
	@echo ""
	@echo "make $(HELP_target)"
	@echo "\tPrints help."
	@echo "make $(HELP_target) edition=x"
	@echo "\tPrints help about a edition."
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

# If this Makefile is to be put in a directory other than the one in which common.mk exists
# (and that is very likely), then make needs to be called with -I (--include-dir)
include common.mk
possible_editions := $(basename $(notdir $(wildcard $(EDITIONS_DIR)*.mk)))

# To configure a specific version - put variable definitions in the edition makefile fragment: 
ifdef edition
include $(EDITIONS_DIR)$(edition).mk
endif

# check_for_var will be called via $(eval $(call check_for_var,VAR_NAME,Description of variable))
# ... hence the need for $$. See https://www.gnu.org/software/make/manual/html_node/Eval-Function.html
define check_for_var
ifndef $(1)
$$(info Variable not defined: $(1) - $(2))
$$(error Fatal error - check that you have set edition=<x> on the command line, and that the file <x>.mk defines $(1))
endif
endef

$(eval $(call check_for_var,TOP_OUTPUT_DIR,The top-level output directory))
$(eval $(call check_for_var,STANDARD_CSV,The name of the CSV file, with standard columns, to convert to RDF))
$(eval $(call check_for_var,SE_OPEN_DATA_LIB_DIR,Directory where the se_open_data library code exists))
$(eval $(call check_for_var,SE_OPEN_DATA_BIN_DIR,Directory where the se_open_data library code exists))


# We maintain different editions of the data.
ESSGLOBAL_URI := http://purl.org/solidarityeconomics/experimental/essglobal/

# Any CSS files in CSS_SRC_DIR will be deployed to DEPLOYMENT_CSS_DIR:
CSS_SRC_DIR := css/

DATASET_URI_BASE := $(URI_SCHEME)://$(URI_HOST)/$(URI_PATH_PREFIX)

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
RUBY := ruby
RSYNC := rsync -avz 
SSH := ssh

# Directories
GEN_SPARQL_DIR := $(TOP_OUTPUT_DIR)sparql/
GEN_VIRTUOSO_DIR := $(TOP_OUTPUT_DIR)virtuoso/
# "one big file" of RDF will be created, mostly to make it straightforward to load the whole thing into Virtuoso.
ONE_BIG_FILE_BASENAME := $(GEN_VIRTUOSO_DIR)all

CSS_FILES := $(wildcard $(CSS_SRC_DIR)*.css)
DEPLOYED_CSS_FILES := $(CSS_FILES:css/%=/$(DEPLOYMENT_CSS_SUBDIR)%)
$(info $(CSS_FILES))
$(info $(DEPLOYED_CSS_FILES))


# Where to put files to be transferred to the web server where RDF can be dereferenced, and HTML provided:
WWW_DIR := $(TOP_OUTPUT_DIR)www/
GEN_DOC_DIR := $(WWW_DIR)doc/
GEN_CSS_DIR := $(WWW_DIR)css/
$(GEN_DOC_DIR):
	$(check_valid_edition)
	mkdir -p $@

$(GEN_SPARQL_DIR):
	$(check_valid_edition)
	mkdir -p $@

$(GEN_VIRTUOSO_DIR):
	$(check_valid_edition)
	mkdir -p $@

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

# For testing purposes, we generate a CSV with just the first 100 lines:
#$(CSV_FOR_TESTING_TO_RDF): $(STANDARD_CSV)
	#head -1 $< > $@
	#grep '[0-9],http' $<  | head -100 >> $@

CSV_TO_RDF := $(SE_OPEN_DATA_BIN_DIR)csv/standard/csv-to-rdf.rb
$(GENERATE_target): $(STANDARD_CSV) $(GEN_CSS_DIR) | $(GEN_DOC_DIR) $(GEN_VIRTUOSO_DIR) $(GEN_SPARQL_DIR)
	echo "$(SPARQL_ENDPOINT)" > $(MAP_APP_ENDPOINT_FILE)
	echo "$(GRAPH_NAME)" > $(MAP_APP_GRAPH_FILE)
	$(RUBY) -I $(SE_OPEN_DATA_LIB_DIR) $(CSV_TO_RDF) \
	  --output-directory $(GEN_DOC_DIR) \
	  --uri-prefix $(DATASET_URI_BASE) \
	  --essglobal-uri $(ESSGLOBAL_URI) \
	  --one-big-file-basename $(ONE_BIG_FILE_BASENAME) \
	  --map-app-sparql-query-filename $(MAP_APP_SPARQL_FILE) \
	  --css-files '$(subst $(space),$(comma),$(DEPLOYED_CSS_FILES))' \
	  $<

$(TEST_target): $(GENERATE_target)
	diff -r $(stabledir) $(TOP_OUTPUT_DIR)

# ------------------------------------------------------------------
# Test content negotiation and redirection:
TEST_INITIATIVE_URI_PATHS := R000001 R013429/BD234AA R013429/BH205RQ/2
TEST_URI_PATHS := $(URI_PATH_PREFIX) $(addprefix $(URI_PATH_PREFIX),$(TEST_INITIATIVE_URI_PATHS))
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

# To deploy the generated data on the server, we need to 
#  - make sure the target directory exists on the server
#  - copy the generated data to the server
$(DEPLOY_target):
	$(SSH) $(DEPLOYMENT_SERVER) 'cd $(DEPLOYMENT_WEBROOT) && mkdir -p $(DEPLOYMENT_DOC_SUBDIR)'
	$(RSYNC) $(DEPLOYMENT_RSYNC_FLAGS) $(GEN_DOC_DIR) $(DEPLOYMENT_SERVER):$(DEPLOYMENT_DOC_DIR)
	$(SSH) $(DEPLOYMENT_SERVER) 'cd $(DEPLOYMENT_WEBROOT) && mkdir -p $(DEPLOYMENT_CSS_SUBDIR)'
	$(RSYNC) $(DEPLOYMENT_RSYNC_FLAGS) $(GEN_CSS_DIR) $(DEPLOYMENT_SERVER):$(DEPLOYMENT_CSS_DIR)

# We create a directory with the RDF that we need to load into our triplestore.
# We do this by downloading (using curl) RDF that has already been deployed to the web.

GET_RDFXML_CURL := curl --silent -H "Accept: application/rdf+xml" -L 
GET_RDFXML = echo "Creating $(2) from $(1)..." && $(GET_RDFXML_CURL) $(1) > $(2)
GET_RDFXML_FOR_VIRTUOSO = $(call GET_RDFXML,$(1),$(GEN_VIRTUOSO_DIR)$(2))
# Datasets on the Virtuoso server are put into a named graph:
GRAPH_NAME := $(DATASET_URI_BASE)

version ?= $(shell date -u +%Y%m%d%H%M%S)
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
SPARQL_ENDPOINT := http://store1.solidarityeconomy.coop:8890/sparql
SPARQL_CURL := curl -i -H "Accept: application/json" 

list_sparql_graphs:
	$(check_valid_edition)
	$(SPARQL_CURL) --data-urlencode query@$(SPARQL_FOR_GRAPH_LIST) $(SPARQL_ENDPOINT)

get_info_for_map_app:
	$(check_valid_edition)
	$(SPARQL_CURL) --data default-graph-uri=$(DEFAULT_GRAPH_URI) --data-urlencode query@$(MAP_APP_SPARQL_FILE) $(SPARQL_ENDPOINT)

$(SPARQLTEST_target): list_sparql_graphs get_info_for_map_app


# Populates the triplestore with the generated linked data triples.

# Where to include standard makefile fragments from:
# (MUST define this before including any other makefile fragments!)
# This will define the inc directory within the directory in which this makefile exists.
MAKEFILE_INC_DIR := $(dir $(lastword $(MAKEFILE_LIST)))inc/

.PHONY: all test list_sparql_graphs get_info_for_map_app
.DEFAULT_GOAL := all

# Include from the current working dir (not usually where *this* makefile exists!)
include common.mk

include $(MAKEFILE_INC_DIR)gnu_make_std.mk
include $(MAKEFILE_INC_DIR)var_check.mk
include $(MAKEFILE_INC_DIR)load_edition.mk
include $(MAKEFILE_INC_DIR)files.mk
include $(MAKEFILE_INC_DIR)uris.mk

$(eval $(call var_check,GRAPH_NAME,RDF Named Graph to identify the dataset on the triplestore))
$(eval $(call var_check,DEPLOYMENT_WEBROOT,Absolute pathname on DEPLOYMENT_SERVER of directory to deploy to))
$(eval $(call var_check,VIRTUOSO_ROOT_DATA_DIR,Absolute pathname on VIRTUOSO_SERVER of directory to copy triples to))
$(eval $(call var_check,VIRTUOSO_SQL_SCRIPT,Name of SQL script file to be created here and executed on the triplestore))
$(eval $(call var_check,SPARQL_ENDPOINT,To be used for testing the triplestore once it has been populated))

# Programs used within this makefile:
RSYNC := rsync -avz 
SSH := ssh


GET_RDFXML_CURL := curl --silent -H "Accept: application/rdf+xml" -L 
GET_RDFXML = echo "Creating $(2) from $(1)..." && $(GET_RDFXML_CURL) $(1) > $(2)
GET_RDFXML_FOR_VIRTUOSO = $(call GET_RDFXML,$(1),$(GEN_VIRTUOSO_DIR)$(2))

version ?= $(shell date -u +%Y%m%d%H%M%S)
VIRTUOSO_DATA_DIR := $(VIRTUOSO_ROOT_DATA_DIR)$(version)/
VIRTUOSO_SCRIPT_LOCAL := $(GEN_VIRTUOSO_DIR)$(VIRTUOSO_SQL_SCRIPT)
VIRTUOSO_SCRIPT_REMOTE := $(VIRTUOSO_DATA_DIR)$(VIRTUOSO_SQL_SCRIPT)

# TODO sort out path names here
all: | $(GEN_VIRTUOSO_DIR)
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

SPARQL_CURL := curl -i -H "Accept: application/json" 

# Create the SPARWL query:
$(SPARQL_LIST_GRAPHS_FILE):
	echo "SELECT distinct ?g WHERE { GRAPH ?g { ?s ?p ?o } }" > $@

list_sparql_graphs: $(SPARQL_LIST_GRAPHS_FILE)
	$(SPARQL_CURL) --data-urlencode query@$(SPARQL_LIST_GRAPHS_FILE) $(SPARQL_ENDPOINT)

get_info_for_map_app:
	$(SPARQL_CURL) --data default-graph-uri=$(GRAPH_NAME) --data-urlencode query@$(SPARQL_GET_ALL_FILE) $(SPARQL_ENDPOINT)

test: list_sparql_graphs get_info_for_map_app


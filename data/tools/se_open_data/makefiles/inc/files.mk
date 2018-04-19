# This makefile fragment defines the files that are populated during the steps
# of generating RDF, and related outputs.

# Files related to making SPARQL queries on te virtuoso triplestore go here:
GEN_SPARQL_DIR := $(TOP_OUTPUT_DIR)sparql/

# Foles related loading the data into the Virtiuoso triplestore go here:
GEN_VIRTUOSO_DIR := $(TOP_OUTPUT_DIR)virtuoso/

# Where to put files to be transferred to the web server where RDF can be dereferenced, and HTML provided:
WWW_DIR := $(TOP_OUTPUT_DIR)www/
GEN_DOC_DIR := $(WWW_DIR)doc/
GEN_CSS_DIR := $(WWW_DIR)css/

$(GEN_SPARQL_DIR):
	mkdir -p $@

$(GEN_VIRTUOSO_DIR):
	mkdir -p $@

$(GEN_DOC_DIR):
	mkdir -p $@

$(GEN_CSS_DIR):
	mkdir -p $@

CSS_FILES := $(wildcard $(CSS_SRC_DIR)*.css)
DEPLOYMENT_DOC_SUBDIR := $(URI_PATH_PREFIX)
DEPLOYMENT_DOC_DIR := $(DEPLOYMENT_WEBROOT)$(DEPLOYMENT_DOC_SUBDIR)
DEPLOYMENT_CSS_SUBDIR := css/$(URI_PATH_PREFIX)
DEPLOYMENT_CSS_DIR := $(DEPLOYMENT_WEBROOT)$(DEPLOYMENT_CSS_SUBDIR)

DEPLOYED_CSS_FILES := $(CSS_FILES:css/%=/$(DEPLOYMENT_CSS_SUBDIR)%)

SPARQL_GET_ALL_FILE := $(GEN_SPARQL_DIR)query.rq
SPARQL_LIST_GRAPHS_FILE := $(GEN_SPARQL_DIR)list-graphs.rq
SPARQL_ENDPOINT_FILE := $(GEN_SPARQL_DIR)endpoint.txt
SPARQL_GRAPH_NAME_FILE := $(GEN_SPARQL_DIR)default-graph-uri.txt

# "one big file" of RDF will be created, mostly to make it straightforward to load the whole thing into Virtuoso.
# To this variable will be appended .ttl (for turtle) or .rdf (for RDF/XML):
ONE_BIG_FILE_BASENAME := $(GEN_VIRTUOSO_DIR)all

# Virtuoso Bulk RDF loading uses a file to provide the name of the graph:
VIRTUOSO_NAMED_GRAPH_FILE := $(GEN_VIRTUOSO_DIR)global.graph

# Name of SQL script (created here) to achieve the bulk data loading:
VIRTUOSO_SQL_SCRIPT := loaddata.sql

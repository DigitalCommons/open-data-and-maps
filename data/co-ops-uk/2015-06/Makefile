# Update: June 2016:
# This file is for processing the Co-ops UK open dataset dated 2015-06.
# There is now a new dataset dated 2016-06, and this file has been cloned into the directory for processing that new dataset.
# Given that, with the avaiability of the new dataset, we don't need to work further on the 2015 dataset, 
# this file should be regarded as OBSOLETE.
# All ongoing work will be carried out on the 2016 (and later) datasets.
# If there turns out to be a requirement to continue to work on the 2015 dataset in parallel with the new dataset, 
# then the source code could be restructured to factor out the code that is common to both datasets.

# Hint: type 'make' to get the usage message.

.PHONY: help generate-data deploy
.DEFAULT_GOAL: help

help:
	@echo USAGE
	@echo -----
	@echo "make generate-data"
	@echo "\tGenerate RDF/XML and turtle data from the Co-ops UK file $(COOPS_UK_CSV)."
	@echo "\tresults are stored in the local directory $(GEN_DATA_DIR)." 
	@echo "make deploy"
	@echo "\tDeploy the generated data to the data server."

# Variables to be overridden from the command line:
#
# The value of SERVER would often be the name of a host set up in an ssh config file. 
# See http://nerderati.com/2011/03/17/simplify-your-life-with-an-ssh-config-file/
SERVER ?= parecco
SERVER_DIR ?= public_html/subdomains/solidarityeconomics.org/data/
DATA_SERVER_URL ?= http://data.solidarityeconomics.org

# Define function for executing commands on the server (here using ssh):
SERVER_CMD = ssh $(SERVER) $(1)

# See https://github.com/p6data-coop/ise-linked-open-data/wiki/URIs for a discussion about "experimental"
#IDENTIFIER_PATH ?= experimental/co-ops-uk/
IDENTIFIER_PATH ?= experimental/
DATASET ?= co-ops-uk

# Following data.gov.uk principles, URIs for real-world objects are under `id`, ...
URI_PATTERN ?= id/$(IDENTIFIER_PATH)
# ... and those for the documents about them are under `doc`:
SERVER_DOC_DIR ?= doc/$(IDENTIFIER_PATH)

URI_BASE := $(DATA_SERVER_URL)/$(URI_PATTERN)

# Programs used within this makefile:
SCP := scp
RUBY := ruby
RSYNC := rsync -avz 
# TODO - use rsync for transferring files to server. 
# N.B. http://unix.stackexchange.com/questions/94421/how-to-use-ssh-config-setting-for-each-server-by-rsync

# Source files:
COOPS_UK_CSV := Cooperative_Economy_Open_Dataset_2015_06.csv

# Programs/scripts:
GEN_TRIPLES := generate-triples.rb

# Directories
GEN_DATA_DIR := generated-data/
DATA_DIR := $(GEN_DATA_DIR)$(DATASET)
CSS_SRC_DIR := css/
CSS_GEN_DIR := $(GEN_DATA_DIR)$(DATASET)/css/
CSS_FILES := $(wildcard $(CSS_SRC_DIR)*.css)

$(DATA_DIR):
	mkdir -p $@

# Any css file in the source CSS dir will be copied to the corresponding geenrated_data dir.
# The list of CSS_FILES will be passed to the GEN_TRIPLES ruby script for linking in HTML.
$(CSS_GEN_DIR):
	mkdir -p $@
	cp -r $(CSS_SRC_DIR) $(CSS_GEN_DIR)

# Misc:
TIMESTAMP =  $(shell date +%Y-%m-%dT%H.%M.%S)

generate-data: $(GEN_TRIPLES) $(COOPS_UK_CSV) $(CSS_GEN_DIR) | $(DATA_DIR)
	$(RUBY) $(GEN_TRIPLES) $(COOPS_UK_CSV) $(GEN_DATA_DIR) $(URI_BASE) $(DATASET) '$(CSS_FILES)'

# To deploy the generated data on the server, we need to 
#  - make sure the target directory exists on the server
#  - copy the generated data to the server
deploy:
	@echo deploy
	$(call SERVER_CMD,'cd $(SERVER_DIR) && mkdir -p $(SERVER_DOC_DIR)')
	$(RSYNC) $(GEN_DATA_DIR) $(SERVER):$(SERVER_DIR)$(SERVER_DOC_DIR)


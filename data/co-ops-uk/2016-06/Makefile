# Hint: type 'make' to get the usage message.

GENERATE_target := generate
DEPLOY_target := deploy
HELP_target := help
TEST_target := test
.PHONY: $(HELP_target) $(GENERATE_target) $(DEPLOY_target) $(TEST_target)
.DEFAULT_GOAL: $(HELP_target)

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
	@$(call echo_if_edition_ok,"\\t    $(URI_BASE)$(DATASET)")

# Variables to be overridden from the command line:
#
# The value of SERVER would often be the name of a host set up in an ssh config file. 
# See http://nerderati.com/2011/03/17/simplify-your-life-with-an-ssh-config-file/
SERVER ?= parecco
SERVER_DIR ?= public_html/subdomains/solidarityeconomics.org/data/
DATA_SERVER_URL ?= http://data.solidarityeconomics.org

CHECK_WEBSITES_FLAG := --no-check-websites
ALLOW_BLANK_NODES_FLAG := --allow-blank-nodes

# We maintain different editions of the data.
# The 'edition' variable should be passed in as a command line argument.
# Generated data for each edition is kept in it's own separate directory.
EDITIONS := final test
ifeq ($(edition),final)
  ESSGLOBAL_URI := http://purl.org/essglobal/experimental/
  IDENTIFIER_PATH ?= experimental/
  # There is no max number of CSV rows:
  MAX_CSV_ROWS := 
else ifeq ($(edition),test)
  ESSGLOBAL_URI := http://purl.org/solidarityeconomics/experimental/essglobal/
  IDENTIFIER_PATH ?= experimental/$(edition)/
  MAX_CSV_ROWS := 10
  #CHECK_WEBSITES_FLAG := --check-websites
  ALLOW_BLANK_NODES_FLAG := --no-allow-blank-nodes
else
  edition_errmsg := Unrecognized edition - you must use 'make edition=x' where x is one of {$(EDITIONS)}
  #$(warning $(edition_errmsg))
  BAD_EDITION := yup
endif

define echo_if_edition_ok
@[ -z "$(BAD_EDITION)" ] && echo "$(1)" || true
endef
define check_valid_edition
@[ -z "$(BAD_EDITION)" ] || { echo "$(edition_errmsg)" && false; }
endef


# See https://github.com/p6data-coop/ise-linked-open-data/wiki/URIs for a discussion about "experimental"
DATASET ?= co-ops-uk

# Following data.gov.uk principles, URIs for real-world objects are under `id`, ...
URI_PATTERN ?= id/$(IDENTIFIER_PATH)
# ... and those for the documents about them are under `doc`:
SERVER_DOC_DIR ?= doc/$(IDENTIFIER_PATH)

URI_BASE := $(DATA_SERVER_URL)/$(URI_PATTERN)
DOC_URL_BASE := $(DATA_SERVER_URL)/$(SERVER_DOC_DIR)

# Programs used within this makefile:
SCP := scp
RUBY := ruby
RSYNC := rsync -avz 
# TODO - use rsync for transferring files to server. 
# N.B. http://unix.stackexchange.com/questions/94421/how-to-use-ssh-config-setting-for-each-server-by-rsync

# Source files:
COOPS_UK_OUTLETS_CSV := co-operativeeconomy_opendataextract2016/2016open_data_outlets.csv
COOPS_UK_ORGS_CSV := co-operativeeconomy_opendataextract2016/2016open_data_organisations.csv

# Programs/scripts:
GEN_TRIPLES := generate-triples.rb

# Directories
GEN_DATA_DIR := generated-data/$(edition)/$(IDENTIFIER_PATH)
DATA_DIR := $(GEN_DATA_DIR)$(DATASET)
CSS_SRC_DIR := css/
CSS_GEN_DIR := $(GEN_DATA_DIR)$(DATASET)/css/
CSS_FILES := $(wildcard $(CSS_SRC_DIR)*.css)

$(DATA_DIR):
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

$(GENERATE_target): $(GEN_TRIPLES) $(COOPS_UK_ORGS_CSV) $(COOPS_UK_OUTLETS_CSV) $(CSS_GEN_DIR) | $(DATA_DIR)
	$(check_valid_edition)
	$(RUBY) $(GEN_TRIPLES) --organizations-csv $(COOPS_UK_ORGS_CSV) \
		--outlets-csv $(COOPS_UK_OUTLETS_CSV) \
		--output-dir $(GEN_DATA_DIR) \
		--uri-base $(URI_BASE) \
		--doc-url-base $(DOC_URL_BASE) \
		--dataset $(DATASET) \
		--css-files '$(subst $(space),$(comma),$(CSS_FILES))' \
		--essglobal-uri $(ESSGLOBAL_URI) \
		--max-csv-rows $(MAX_CSV_ROWS) \
		$(CHECK_WEBSITES_FLAG) $(ALLOW_BLANK_NODES_FLAG)

# Define function for executing commands on the server (here using ssh):
SERVER_CMD = ssh $(SERVER) $(1)

SERVER_PATH := $(SERVER_DIR)$(SERVER_DOC_DIR)

# To deploy the generated data on the server, we need to 
#  - make sure the target directory exists on the server
#  - copy the generated data to the server
$(DEPLOY_target):
	@echo $(DEPLOY_target)
	$(call SERVER_CMD,'cd $(SERVER_DIR) && mkdir -p $(SERVER_DOC_DIR)')
	$(RSYNC) $(GEN_DATA_DIR) $(SERVER):$(SERVER_PATH)


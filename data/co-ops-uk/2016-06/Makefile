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
	@echo "make $(GENERATE_target)"
	@echo "\tGenerate RDF/XML and turtle data from the Co-ops UK files"
	@echo "\t  $(COOPS_UK_ORGS_CSV)"
	@echo "\t  $(COOPS_UK_OUTLETS_CSV)"
	@echo "\tResults are stored in the local directory $(GEN_DATA_DIR)." 
	@echo "make $(DEPLOY_target)"
	@echo "\tDeploy the generated data to the data server using the command"
	@echo "\t  $(RSYNC_CMD)"
	@echo "\tAfter deployment, assuming content negotiation is configured properly, data can be accessed at this URI:"
	@echo "\t  $(URI_BASE)$(DATASET)"

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
IDENTIFIER_PATH ?= experimental/test1/
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
GEN_DATA_DIR := generated-data/$(IDENTIFIER_PATH)
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

# Standard GNU make trick - see http://stackoverflow.com/a/7531247/685715
nullstring :=
space := $(nullstring) # end of the line
comma := ,

$(GENERATE_target): $(GEN_TRIPLES) $(COOPS_UK_ORGS_CSV) $(COOPS_UK_OUTLETS_CSV) $(CSS_GEN_DIR) | $(DATA_DIR)
	$(RUBY) $(GEN_TRIPLES) --organizations-csv $(COOPS_UK_ORGS_CSV) \
		--outlets-csv $(COOPS_UK_OUTLETS_CSV) \
		--output-dir $(GEN_DATA_DIR) \
		--uri-base $(URI_BASE) \
		--doc-url-base $(DOC_URL_BASE) \
		--dataset $(DATASET) \
		--css-files '$(subst $(space),$(comma),$(CSS_FILES))'

# To deploy the generated data on the server, we need to 
#  - make sure the target directory exists on the server
#  - copy the generated data to the server
RSYNC_CMD := $(RSYNC) $(GEN_DATA_DIR) $(SERVER):$(SERVER_DIR)$(SERVER_DOC_DIR)
$(DEPLOY_target):
	@echo $(DEPLOY_target)
	$(call SERVER_CMD,'cd $(SERVER_DIR) && mkdir -p $(SERVER_DOC_DIR)')
	$(RSYNC_CMD)


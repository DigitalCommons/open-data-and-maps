# Hint: type 'make' to get the usage message.

.PHONY: help generate-vocab deploy
.DEFAULT_GOAL: help

help:
	@echo USAGE
	@echo -----
	@echo "make generate-vocab"
	@echo "\tGenerate RDF/XML and turtle vocab from a ruby script."
	@echo "\tGenerated vocab is stored in the local directory $(GEN_VOCAB_DIR)." 
	@echo "make deploy"
	@echo "\tDeploy the generated vocab from $(GEN_VOCAB_DIR) to the vocab server."

# Variables to be overridden from the command line:
#
# The value of SERVER would often be the name of a host set up in an ssh config file. 
# See http://nerderati.com/2011/03/17/simplify-your-life-with-an-ssh-config-file/
SERVER ?= parecco
SERVER_DIR ?= public_html/subdomains/solidarityeconomics.org/vocab/
VOCAB_SERVER_URL ?= http://vocab.solidarityeconomics.org

# Define function for executing commands on the server (here using ssh):
SERVER_CMD = ssh $(SERVER) $(1)

# See https://github.com/p6data-coop/ise-linked-open-data/wiki/URIs for a discussion about "experimental"
#IDENTIFIER_PATH ?= experimental/co-ops-uk/
IDENTIFIER_PATH ?= experimental/
VOCAB_NAME ?= ise-vocab

# TODO - Clarify distinction between URI_BASE and SERVER_DOC_DIR.
#        Is it just a hang-over from the id/doc distiction for data, and unwanted for a vocab?
URI_PATTERN ?= id/$(IDENTIFIER_PATH)
SERVER_DOC_DIR ?= doc/$(IDENTIFIER_PATH)

URI_BASE := $(VOCAB_SERVER_URL)/$(URI_PATTERN)
DOC_URL_BASE := $(VOCAB_SERVER_URL)/$(SERVER_DOC_DIR)

# Programs used within this makefile:
SCP := scp
RUBY := ruby
RSYNC := rsync -avz 
# TODO - use rsync for transferring files to server. 
# N.B. http://unix.stackexchange.com/questions/94421/how-to-use-ssh-config-setting-for-each-server-by-rsync

# Programs/scripts:
GEN_VOCAB := generate-vocab.rb

# Directories
GEN_VOCAB_DIR := generated-vocab/
LOCAL_DATA_DIR := $(GEN_VOCAB_DIR)$(VOCAB_NAME)
CSS_SRC_DIR := css/
CSS_GEN_DIR := $(GEN_VOCAB_DIR)$(VOCAB_NAME)/css/
CSS_FILES := $(wildcard $(CSS_SRC_DIR)*.css)

$(LOCAL_DATA_DIR):
	mkdir -p $@

# Any css file in the source CSS dir will be copied to the corresponding generated_vocab dir.
# The list of CSS_FILES will be passed to the GEN_VOCAB ruby script for linking in HTML.
$(CSS_GEN_DIR):
	mkdir -p $@
	cp -r $(CSS_SRC_DIR) $(CSS_GEN_DIR)

# Misc:
TIMESTAMP =  $(shell date +%Y-%m-%dT%H.%M.%S)

generate-vocab: $(GEN_VOCAB) $(CSS_GEN_DIR) | $(LOCAL_DATA_DIR)
	$(RUBY) $(GEN_VOCAB) $(GEN_VOCAB_DIR) $(URI_BASE) $(DOC_URL_BASE) $(VOCAB_NAME) '$(CSS_FILES)'

# To deploy the generated vocab on the server, we need to 
#  - make sure the target directory exists on the server
#  - copy the generated vocab to the server
deploy:
	@echo deploy
	$(call SERVER_CMD,'cd $(SERVER_DIR) && mkdir -p $(SERVER_DOC_DIR)')
	$(RSYNC) $(GEN_VOCAB_DIR) $(SERVER):$(SERVER_DIR)$(SERVER_DOC_DIR)


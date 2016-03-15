# Some things to do with this directory:

# Variables to be overridden from the command line:
#
# The value of SERVER would often be the name of a host set up in an ssh config file. 
# See http://nerderati.com/2011/03/17/simplify-your-life-with-an-ssh-config-file/
SERVER ?= parecco
SERVER_DIR ?= public_html/subdomains/solidarityeconomics.org/data/
DATA_SERVER_URL ?= http://data.solidarityeconomics.org
TEST_ID ?= id/sse/ise 

# Programs used within this makefile:
SCP := scp

# Source files:
HTACCESS_SRC := example.htaccess

# Misc:
TIMESTAMP =  $(shell date +%Y-%m-%dT%H.%M.%S)
HTACCESS_BACKUP := $(TIMESTAMP).htaccess.backup 
HTACCESS_TGT := $(SERVER):$(SERVER_DIR).htaccess

.PHONY: help deploy
.DEFAULT_GOAL: help

help:
	@echo USAGE
	@echo -----
	@echo "make deploy"
	@echo "\tCopy $(HTACCESS_SRC) to $(HTACCESS_TGT)"
	@echo 
	@echo "make test"
	@echo "\tTest the content negotiation set up in .htaccess by fetching things with curl"

deploy:
	@echo Attempting to backup $(HTACCESS_TGT) to local file: $(HTACCESS_BACKUP)...
	-$(SCP) $(HTACCESS_TGT) $(HTACCESS_BACKUP) 
	$(SCP) $(HTACCESS_SRC) $(HTACCESS_TGT)

# TODO: use the http_code (see --write-out) to compare with expected results.
test:
	@echo "Make command:"
	@echo "\tmake test TEST_ID=$(TEST_ID) DATA_SERVER_URL=$(DATA_SERVER_URL)"
	@echo
	curl --head --location --header "Accept: application/rdf+xml" $(DATA_SERVER_URL)/$(TEST_ID) --write-out "HTTP CODE: %{http_code}. Is that as expected?\n"

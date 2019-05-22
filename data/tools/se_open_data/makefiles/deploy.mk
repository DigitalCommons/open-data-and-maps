# Deploys generated Linked Data and HTML to DEPLOYMENT_SERVER

# Where to include standard makefile fragments from:
# (MUST define this before including any other makefile fragments!)
# This will define the inc directory within the directory in which this makefile exists.
MAKEFILE_INC_DIR := $(dir $(lastword $(MAKEFILE_LIST)))inc/

.PHONY: all test
.DEFAULT_GOAL := all

# Include from the current working dir (not usually where *this* makefile exists!)
include common.mk

include $(MAKEFILE_INC_DIR)gnu_make_std.mk
include $(MAKEFILE_INC_DIR)var_check.mk
include $(MAKEFILE_INC_DIR)load_edition.mk
include $(MAKEFILE_INC_DIR)files.mk
include $(MAKEFILE_INC_DIR)uris.mk

$(eval $(call var_check,DEPLOYMENT_SERVER,Name of host defined in ssh config to deploy RDF to))
$(eval $(call var_check,DEPLOYMENT_WEBROOT,Absolute pathname on DEPLOYMENT_SERVER of diretory to deploy to))

# Programs used within this makefile:
RSYNC := rsync -avz --no-perms --omit-dir-times 
SSH := ssh

# To deploy the generated data on the server, we need to 
#  - make sure the target directory exists on the server
#  - copy the generated data to the server
all:
	$(SSH) $(DEPLOYMENT_SERVER) 'cd $(DEPLOYMENT_WEBROOT) && mkdir -p $(DEPLOYMENT_DOC_SUBDIR)'
	$(RSYNC) $(DEPLOYMENT_RSYNC_FLAGS) $(GEN_DOC_DIR) $(DEPLOYMENT_SERVER):$(DEPLOYMENT_DOC_DIR)
	$(SSH) $(DEPLOYMENT_SERVER) 'cd $(DEPLOYMENT_WEBROOT) && mkdir -p $(DEPLOYMENT_CSS_SUBDIR)'
	$(RSYNC) $(DEPLOYMENT_RSYNC_FLAGS) $(GEN_CSS_DIR) $(DEPLOYMENT_SERVER):$(DEPLOYMENT_CSS_DIR)

# ------------------------------------------------------------------
# Test content negotiation and redirection:
TEST_URI_PATHS := $(URI_PATH_PREFIX) $(addprefix $(URI_PATH_PREFIX),$(TEST_INITIATIVE_IDENTIFIERS))
TEST_URIS := $(addprefix https://$(URI_HOST)/,$(TEST_URI_PATHS))

define TESTGET_method
@for n in $(TEST_URIS); do \
	echo "\nAccept:\t$(1)";\
	echo "TEST:\t$$n";\
	curl -H 'Accept: $(1)' --silent --output /dev/null --write-out "CODE:\t%{http_code}\nRES:\t%{redirect_url}\n" $$n\
	; done
endef

test:
	$(check_valid_edition)
	@$(call TESTGET_method,text/html)
	@$(call TESTGET_method,application/xhtml+xml)
	@$(call TESTGET_method,application/rdf+xml)
	@$(call TESTGET_method,text/turtle)


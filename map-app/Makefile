# Hint: type 'make' to get the usage message.

# Where to include standard makefile fragments from:
MAKEFILE_INC_DIR := makefile-lib/

include $(MAKEFILE_INC_DIR)gnu_make_std.mk

# make the var_check function available to check if variabes are defined:
include $(MAKEFILE_INC_DIR)var_check.mk

# This makefile requires variant to be specified on the command line:
include $(MAKEFILE_INC_DIR)load_variant.mk

# Variables we expect to have been defined in the variant makefile fragment:
$(eval $(call var_check,SERVER,Name of server to which app is to be deployed))
$(eval $(call var_check,SERVER_BASE_DIR,Base deployment directory on server (must pre-exist)))
$(eval $(call var_check,SERVER_APP_SUBDIR,Directory under SERVER_BASE_DIR to deploy to (will be created during deployment)))
$(eval $(call var_check,SRC_CONFIG_DIR,Directory with config files to copy when 'make configure' is run))
$(eval $(call var_check,DEPLOYED_MAP_URL,URL where map will be found after deployment))
$(eval $(call var_check_warning,HTACCESS_FILE,Name of .htaccess file to be deployed to server,If absent no .htaccess will be deployed and that's usually fine))
$(eval $(call var_obsolete,SRC_CONFIG_JSON))

.PHONY: help lint configure build deploy-dry-run deploy deploy_htaccess
.PHONY: build_map clean_config
.DEFAULT_GOAL: help

help:
	@echo USAGE
	@echo -----
	@echo "make variant=<name> configure"
	@echo "\tConfigure the application according to which variant is specified on the make command line."
	@echo "make variant=<name> build"
	@echo "\tBuild the javascript app using $(PACKAGER_OPTIMIZER) according to the configuration in $(BUILD_CONFIG)."
	@echo "make variant=<name> lint"
	@echo "\tRun the linter $(LINT) on the javascrip app."
	@echo "make variant=<name> deploy-dry-run"
	@echo "\tRebuild then perform a dry-run of the deployment. Examine the results carefully!"
	@echo "\tNote this has the side effect of creating a directory on the server, if it doesn't already exist."
	@echo "make variant=<name> deploy"
	@echo "\tRebuild and then deploy to the server."
	@echo "\tWARNING: Deploying to the service will delete files that don't match our local build!"
	@echo "\tWARNING: Be absolutely sure that the target directory on the server is the right one!"
	@echo "\tWARNING: Run 'make variant=$(variant) deploy-dry-run' first, and check the output!"
	@echo ""
	@echo "Configured version: $(shell cat $(TGT_VERSION_JSON))"

LINT := eslint
RSYNC := rsync -avzc --delete

SRC_DIR := www/

# All builds live under the same directory
BUILD_TOP_DIR := builds/

# Builds for a sepcific variant go here:
BUILD_DIR := $(BUILD_TOP_DIR)$(variant)/

PACKAGER_OPTIMIZER := r.js
BUILD_CONFIG := build.js

APP_DIR := $(SRC_DIR)app/
JS_FILES := $(SRC_DIR)app.js $(shell find $(APP_DIR) -name '*.js')

# variants and configure
#
# The purpose of the configure target is to allow different maps to be created from the same source code.
# Some things that differ from one variant of the map to another:
#   The datasets to load
#   The server (and dir) to which the map-app is to be deployed
#   Logo
#   Title
#   CSS
#   Features (! that's getting ambitious - we may need to rethink this approach if ever we get that far)
#
# Each variant has its own JSON config file.
# That config file is copied to a well known name in the $(CONFIG_DIR) when the configure target is run.
# From there it can be loaded when the app starts, when the app is run locally for debugging.
# It will be built (along with all the other files) when the build target is run, ready for deployment.
CONFIG_DIR := $(SRC_DIR)configuration/

# The running map-app will be expecting various files to be 
# available in $(CONFIG_DIR).
# Here we create the names of those expected files:
TGT_VERSION_JSON := $(CONFIG_DIR)version.json
CONFIG_FILES_TO_COPY := config.json about.html
TGT_CONFIG_FILES := $(addprefix $(CONFIG_DIR),$(CONFIG_FILES_TO_COPY))

# The DEPLOYED_VERSION_JSON is used as part of a test:
DEPLOYED_VERSION_JSON := $(DEPLOYED_MAP_URL)$(subst $(SRC_DIR),,$(TGT_VERSION_JSON))

# This is where we generate individual goals for each of the TGT_CONFIG_FILES:
# This helps us to get explicit messages when a variant fails
# to contain one of the required config files.
define CONFIG_template
$(CONFIG_DIR)$(1) : $(SRC_CONFIG_DIR)$(1)
	ln -f $$< $$@
endef

# Generate one makefile fragment for each config file that just
# requires a simple link to be made to 'copy' it:
$(foreach file,$(CONFIG_FILES_TO_COPY),$(eval $(call CONFIG_template,$(file))))

$(CONFIG_DIR):
	mkdir -p $(CONFIG_DIR)
	touch $(CONFIG_DIR)GENERATED_DIR-DO_NOT_STORE_SOURCE_HERE

## We're going to add git commit info to the version info:
WORKING_COPY_MODIFIED = $(shell git status --porcelain --untracked-files=no .)

# The above git status command will return nothing if nothing has been modified
ifeq ($(WORKING_COPY_MODIFIED),)
        MODIFIED_TAG :=
else
        MODIFIED_TAG := -modified
endif
COMMIT_HASH := $(shell git rev-parse --short HEAD)$(MODIFIED_TAG)


# When configuring, a link is prefered to a copy because:
# with a link, any edits to SRC_CONFIG_JSON are immediately available for local debugging,
# without having to make the configure target afresh:

# We always want the config filesto be created afresh,
# so we delete them first:
clean_config:
	rm -f $(TGT_CONFIG_FILES)

configure: clean_config $(TGT_CONFIG_FILES) | $(CONFIG_DIR)
	echo '{"variant": "$(variant)","timestamp": "'`date +%Y-%m-%dT%H:%M:%S%z`'", "gitcommit": "$(COMMIT_HASH)"}' > $(TGT_VERSION_JSON)

$(BUILD_DIR):
	mkdir -p $@

build: configure | $(BUILD_DIR)
	node $(PACKAGER_OPTIMIZER) -o $(BUILD_CONFIG) dir=$(BUILD_DIR)
	find $(BUILD_DIR) -name '*.swp' -exec rm {} \;	# Delete files left behind by VIM

lint:
	$(LINT) $(JS_FILES)

# Define macro for executing commands on the server (here using ssh):
SERVER_CMD = ssh $(SERVER) $(1)

# Define macro for deploying directories to the server:
# $(1) is the name of a local directory whose contents are to be deployed.
# $(2) is the name of the dir on the server (a sub-directory of $(SERVER_BASE_DIR))
define DEPLOY_DIR
$(call SERVER_CMD,'cd $(SERVER_BASE_DIR) && mkdir -p $(2)')
$(RSYNC) $(3) $(1) $(SERVER):$(SERVER_BASE_DIR)$(2)
endef

ifdef HTACCESS_FILE
deploy_htaccess:
	@echo "$(HTACCESS_FILE) will be copied"
	$(RSYNC)  $(HTACCESS_FILE) $(SERVER):$(SERVER_BASE_DIR)$(SERVER_APP_SUBDIR).htaccess
else
deploy_htaccess:
	@echo "No htaccess file"
endif

deploy-dry-run: build
	@echo "------------------------------------------------------------"
	@echo " DEPLOY-DRY-RUN starts here:"
	@sleep 2
	@echo ""
	$(call DEPLOY_DIR,$(BUILD_DIR),$(SERVER_APP_SUBDIR),--dry-run)

deploy: build deploy_htaccess
	$(call DEPLOY_DIR,$(BUILD_DIR),$(SERVER_APP_SUBDIR))
	@echo "There are subdirectories of www/services that contain info for querying datasets via SPARQL."
	@echo "Make sure they are up to date."
	@echo "For example, see ../data/co-ops-uk/2017-06/generated-data/final/sparql/."
	@echo ""
	@echo "Checking that the deployed version matches the local version (next command should output nothing!):"
	echo `curl -s $(DEPLOYED_VERSION_JSON)` | diff $(TGT_VERSION_JSON) -
	@echo ""
	@echo "NOW CHECK that the map is available at $(DEPLOYED_MAP_URL)"

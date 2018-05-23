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
$(eval $(call var_check,SRC_CONFIG_JSON,JSON config file to be loaded into the running map-app))

.PHONY: help deploy lint build configure
.PHONY: build_map
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
	@echo "make variant=<name> deploy"
	@echo "\tDeploy to the server."

LINT := eslint
RSYNC := rsync -avz 

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

# This corresponds to the name used within other js files to refer to this config file:
TGT_CONFIG_JSON := $(CONFIG_DIR)config.json

$(CONFIG_DIR):
	mkdir -p $(CONFIG_DIR)
	touch $(CONFIG_DIR)GENERATED_DIR-DO_NOT_STORE_SOURCE_HERE

configure: | $(CONFIG_DIR)
	cp -f $(SRC_CONFIG_JSON) $(TGT_CONFIG_JSON)

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
$(RSYNC) $(1) $(SERVER):$(SERVER_BASE_DIR)$(2)
endef

deploy: build
	$(call DEPLOY_DIR,$(BUILD_DIR),$(SERVER_APP_SUBDIR))
	@echo "There are subdirectories of www/services that contain info for querying datasets via SPARQL."
	@echo "Make sure they are up to date."
	@echo "For example, see ../data/co-ops-uk/2017-06/generated-data/final/sparql/."

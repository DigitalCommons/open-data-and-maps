# Hint: type 'make' to get the usage message.

.PHONY: help deploy lint build
.PHONY: build_coops_uk_map
.DEFAULT_GOAL: help

help:
	@echo USAGE
	@echo -----
	@echo "make build"
	@echo "\tBuild the javascript app using $(PACKAGER_OPTIMIZER) according to the configuration in $(BUILD_CONFIG)."
	@echo "make lint"
	@echo "\tRun the linter $(LINT) on the javascrip app."
	@echo "make deploy"
	@echo "\tDeploy to the server."

# Variables to be overridden from the command line:
#
# The value of SERVER would often be the name of a host set up in an ssh config file. 
SERVER ?= ise-0-admin
SERVER_DIR ?= /var/www/html/
DATA_SERVER_URL ?= http://data.solidarityeconomics.org

LINT := eslint
RSYNC := rsync -avz 

SRC_DIR := www/
BUILT_DIR := www-built/
SERVER_APP_DIR := maps/dotcoop/
PACKAGER_OPTIMIZER := r.js
BUILD_CONFIG := build.js

APP_DIR := $(SRC_DIR)app/
JS_FILES := $(SRC_DIR)app.js $(shell find $(APP_DIR) -name '*.js')

build_coops_uk_map:
	node $(PACKAGER_OPTIMIZER) -o $(BUILD_CONFIG) dir=coops_uk_map
	find $(BUILT_DIR) -name '*.swp' -exec rm {} \;	# Delete files left behind by VIM


build:
	node $(PACKAGER_OPTIMIZER) -o $(BUILD_CONFIG)
	find $(BUILT_DIR) -name '*.swp' -exec rm {} \;	# Delete files left behind by VIM

lint:
	$(LINT) $(JS_FILES)

# Define macro for executing commands on the server (here using ssh):
SERVER_CMD = ssh $(SERVER) $(1)

# Define macro for deploying directories to the server:
# $(1) is the name of a local directory whose contents are to be deployed.
# $(2) is the name of the dir on the server (a sub-directory of $(SERVER_DIR))
define DEPLOY_DIR
$(call SERVER_CMD,'cd $(SERVER_DIR) && mkdir -p $(2)')
$(RSYNC) $(1) $(SERVER):$(SERVER_DIR)$(2)
endef

deploy: build
	$(call DEPLOY_DIR,$(BUILT_DIR),$(SERVER_APP_DIR))
	@echo "There are subdirectories of www/services that contain info for querying datasets via SPARQL."
	@echo "Make sure they are up to date."
	@echo "For example, see ../data/co-ops-uk/2017-06/generated-data/final/sparql/."

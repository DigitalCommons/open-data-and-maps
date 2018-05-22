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
#DATA_SERVER_URL ?= http://data.solidarityeconomics.org

LINT := eslint
RSYNC := rsync -avz 

SRC_DIR := www/
BUILT_DIR := www-built/
SERVER_APP_DIR := maps/dotcoop-coopsuk/
PACKAGER_OPTIMIZER := r.js
BUILD_CONFIG := build.js

APP_DIR := $(SRC_DIR)app/
JS_FILES := $(SRC_DIR)app.js $(shell find $(APP_DIR) -name '*.js')

# Perhaps this can be sorted out with the config mechanism?
# Should the config mechanism also use dir= ?
build_coops_uk_map:
	node $(PACKAGER_OPTIMIZER) -o $(BUILD_CONFIG) dir=coops_uk_map
	find $(BUILT_DIR) -name '*.swp' -exec rm {} \;	# Delete files left behind by VIM

# VARIANTS and config
#
# The purpose of the config target is to allow different maps to be created from the same source code.
# Some things that differ from one variant of the map to another:
#   The datasets to load
#   The server (and dir) to which the map-app is to be deployed
#   Logo
#   Title
#   CSS
#   Features (! that's getting ambitious - we may need to rethink this approach if ever we get that far)
#
# Let's assume that each map has its own JSON config file.
# And that the map loads this config on start up.
# (Neither of the above are yet implemented).
#
# Configuration needs to cope with two requirements:
#    The correct variant of the application is deployed to the right server.
#    The application can be run locally fopr testing a particular variant.
#
# Can we assume (for now) that the only difference between two variants of the map-app
# is the JSON config file to be loaded by the app at startup?
# Clearly, that config file must live in a place known to the app when it runs:
# RUNTIME_CONFIG_JSON := services/config.json
#
# Or, should that be a javascript file that's loaded and run????? 
# See https://stackoverflow.com/a/14521482/685715
# Maybe a combination of JSON (for simple config parameters), and js for somthing
# trickier. Of course, the JSON would include the name(s) of the js to load.
# I'm smelling a plug-in mechanism ... :-)
# This isn't needed for now, but we'll bare it in mind...
#
# Suggested mechnism:
#   This makefile takes a command line parameter: variant=foo.
#   There must exist a makefile fragment called variants/foo.mk.
#   variants/foo.mk is loaded into this makefile.
#   variants/foo.mk sets all the make variables that may differ between variants.
#
# For example:
#
# SERVER := ise-0-admin
# SERVER_DIR := /var/www/html/
# BUILT_DIR := dotcoop-coopsuk/
# SERVER_APP_DIR := maps/dotcoop-coopsuk/
# SRC_CONFIG_JSON := configurations/dotcoop-coopsuk.json
#
# For the config file, can we just create a symbolic link? :
# ln -s $(SRC_CONFIG_JSON) $(RUNTIME_CONFIG_JSON)
#
# For safety, it might be best if all BUILT_DIRs are inside a dir called 'built'.
# That means we're protected against this: BUILT_DIR := www (DON"T DO THAT!),
# which might stand a chance of overwriting www.
#
#   Might we also need to allow for the variants/foo.mk to specify some commands to be executed?
#   If so, we could require all such variants/foo.mk to include a make target called 'variant',
#   and then the config target in this makefile can depend on variant.
#
config:
	@echo "config"

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

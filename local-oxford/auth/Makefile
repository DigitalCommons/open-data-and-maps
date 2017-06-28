.PHONY: help deploy build
.DEFAULT_GOAL: help

help:
	@echo USAGE
	@echo -----
	@echo "make build"
	@echo "\tBuild the version to be deployed."
	@echo "make deploy"
	@echo "\tDeploy to the server."

# The value of SERVER would often be the name of a host set up in an ssh config file. 
# See http://nerderati.com/2011/03/17/simplify-your-life-with-an-ssh-config-file/
SERVER ?= parecco
SERVER_APP_DIR ?= public_html/subdomains/solidarityeconomics.org/oxford
BUILT_DIR := ./

RSYNC := rsync -avz --chmod=D755,F644

# Define macro for executing commands on the server (here using ssh):
SERVER_CMD = ssh $(SERVER) $(1)

# Define macro for deploying directories to the server:
# $(1) is the name of a local directory whose contents are to be deployed.
# $(2) is the name of the dir on the server (a sub-directory of $(SERVER_DIR))
define DEPLOY_DIR
$(call SERVER_CMD,'cd $(SERVER_DIR) && mkdir -p $(2)')
$(RSYNC) $(1) $(SERVER):$(SERVER_DIR)$(2)
endef

deploy:
	$(call DEPLOY_DIR,$(BUILT_DIR),$(SERVER_APP_DIR))
# For deploying experiments

ifndef srcdir
$(error You must specify srcdir= on the make command line. Do not add a trailing '/' to the name of the dir.)
endif

# Server to deploy to:
SERVER := ise-0-matt

# Dir on we server which must pre-exist
SERVER_BASE_DIR := /var/www/html/internal/experiments/
SRC_DIR := $(srcdir)/
TGT_DIR := $(SRC_DIR)

# URL where experiment will be found after deployment:
DEPLOYED_MAP_URL := https://internal.solidarityeconomy.coop/experiments/$(TGT_DIR)

# Define macro for executing commands on the server (here using ssh):
SERVER_CMD = ssh $(SERVER) $(1)

#RSYNC := rsync -avzc --delete
RSYNC := rsync -avzc

# Define macro for deploying directories to the server:
# $(1) is the name of a local directory whose contents are to be deployed.
# $(2) is the name of the dir on the server (a sub-directory of $(SERVER_BASE_DIR))
# $(3) extra args for rsync
define DEPLOY_DIR
$(call SERVER_CMD,'cd $(SERVER_BASE_DIR) && mkdir -p $(2)')
$(RSYNC) $(3) $(1) $(SERVER):$(SERVER_BASE_DIR)$(2)
endef

deploy-dry-run: $(srcdir)
	$(call DEPLOY_DIR,$(SRC_DIR),$(TGT_DIR),--dry-run)
	@echo "---------------------------------------------------------"
	@echo "Dry run complete - CHECK IT THOROUGHLY."
	@echo "To deploy for real:"
	@echo "\tmake deploy srcdir=$(srcdir)"

deploy: $(srcdir)
	$(call DEPLOY_DIR,$(SRC_DIR),$(TGT_DIR))
	@echo "---------------------------------------------------------"
	@echo "NOW CHECK that the map is available at $(DEPLOYED_MAP_URL)"

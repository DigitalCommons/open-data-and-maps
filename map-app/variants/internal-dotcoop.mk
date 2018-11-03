# This variant is for testing.
# It's a variant of the dotcoop variant
PARENT_VARIANT := dotcoop

# Server to deploy to:
SERVER := ise-0-matt

# Base deployment directory on server (must pre-exist):
SERVER_BASE_DIR := /var/www/html/internal/maps/

# Directory under SERVER_BASE_DIR to deploy to (will be created during deployment):
SERVER_APP_SUBDIR := $(PARENT_VARIANT)/

# URL where map will be found after deployment:
DEPLOYED_MAP_URL := https://internal.solidarityeconomy.coop/maps/$(SERVER_APP_SUBDIR)

# Directory for config files to be used for this variant of the map:
SRC_CONFIG_DIR := variants/$(PARENT_VARIANT)/


# This variant is for testing.
# It's a variant of the newcastle-mapjam variant
PARENT_VARIANT := newcastle-mapjam

# Server to deploy to:
SERVER := ise-0-matt

# Base deployment directory on server (must pre-exist):
SERVER_BASE_DIR := /var/www/html/internal/maps/

# Directory under SERVER_BASE_DIR to deploy to (will be created during deployment):
SERVER_APP_SUBDIR := $(PARENT_VARIANT)/

# URL where map will be found after deployment:
DEPLOYED_MAP_URL := https://internal.solidarityeconomy.coop/maps/$(SERVER_APP_SUBDIR)

# JSON file for this configuration, to be loaded into the running map-app:
SRC_CONFIG_JSON := variants/$(PARENT_VARIANT)/config.json

HTACCESS_FILE := variants/$(PARENT_VARIANT)/internal-newcastle-mapjam.htaccess

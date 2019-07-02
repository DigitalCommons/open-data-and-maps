# This variant is for testing.
# It's a variant of the newcastle-mapjam variant
PARENT_VARIANT := oxford

# Server to deploy to:
SERVER := sea-map-joe

# Base deployment directory on server (must pre-exist):
SERVER_BASE_DIR := /var/www/html/oxford-map/

# Directory under SERVER_BASE_DIR to deploy to (will be created during deployment):
SERVER_APP_SUBDIR := $(PARENT_VARIANT)/
SERVER_APP_SUBDOM := $(PARENT_VARIANT)

# URL where map will be found after deployment:
DEPLOYED_MAP_URL := https://$(SERVER_APP_SUBDOM).solidarityeconomy.coop/

# Directory for config files to be used for this variant of the map:
SRC_CONFIG_DIR := variants/$(PARENT_VARIANT)/



# Server to deploy to:
SERVER := ise-0-admin

# Base deployment directory on server (must pre-exist):
SERVER_BASE_DIR := /var/www/html/maps/

# Directory under SERVER_BASE_DIR to deploy to (will be created during deployment):
SERVER_APP_SUBDIR := $(variant)/

# URL where map will be found after deployment:
DEPLOYED_MAP_URL := https://maps.solidarityeconomy.coop/$(SERVER_APP_SUBDIR)

# Directory for config files to be used for this variant of the map:
SRC_CONFIG_DIR := variants/$(variant)/

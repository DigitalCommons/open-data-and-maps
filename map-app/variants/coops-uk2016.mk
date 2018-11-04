
# Server to deploy to:
SERVER := ise-0-admin

# Base deployment directory on server (must pre-exist):
SERVER_BASE_DIR := /var/www/html/maps/

# Directory under SERVER_BASE_DIR to deploy to (will be created during deployment):
SERVER_APP_SUBDIR := coops-uk/2016/

# URL where map will be found after deployment:
DEPLOYED_MAP_URL := https://maps.solidarityeconomy.coop/$(SERVER_APP_SUBDIR)

# JSON file for this configuration, to be loaded into the running map-app:
SRC_CONFIG_JSON := variants/$(variant)/config.json

# Directory for config files to be used for this variant of the map:
SRC_CONFIG_DIR := variants/$(variant)/

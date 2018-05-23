
# Server to deploy to:
SERVER := ise-0-admin

# Base deployment directory on server (must pre-exist):
SERVER_BASE_DIR := /var/www/html/

# Directory under SERVER_DIR to deploy to (will be created during deployment):
SERVER_APP_SUBDIR := maps/$(variant)/

# JSON file for this configuration, to be loaded into the running map-app:
SRC_CONFIG_JSON := variants/$(variant)/config.json

.PHONY: lint build

SRC_DIR := www/
BUILT_DIR := www-built/

APP_DIR := $(SRC_DIR)app/
JS_FILES := $(SRC_DIR)app.js $(shell find $(APP_DIR) -name '*.js')

# The command to remove json files is a workaround for the following problem:
# When r.js creates the build dir, it combines json files into app.js, BUT also makes copies of the original json files.
build:
	node r.js -o build.js
	find $(BUILT_DIR) -name '*.json' -exec rm {} \;	# WORKAROUND
	find $(BUILT_DIR) -name '*.swp' -exec rm {} \;	# Delete files left behind by VIM

lint:
	eslint $(JS_FILES)

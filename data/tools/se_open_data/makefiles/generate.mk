# Generates Linked Data from CSV

# Where to include standard makefile fragments from:
# (MUST define this before including any other makefile fragments!)
# This will define the inc directory within the directory in which this makefile exists.
MAKEFILE_INC_DIR := $(dir $(lastword $(MAKEFILE_LIST)))inc/

.PHONY: all css
.DEFAULT_GOAL := all

# Include from the current working dir (not usually where *this* makefile exists!)
include common.mk

$(info $(MAKEFILE_INC_DIR))
include $(MAKEFILE_INC_DIR)gnu_make_std.mk
include $(MAKEFILE_INC_DIR)var_check.mk
include $(MAKEFILE_INC_DIR)load_edition.mk
include $(MAKEFILE_INC_DIR)files.mk
include $(MAKEFILE_INC_DIR)uris.mk

$(eval $(call var_check,STANDARD_CSV,CSV file containing initiatives to be converted to RDF))
$(eval $(call var_check,CSS_SRC_DIR,Directory containing CSS files (to be deployed)))

CSV_TO_RDF := $(SE_OPEN_DATA_BIN_DIR)csv/standard/csv-to-rdf.rb

# Programs used within this makefile:
RUBY := ruby

css: | $(GEN_CSS_DIR)
	cp -r $(CSS_SRC_DIR) $(GEN_CSS_DIR)

all: $(STANDARD_CSV) css | $(GEN_DOC_DIR) $(GEN_VIRTUOSO_DIR) $(GEN_SPARQL_DIR)
	echo "$(SPARQL_ENDPOINT)" > $(MAP_APP_ENDPOINT_FILE)
	echo "$(GRAPH_NAME)" > $(MAP_APP_GRAPH_FILE)
	$(RUBY) -I $(SE_OPEN_DATA_LIB_DIR) $(CSV_TO_RDF) \
	  --output-directory $(GEN_DOC_DIR) \
	  --uri-prefix $(DATASET_URI_BASE) \
	  --essglobal-uri $(ESSGLOBAL_URI) \
	  --one-big-file-basename $(ONE_BIG_FILE_BASENAME) \
	  --map-app-sparql-query-filename $(MAP_APP_SPARQL_FILE) \
	  --css-files '$(subst $(space),$(comma),$(DEPLOYED_CSS_FILES))' \
	  $<



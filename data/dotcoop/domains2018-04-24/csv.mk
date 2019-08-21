# This makefile is for turning Coops UK 2017 OpenData CSV into the standard format expected by se_open_data.
#
# Standard GNU make trick - see http://stackoverflow.com/a/7531247/685715
nullstring :=
space := $(nullstring) # end of the line

include common.mk
possible_editions := $(basename $(notdir $(wildcard $(EDITIONS_DIR)*.mk)))

ifndef edition
$(info )
$(info ERROR: The make command must set the edition of data to be generated using:)
$(info $(space)    make edition=<name>)
$(info This will cause the file <name>.mk to be included from the directory '$(EDITIONS_DIR)'.)
$(info Looking at .mk files in '$(EDITIONS_DIR)', possible values for <name> are:)
$(info $(space)    $(possible_editions))
$(error Stopping due to error.)
endif


# To configure a specific version - put variable definitions in the edition makefile fragment: 
include $(EDITIONS_DIR)$(edition).mk

CSV_target := csv
.PHONY: $(CSV_target)
.DEFAULT_GOAL := $(CSV_target)

# Source files:
CLEAN_UK_CSV := $(SRC_CSV_DIR)2019-04-12-original.csv

# Here's the directory where we generate intermediate csv files
GEN_CSV_DIR := $(TOP_OUTPUT_DIR)csv/

# This makefile controls a pipeline of processes that convert the original
# Coops UK data into the se_open_data standard, one step at a time.

# Intermediat
STD_CLEAN_UK_CSV := $(GEN_CSV_DIR)outlets.csv
STD_ORGS_CSV := $(GEN_CSV_DIR)organisations.csv
STD_MERGED_CSV := $(GEN_CSV_DIR)merged.csv
STD_FIXED_DUPS_CSV := $(GEN_CSV_DIR)fixed-dups.csv
STD_DE_DUPED_CSV := $(GEN_CSV_DIR)de-duplicated.csv
STD_DUPS_CSV := $(GEN_CSV_DIR)ignored-duplicates.csv
STD_URI_NAME_POSTCODE_CSV := $(GEN_CSV_DIR)uri-name-postcode.csv


# Some local scripts to help with the conversion:
CLEAN_UK_CONVERTER := converter.rb

# Scripts to be used in the pipeline:
# CSV_DUP_FIXER := $(SE_OPEN_DATA_BIN_DIR)csv/standard/fix-duplicates.rb
# CSV_DE_DUPER := $(SE_OPEN_DATA_BIN_DIR)csv/standard/remove-duplicates.rb
# CSV_MERGE_AND_DE_DUPE := $(SE_OPEN_DATA_BIN_DIR)csv/standard/merge-domains-and-remove-duplicates.rb
CSV_POSTCODEUNIT_ADDER := $(SE_OPEN_DATA_BIN_DIR)csv/standard/add-postcode-lat-long.rb
URI_NAME_POSTCODE_RUBY := $(SE_OPEN_DATA_BIN_DIR)csv/standard/make-uri-name-postcode.rb

# The CSV_POSTCODEUNIT_ADDER script will convert postcodes into lat/long by 
# getting linked data over the web. This is (currently) a slow process (plenty of room for speed ups!)
# The POSTCODE_LAT_LNG_CACHE is a file for cacheing the results of these slow lookups.
POSTCODE_LAT_LNG_CACHE := postcode_lat_lng.json

RUBY := ruby -I $(SE_OPEN_DATA_LIB_DIR) 

####################
# The pipeline for processing CSV files for Coops UK:

# Convert Coops UK outlets csv to the standard csv:
$(STD_CLEAN_UK_CSV) : $(CLEAN_UK_CSV) $(CLEAN_UK_CONVERTER) | $(GEN_CSV_DIR)
	$(RUBY) $(CLEAN_UK_CONVERTER) $< > $@

# Where duplicate id values are found, add a number in order to de-duplicate them:
# $(STD_FIXED_DUPS_CSV) : $(STD_CLEAN_UK_CSV)  | $(GEN_CSV_DIR)
# 	$(RUBY) $(CSV_DUP_FIXER) $(STD_CLEAN_UK_CSV) > $@

# Remove any remaining rows with duplicate id values (there should be none, due to the above):
# $(STD_DE_DUPED_CSV) : $(STD_FIXED_DUPS_CSV)  | $(GEN_CSV_DIR)
# 	$(RUBY) $(CSV_DE_DUPER) $(STD_FIXED_DUPS_CSV) > $@ 2> $(STD_DUPS_CSV)
# 	@echo "Ignored duplicates have been written to $(STD_DUPS_CSV)"
# 	@echo Total ignored: `wc -l $(STD_DUPS_CSV)`

# Look for duplicate id values and move their domains into the first occurence.
# $(STD_DE_DUPED_CSV) : $(STD_CLEAN_UK_CSV)  | $(GEN_CSV_DIR)
# 	$(RUBY) $(CSV_MERGE_AND_DE_DUPE) $(STD_CLEAN_UK_CSV) > $@ 2> $(STD_DUPS_CSV)
# 	@echo "Ignored duplicates have been written to $(STD_DUPS_CSV)"
# 	@echo Total ignored: `wc -l $(STD_DUPS_CSV)`

# Populate the container lat/long fields, where the postcodeunit is the container:
# $(STANDARD_CSV) : $(STD_DE_DUPED_CSV) | $(GEN_CSV_DIR)
$(STANDARD_CSV) : $(STD_CLEAN_UK_CSV) | $(GEN_CSV_DIR)
	$(RUBY) $(CSV_POSTCODEUNIT_ADDER) --postcodeunit-cache $(POSTCODE_LAT_LNG_CACHE) $< > $@

# Create a CSV file from the STANDARD one with just a few columns: URI, Name and Normalized postcode
$(STD_URI_NAME_POSTCODE_CSV): $(STANDARD_CSV) | $(GEN_CSV_DIR)
	$(RUBY) $(URI_NAME_POSTCODE_RUBY) --uri-prefix $(URI_SCHEME)://$(URI_HOST)/$(URI_PATH_PREFIX) $< > $@

####################
# Directories

$(GEN_CSV_DIR):
	$(check_valid_edition)
	mkdir -p $@

$(CSV_target): $(STD_URI_NAME_POSTCODE_CSV) | $(GEN_CSV_DIR)


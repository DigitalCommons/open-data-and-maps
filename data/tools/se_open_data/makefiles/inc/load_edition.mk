# Include this makefile fragment when the make variable 'edition' is expected on the
# command line, and it is used in order to include an edition-specific makefile fragment
# (e.g. for variable definitions that are specific to that edition)

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
ifdef edition
include $(EDITIONS_DIR)$(edition).mk
endif


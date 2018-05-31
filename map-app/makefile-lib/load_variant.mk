# Include this makefile fragment when the make variable 'variant' is expected on the
# command line, and it is used in order to include a variant-specific makefile fragment
# (e.g. for variable definitions that are specific to that variant)

VARIANTS_DIR ?= variants/
possible_variants := $(basename $(notdir $(wildcard $(VARIANTS_DIR)*.mk)))

ifndef variant
$(info )
$(info ERROR: The make command must set the variant using:)
$(info $(space)    make variant=<name>)
$(info This will cause the file <name>.mk to be included from the directory '$(VARIANTS_DIR)'.)
$(info Looking at .mk files in '$(VARIANTS_DIR)', possible values for <name> are:)
$(info )
$(info $(space)    $(possible_variants))
$(info )
$(error Stopping due to error.)
endif

# To configure a specific version - put variable definitions in the variant makefile fragment: 
ifdef variant
include $(VARIANTS_DIR)$(variant).mk
endif


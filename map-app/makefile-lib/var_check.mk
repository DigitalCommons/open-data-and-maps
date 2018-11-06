# Function to check that a make variable is defined.
#
# var_check would typically be called like this:
# $(eval $(call var_check,VAR_NAME,Description of variable))
#
# (This double-$ signs are down to the eval. See https://www.gnu.org/software/make/manual/html_node/Eval-Function.html)

define var_check
ifndef $(1)
$$(info Variable not defined: $(1) - $(2))
$$(error Fatal error - check that you have set variant=<x> on the command line, and that the file variants/<x>.mk defines $(1))
endif
endef

define var_check_warning
ifndef $(1)
$$(info Variable not defined: $(1) - $(2))
$$(warning $(3))
endif
endef

define var_obsolete
ifdef $(1)
$$(warning Variable is defined: $(1) This variable is now OBSOLETE - best to remove it from your makefile)
endif
endef


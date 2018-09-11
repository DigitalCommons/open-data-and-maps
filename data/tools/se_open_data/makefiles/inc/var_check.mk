# Function to check that a make variable is defined.
#
# var_check would typically be called like this:
# $(eval $(call var_check,VAR_NAME,Description of variable))
#
# (This double-$ signs are down to the eval. See https://www.gnu.org/software/make/manual/html_node/Eval-Function.html)

define var_check
ifndef $(1)
$$(info Variable not defined: $(1) - $(2))
$$(error Fatal error - check that you have set edition=<x> on the command line, and that the file <x>.mk defines $(1))
endif
endef

define var_check_warning
ifndef $(1)
$$(info Variable not defined: $(1) - $(2))
$$(warning Warning - To fix it, check that you have set edition=<x> on the command line, and that the file <x>.mk defines $(1))
endif
endef


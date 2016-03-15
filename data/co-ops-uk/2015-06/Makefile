# Hint: type 'make' to get the usage message.

# Variables to be overridden from the command line:
#
# The value of SERVER would often be the name of a host set up in an ssh config file. 
# See http://nerderati.com/2011/03/17/simplify-your-life-with-an-ssh-config-file/
SERVER ?= parecco
SERVER_DIR ?= public_html/subdomains/solidarityeconomics.org/data/
DATA_SERVER_URL ?= http://data.solidarityeconomics.org
TEST_ID ?= id/sse/ise 

# Programs used within this makefile:
SCP := scp
RUBY := ruby
# TODO - use rsync for transferring files to server. 
# N.B. http://unix.stackexchange.com/questions/94421/how-to-use-ssh-config-setting-for-each-server-by-rsync

# Source files:
COOPS_UK_CSV := Cooperative_Economy_Open_Dataset_2015_06.csv


# Misc:
TIMESTAMP =  $(shell date +%Y-%m-%dT%H.%M.%S)

.PHONY: help generate-data
.DEFAULT_GOAL: help

help:
	@echo USAGE
	@echo -----
	@echo "make generate-data"
	@echo 

generate-data:
	echo foo

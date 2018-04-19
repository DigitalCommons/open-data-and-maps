# Definitions in common.mk can be overridden here

###########################################
# Where are the initial CSV files located?
SRC_CSV_DIR := co-ops-uk-csv-test-data/

###########################################
# Components of the URIs used in this dataset:
# Generated URIs will datrt with: $(URI_SCHEME)://$(URI_HOST)/$(URI_PATH_PREFIX)
URI_SCHEME := https
URI_HOST := w3id.solidarityeconomy.coop
URI_PATH_PREFIX := coops-uk/test2017/

###########################################
# To where are the Linked Data to be deployed?
# Note that content negotiation needs to be set up so that HTTP requests made to URIs (configured above)
# can be dereferenced to the deployed RDF and HTML files (configured below).
# The value of DEPLOYMENT_SERVER should be the name of a host set up in an ssh config file. 
#     (See http://nerderati.com/2011/03/17/simplify-your-life-with-an-ssh-config-file/)
DEPLOYMENT_SERVER ?= ise-0-matt

# The directory on the deployment server where the RDF and HTML is to be deployed:
DEPLOYMENT_WEBROOT := /var/www/html/data1.solidarityeconomy.coop/

# Flags used with the rsync command:
# We don't want to delete existing files on the server when we're testing:
DEPLOYMENT_RSYNC_FLAGS :=

###########################################
# Set up the triplestore:
#
# virtuoso server name, typically this is configured in ~/.ssh/config:
VIRTUOSO_SERVER := ise-0-admin
# Directory on virtuoso server which has been configured (DirsAllowed in virtuoso.ini)
# ready for Bulk data loading:
VIRTUOSO_ROOT_DATA_DIR := /home/admin/Virtuoso/BulkLoading/Data/
SPARQL_ENDPOINT := http://store1.solidarityeconomy.coop:8890/sparql

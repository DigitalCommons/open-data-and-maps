
ESSGLOBAL_URI := http://purl.org/solidarityeconomics/experimental/essglobal/

DATASET_URI_BASE := $(URI_SCHEME)://$(URI_HOST)/$(URI_PATH_PREFIX)

# Datasets on the Virtuoso server are put into a named graph:
GRAPH_NAME := $(DATASET_URI_BASE)

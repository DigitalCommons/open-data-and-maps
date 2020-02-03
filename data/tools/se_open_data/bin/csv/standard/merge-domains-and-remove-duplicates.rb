# Merges domains in rows of CSV that contain identical IDs.
# A duplicate is defined as having the same keys as a previous row.

# $LOAD_PATH.unshift '/Volumes/Extra/SEA-dev/open-data-and-maps/data/tools/se_open_data/lib'
require 'se_open_data'

keys = SeOpenData::CSV::Standard::V1::UniqueKeys.map {|sym| SeOpenData::CSV::Standard::V1::Headers[sym] }
domainHeader = SeOpenData::CSV::Standard::V1::Headers[:homepage]
nameHeader = SeOpenData::CSV::Standard::V1::Headers[:name]

# For production

SeOpenData::CSV.merge_and_de_duplicate(ARGF.read, $stdout, $stderr, keys, domainHeader, nameHeader)

# For debugging 

# input = File.open("/Volumes/Extra/SEA-dev/open-data-and-maps/data/dotcoop/domains2018-04-24/generated-data/experimental-new-server/csv/outlets.csv", "r:utf-8")
# inputContent = input.read;
# input.close
# $stdout.reopen("/Volumes/Extra/SEA-dev/open-data-and-maps/data/dotcoop/domains2018-04-24/generated-data/experimental-new-server/csv/de-duplicated.csv", "w")
# $stderr.reopen("/Volumes/Extra/SEA-dev/open-data-and-maps/data/dotcoop/domains2018-04-24/generated-data/experimental-new-server/csv/ignored-duplicates.csv", "w")
# $stdout.sync = true
# $stderr.sync = true
# SeOpenData::CSV.merge_and_de_duplicate(inputContent, $stdout, $stderr, keys, domainHeader, nameHeader)

# De-duplicates rows of CSV.
# A duplicate is defined as having the same keys as a previous row.

require 'se_open_data'

Keys = SeOpenData::CSV::Standard::V1::UniqueKeys.map {|sym| SeOpenData::CSV::Standard::V1::Headers[sym] }
SeOpenData::CSV.de_duplicator(ARGF.read, $stdout, $stderr, Keys)

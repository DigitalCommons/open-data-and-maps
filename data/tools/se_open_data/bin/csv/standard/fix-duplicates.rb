# Duplicate ids will be re-written in the output.
# No duplicate ids should exist in the output.

require 'se_open_data'

Keys = SeOpenData::CSV::Standard::V1::UniqueKeys.map {|sym| SeOpenData::CSV::Standard::V1::Headers[sym] }
raise "Expected exactly one ID column - found #{Keys.size}" unless Keys.size == 1
id_column = Keys.first

fixer_method = lambda {|id, n|
  # Return a new id for the nth duplicate of id found
  # by appending "/n" top the id
  "#{id}/#{n}"
}
SeOpenData::CSV.fix_duplicates(ARGF.read, $stdout, id_column, fixer_method)

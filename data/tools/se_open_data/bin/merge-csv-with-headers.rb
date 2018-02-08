#  Merge a list of CSV files into one.
#  All are assumed to have a header row.
#  It is an error for their header rows not to be identical.

require 'se_open_data'

SeOpenData::CSV.merge_csv_with_headers(ARGV, $stdout)

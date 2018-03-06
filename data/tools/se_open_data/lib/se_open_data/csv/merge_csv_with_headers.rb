#  Merge a list of CSV files into one.
#  All are assumed to have a header row.
#  It is an error for their header rows not to be identical.

require 'csv'

module SeOpenData
  module CSV
    def CSV.merge_csv_with_headers(filenames, output_io)
      csv_out = ::CSV.new(output_io)
      headers = nil
      filenames.each {|filename|
	arr_of_arrs = ::CSV.read(filename)
	
	if headers
	  hs = arr_of_arrs.shift
	  raise("\"#{filename}\" has different headers to previous files. Expected these to be the same:
		#{headers}
		#{hs}") unless headers == hs
	else
	  headers = arr_of_arrs.shift
	  csv_out << headers
	end

	arr_of_arrs.each {|row| csv_out << row}
      }
    end
  end
end

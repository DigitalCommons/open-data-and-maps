# De-duplicates rows of CSV.
# A duplicate is defined as having the same keys as a previous row.

require 'csv'

module SeOpenData
  module CSV
    def CSV.de_duplicator(
      input_io,         # Input CSV (must have headers)
      output_io,        # CSV with duplicates removed
      error_io,         # CSV containing duplicates (no headers)
      keys              # Array of column headings that make up the unique key
    )
      csv_opts = {}
      csv_opts.merge!(headers: true)
      csv_in = ::CSV.new(input_io, csv_opts)
      csv_out = ::CSV.new(output_io)
      csv_err = ::CSV.new(error_io)
      used_keys = {}
      headers = nil
      csv_in.each do |row|
        unless headers
          headers = row.headers
          csv_out << headers
        end
        key = keys.map {|k| row[k]}
        if used_keys.has_key? key
          csv_err << row
        else
          csv_out << row
          used_keys[key] = true
        end
      end
    end
  end
end

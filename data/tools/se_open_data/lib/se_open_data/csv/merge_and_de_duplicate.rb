# Merge domains and de-duplicate rows of CSV.
# A duplicate is defined as having the same keys as a previous row.

require 'csv'

module SeOpenData
  module CSV
    def CSV.merge_and_de_duplicate(
      input_io,         # Input CSV (must have headers)
      output_io,        # CSV with duplicates removed
      error_io,         # CSV containing duplicates (no headers)
      keys,             # Array of column headings that make up the unique key
      domainHeader,     # Array of column heading for the domain
      nameHeader        # Array of column heading for the name
    )
      csv_opts = {}
      csv_opts.merge!(headers: true)
      csv_in = ::CSV.new(input_io, csv_opts)
      csv_out = ::CSV.new(output_io)
      csv_err = ::CSV.new(error_io)
      used_keys = {}
      csv_map = {}
      headers = nil
      headersOutput = false

      # Since we can't be certain that the id will run lexicographically we need 
      # to loop through the original data once and build a hashmap of the csv
      # with multiple domains moved into a single field.
      csv_in.each do |row|
        unless headers
          headers = row.headers
        end
        key = keys.map {|k| row[k]}
        # If the key is already being used, add the domain to the existing domain.
        if csv_map.has_key? key
          domain = row.field(domainHeader)
          existingDomain = csv_map[key][domainHeader]
          if !domain.include?(existingDomain)
            csv_map[key][domainHeader] += "," + domain
          end
          # csv_err << row
        else
          # csv_out << row
          csv_map[key] = row.to_h
        end
      end

      csv_map.each do |key, row|
        unless headersOutput
          csv_out << headers
          headersOutput = true
        end
        
        # Fix any entries that have no name
        if !row[nameHeader]
          row[nameHeader] = "N/A"
        end
        csv_out << row.values
      end
    end
  end
end
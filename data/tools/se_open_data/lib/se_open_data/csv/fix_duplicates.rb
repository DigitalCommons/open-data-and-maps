# De-duplicates rows of CSV.
# A duplicate is defined as having the same keys as a previous row.

require 'csv'

module SeOpenData
  module CSV
    def CSV.fix_duplicates(
      input_io,         # Input CSV (must have headers)
      output_io,        # CSV with duplicates removed
      id_column_heading,
      new_id            # proc to call to get new id to replace duplicate id
    )
      csv_opts = {}
      csv_opts.merge!(headers: true)

      # Keep an array of all rows with the same id:
      id_to_rows = Hash.new {|h, k| h[k] = []}
      headers = nil

      csv_in = ::CSV.new(input_io, csv_opts)
      csv_in.each do |row|
        unless headers
          headers = row.headers
        end
        id_to_rows[row[id_column_heading]] << row
      end

      csv_out = ::CSV.new(output_io)
      csv_out << headers
      id_to_rows.each {|id, rows|
        if rows.size == 1
          csv_out << rows[0]
        else
          rows.each_with_index {|row, i|
            row[id_column_heading] = new_id.call(row[id_column_heading], i+1)
            csv_out << row
          }
        end
      }
    end
  end
end

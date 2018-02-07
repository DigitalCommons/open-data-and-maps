#  SeOpenData::CSV.convert converts a CSV into a new CSV with diffent columns

require 'pp'
require 'csv'

module SeOpenData
  module CSV
    def CSV.convert(output_io, output_headers, input_io, csv_row_reader, csv_opts)
      # The way this works is based on having column headings:
      csv_opts.merge!(headers: true)
      csv_in = ::CSV.new(input_io, csv_opts)
      csv_out = ::CSV.new(output_io)
      csv_out << output_headers.values
      csv_in.each do |row|
	begin
	  # Change encoding! This is a workaround for a problem that emerged when processing the orgs_csv file.
	  #row.headers.each {|h| row[h].encode!(Encoding::ASCII_8BIT) unless row[h].nil? }
	  # Why does it not work with UTF-8?  UPDATE - seems to work with UTF-8 for 2017 data.
	  row.headers.each {|h| row[h].encode!(Encoding::UTF_8) unless row[h].nil? }
	  r = csv_row_reader.new(row)
	  csv_out << output_headers.keys.map {|h| r.send(h) }
	rescue StandardError => e # includes ArgumentError, RuntimeError, and many others.
	  warning(["Could not create Initiative from CSV: #{e.message}", "The following row from the CSV data will be ignored:", row.to_s])
	  raise
	end
      end
    end
    def warning(msgs)
      msgs = msgs.kind_of?(Array) ? msgs : [msgs]
      $stderr.puts msgs.map{|m| "\nWARNING! #{m}"}.join 
    end
  end
end

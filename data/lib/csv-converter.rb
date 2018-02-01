
require 'pp'
require 'csv'

module SeOpenData
  class CsvConverter
    HeaderText = {
      id: "Identifier",
      name: "Name",
      postcode: "Postcode",
      homepage: "Website",
      companies_house_number: "Companies House Number"
    }
    StandardHeadersV1 = [:id, :name, :postcode, :homepage, :companies_house_number]
    def initialize(argv, output_headers)
      @output_headers = output_headers
    end
    def convert(csv_row_reader, csv_opts)
      # The way this works is based on having column headings:
      csv_opts.merge!(headers: true)
      csv = CSV.new(ARGF.read, csv_opts)
      csv.each do |row|
	begin
	  # Change encoding! This is a workaround for a problem that emerged when processing the orgs_csv file.
	  #row.headers.each {|h| row[h].encode!(Encoding::ASCII_8BIT) unless row[h].nil? }
	  # Why does it not work with UTF-8? 
	  row.headers.each {|h| row[h].encode!(Encoding::UTF_8) unless row[h].nil? }
	  r = csv_row_reader.new(row)
	  initiative = Hash[@output_headers.map {|h| [h, r.send(h)] }]
	  pp initiative
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
  class CsvRowReader
    attr_reader :row, :headers
    def initialize(row, headers)
      @row, @headers = row, headers
    end
    def postcode_normalized
      postcode.upcase.gsub(/\s+/, "")
    end
    def method_missing(method, *args, &block)
      @headers.keys.include?(method) ?  @row[@headers[method]] : ""
    end
  end
end

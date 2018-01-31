
require 'pp'
require 'optparse'
require 'ostruct'
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
    # Command line option parser based on https://docs.ruby-lang.org/en/2.1.0/OptionParser.html
    class OptParse
      #
      # Return a structure describing the options.
      #
      def self.parse(args)
	# The options specified on the command line will be collected in *options*.
	# We set default values here.
	options = OpenStruct.new
	options.max_csv_rows = nil

	opt_parser = OptionParser.new do |opts|
	  opts.banner = "Usage: #{$0} [options] < infile.csv > outfile.csv"

	  opts.separator ""
	  opts.separator "Specific options:"

	  opts.on("--max-csv-rows [ROWS]", Integer,
		  "Maximum number of rows of CSV to process from each input file, for testing") do |rows|
	    options.max_csv_rows = rows
	  end

	  opts.separator ""
	  opts.separator "Common options:"

	  # Boolean switch.
	  opts.on("-v", "--[no-]verbose", "Run verbosely") do |v|
	    options.verbose = v
	  end

	  # No argument, shows at tail.  This will print an options summary.
	  # Try it and see!
	  opts.on_tail("-h", "--help", "Show this message") do
	    puts opts
	    exit
	  end

	  # Another typical switch to print the version.
	  #opts.on_tail("--version", "Show version") do
	  #puts ::Version.join('.')
	  #exit
	  #end
	end

	opt_parser.parse!(args)
	options
      end  # parse()
    end
    def initialize(argv, output_headers)
      @options = OptParse.parse(argv)
      @output_headers = output_headers
      @short_test_run = !!@options.max_csv_rows
      @test_rows = @options.max_csv_rows
    end
    def convert(csv_row_reader, csv_opts)
      # The way this works is based on having column headings:
      csv_opts.merge!(headers: true)
      rows_tested = 0;
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

	# For rapidly testing on subset:
	if @short_test_run
	  rows_tested += 1
	  break if rows_tested > @test_rows
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

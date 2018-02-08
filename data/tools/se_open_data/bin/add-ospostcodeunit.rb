# The output replicated the input, but adds the following extra columns:
#   OS Postcoide unit - enought to generate the URL e.g. http://data.ordnancesurvey.co.uk/id/postcodeunit/M600AG
#   postcode latitude and longitude
#
#   If there's no os postcode unit, the above columns will be empty

require 'pp'
require 'optparse'
require 'ostruct'

require 'se_open_data'
#$lib_dir = "../../../lib/p6/"
#require_relative $lib_dir + 'progress-counter'

module SeOpenData
  module CSV
    module OsPostcodeUnit
      class Adder
	NewHeaders = SeOpenData::CSV::Standard::OsPostcodeUnit::Headers
	def initialize(argv)
	  @options = OptParse.parse(argv)
	end
	def run(input_io, output_io)
	  csv_opts = {}
	  csv_opts.merge!(headers: true)
	  csv_in = ::CSV.new(input_io, csv_opts)
	  csv_out = ::CSV.new(output_io)
	  postcode_client = SeOpenData::RDF::OsPostcodeUnit::Client.new(@options.postcodeunit_cache)
	  headers = nil
	  row_count = csv_in.count
	  csv_in.rewind	# needed after the count
	  #prog_ctr = P6::ProgressCounter.new("Saving map-app data to #{map_app_json_file} ... ", collection.size)

	  csv_in.each do |row|
	    unless headers
	      headers = row.headers + NewHeaders.values
	      csv_out << headers
	    end
	    pcunit = postcode_client.get(row["Postcode"])
	    row << {
	      NewHeaders[:ospostcodeunit] => pcunit ? pcunit[:within] : nil,
	      NewHeaders[:latitude] => pcunit ? pcunit[:lat] : nil,
	      NewHeaders[:longitude] => pcunit ? pcunit[:lng] : nil
	    }
	    csv_out << row
	  end
	end
      end
      # Command line option parser based on https://docs.ruby-lang.org/en/2.1.0/OptionParser.html
      class OptParse
	#
	# Return a structure describing the options.
	#
	def self.parse(args)
	  # The options specified on the command line will be collected in *options*.
	  # We set default values here.
	  options = OpenStruct.new
	  options.postcodeunit_cache = nil

	  opt_parser = OptionParser.new do |opts|
	    opts.banner = "Usage: $0 [options]"

	    opts.separator ""
	    opts.separator "Specific options:"

	    # Mandatory argument.
	    opts.on("--postcodeunit-cache FILENAME",
		    "JSON file where OS postcode unit results are cached") do |filename|
	      options.postcodeunit_cache = filename
	    end

	    opts.separator ""
	    opts.separator "Common options:"

	    # No argument, shows at tail.  This will print an options summary.
	    # Try it and see!
	    opts.on_tail("-h", "--help", "Show this message") do
	      puts opts
	      exit
	    end
	  end

	  opt_parser.parse!(args)
	  options
	end  # parse()
      end
    end
  end
end

adder = SeOpenData::CSV::OsPostcodeUnit::Adder.new(ARGV)
adder.run(ARGF.read, $stdout)

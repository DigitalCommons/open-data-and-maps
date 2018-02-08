#!/usr/bin/env ruby
#

require 'optparse'
require 'ostruct'
require 'se_open_data'

class OptParse
  #
  # Return a structure describing the options.
  #
  def self.parse(args)
    # The options specified on the command line will be collected in *options*.
    # We set default values here.
    options = OpenStruct.new
    options.postcodeunit_cache = nil
    # @todo Some of these could be provided with a command line interface to set them:
    options.new_headers = SeOpenData::CSV::Standard::OsPostcodeUnit::Headers
    options.input_headers = SeOpenData::CSV::Standard::V1::Headers

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

$options = OptParse.parse(ARGV)
SeOpenData::CSV.add_postcode_lat_long(
  ARGF.read,
  $stdout,
  $options.input_headers,
  $options.new_headers,
  $options.postcodeunit_cache
)
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
    options.uri_prefix = nil

    opt_parser = OptionParser.new do |opts|
      opts.banner = "Usage: $0 [options]"

      opts.separator ""
      opts.separator "Specific options:"

      # Mandatory argument.
      opts.on("--uri-prefix URI-PREFIX",
              "The prefix to insert ot the beginning of each identifier, to produce the URI in the output") do |urip|
        options.uri_prefix = urip
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

class CsvFilter < SeOpenData::CSV::RowReader
  OutputHeaders = {
    uri: "URI",
    name: "Name",
    postcode_normalized: "Postcode"
  }
  CsvHeaders = {
    id: "Identifier",
    name: "Name",
    postcode: "Postcode"
  }
  def initialize(row)
    super(row, CsvHeaders)
  end
  def uri
    $options.uri_prefix + id
  end
end

SeOpenData::CSV.convert(
  # Output:
  $stdout, CsvFilter::OutputHeaders,
  # Input:
  ARGF.read, CsvFilter, encoding: "ISO-8859-1"
)

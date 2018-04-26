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
    options.headers = nil

    opt_parser = OptionParser.new do |opts|
      opts.banner = "Usage: $0 [options]"

      opts.separator ""
      opts.separator "Specific options:"

      opts.on("--headers HEADERS", Array,
              "CSV file where the equlivalent URIs are stored") do |headers|
        options.headers = headers
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

#pp $options
SeOpenData::CSV.create_sameas_from_csv(
  ARGF.read,
  $stdout,
  $options.headers
)


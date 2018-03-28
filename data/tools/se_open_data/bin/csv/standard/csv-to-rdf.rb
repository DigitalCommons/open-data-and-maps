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
    options.outdir = nil
    options.uri_prefix = nil
    options.dataset = nil
    options.essglobal_uri = nil
    options.postcodeunit_cache = nil
    options.csv_standard = SeOpenData::CSV::Standard::V1

    opt_parser = OptionParser.new do |opts|
      opts.banner = "Usage: $0 [options]"

      opts.separator ""
      opts.separator "Specific options:"

      # Mandatory argument.
      opts.on("--output-directory DIR",
	      "Directory where RDF serializations are to be created") do |dir|
	options.outdir = dir
      end
      opts.on("--uri-prefix URI",
	      "A string which prefixes every initiative's URI") do |uri|
	options.uri_prefix = uri
      end
      opts.on("--dataset DATASET",
	      "The part of an initiative's URI that follows the uri-prefix (PROBABLY OBSOLETE)") do |ds|
	options.dataset = ds
      end
      opts.on("--essglobal-uri URI",
	      "Base URI for the essglobal vocabulary. e.g. http://purl.org/essglobal") do |uri|
        options.essglobal_uri = uri
      end
      opts.on("--postcodeunit-cache FILENAME",
	      "JSON file where OS postcode unit results are cached") do |filename|
	options.postcodeunit_cache = filename
      end
      opts.on("--csv-standard STANDARD",
	      "WARNING: STANDARD is currently hardcoded!") do |standard|
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
# Need some command line options...

$options = OptParse.parse(ARGV)
config = SeOpenData::Initiative::RDF::Config.new(
  $options.uri_prefix,
  $options.dataset,
  $options.essglobal_uri,
  $options.postcodeunit_cache,
  $options.csv_standard
)

# Load CSV into data structures, for this particular standard
collection = SeOpenData::Initiative::Collection.new(config)
collection.add_from_csv(ARGF.read)
collection.serialize_everything($options.outdir)

# Create RDF to list each initiative
# Create one big RDF with all triples in it

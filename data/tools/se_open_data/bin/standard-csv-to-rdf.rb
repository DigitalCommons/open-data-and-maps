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
	      "The part of an initiative's URI that follows the uri-prefix") do |ds|
	options.dataset = ds
      end
      opts.on("--essglobal-uri URI",
	      "Base URI for the essglobal vocabulary. e.g. http://purl.org/essglobal") do |uri|
        options.essglobal_uri = uri
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


# Load CSV into data structures, for this particular standard
Standard = SeOpenData::CSV::Standard::V1WithOsPostcodeUnit
collection = SeOpenData::Initiative::Collection.new
collection.add_from_csv(ARGF.read, Standard::Headers)
config = SeOpenData::Initiative::RDF::Config.new($options.uri_prefix, $options.dataset, $options.essglobal_uri)

# Create RDF for each initiative
collection.each {|initiative|
  rdf = SeOpenData::Initiative::RDF.new(initiative, config)
  rdf.save_rdfxml($options.outdir)
  rdf.save_turtle($options.outdir)

  #rdf.save_as
}


# Create RDF to list each initiative
# Create one big RDF with all triples in it

$LOAD_PATH.unshift '/Volumes/Extra/SEA-dev/open-data-and-maps/data/tools/se_open_data/lib'

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
    options.essglobal_uri = nil
    options.one_big_file_basename = nil
    options.map_app_sparql_query_filename = nil
    options.css_files = nil
    options.postcodeunit_cache = nil
    options.sameas_csv = nil
    options.sameas_headers = nil
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
      opts.on("--essglobal-uri URI",
              "Base URI for the essglobal vocabulary. e.g. http://purl.org/essglobal") do |uri|
        options.essglobal_uri = uri
      end
      opts.on("--one-big-file-basename BASENAME",
              "Filename (except .extension) for files with all generated data concatenated for loading into Virtuoso") do |basename|
        options.one_big_file_basename = basename
      end
      opts.on("--map-app-sparql-query-filename FILENAME",
              "Name of file where SPARQL query for map-app is to be written") do |filename|
        options.map_app_sparql_query_filename = filename
      end
      opts.on("--css-files FILENAMES",
              "Comma-spearted list of CSS files for linking from generated HTML") do |filenames|
        options.css_files = filenames.split(',')
      end
      opts.on("--postcodeunit-cache FILENAME",
              "JSON file where OS postcode unit results are cached") do |filename|
        options.postcodeunit_cache = filename
      end
      opts.on("--csv-standard STANDARD",
              "WARNING: STANDARD is currently hardcoded!") do |standard|
      end
      opts.on("--sameas-csv FILENAME",
              "Name of CSV file with OWL sameAs relations. If defined, --sameas-headers mus be defined too") do |filename|
        #$stderr.puts "--sameas-csv FILENAME: |#{filename}|"
        options.sameas_csv = filename.empty? ? nil : filename
      end
      opts.on("--sameas-headers HEADERS", Array,
              "CSV file where the equlivalent URIs are stored") do |headers|
        options.sameas_headers = headers
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
  $options.essglobal_uri,
  $options.one_big_file_basename,
  $options.map_app_sparql_query_filename,
  $options.css_files,
  $options.postcodeunit_cache,
  $options.csv_standard,
  $options.sameas_csv,
  $options.sameas_headers
)

# Load CSV into data structures, for this particular standard
collection = SeOpenData::Initiative::Collection.new(config)
ARGF.set_encoding(Encoding::UTF_8)
collection.add_from_csv(ARGF.read)
collection.serialize_everything($options.outdir)

# Create RDF to list each initiative
# Create one big RDF with all triples in it

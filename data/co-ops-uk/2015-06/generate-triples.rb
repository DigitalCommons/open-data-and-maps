require 'csv'
require 'linkeddata'
require 'rdf/vocab'

$input_csv, $output_dir, $uri_base  = $ARGV

class Initiative
  @@last_id = 0
  @@essglobal = RDF::Vocabulary.new("http://purl.org/essglobal/vocab/")
  def initialize(opts)
    # All expected params mus be listed in dflts, to enable error checking for unrecognized params:
    dflts = {"name" => "", "postal-code" => "", "country-name" => ""}
    @defn = dflts.merge(opts)
    @defn.each {|k, v| @defn[k] = dflts[k] if @defn[k].nil? }
    unless @defn.size == dflts.size	# i.e. nothing in opts not mentioned in dflts
      badopts = opts.keys
      raise ArgumentError, "Unrecognized: #{(opts.keys - dflts.keys).join(', ')}"
    end
    @@last_id += 1
    @id = @@last_id
  end
  def save_rdf(output_dir)
    filename = "#{output_dir}#{@id}.rdf"
    prefixes = {vcard: RDF::Vocab::VCARD.to_uri.to_s, essglobal: essglobal.to_uri.to_s, gr: RDF::Vocab::GR.to_uri.to_s}
    RDF::RDFXML::Writer.open(filename, prefixes: prefixes) {|writer| writer << make_graph }
  end
  private
  def essglobal
    @@essglobal
  end
  def uri
    "#{$uri_base}#{@id}"
  end
  def make_graph
    initiative = RDF::URI(uri)
    graph = RDF::Graph.new
    graph.insert([initiative , RDF.type, essglobal["SSEInitiative"]])
    graph.insert([initiative, RDF::Vocab::GR.name, @defn["name"]])
    graph.insert([initiative, essglobal.hasAddress, make_address(graph)])
  end
  def make_address(graph)
    addr = RDF::Node.new
    graph.insert([addr, RDF.type, essglobal["Address"]])
    graph.insert([addr, RDF::Vocab::VCARD["postal-code"], @defn["postal-code"]])
    graph.insert([addr, RDF::Vocab::VCARD["country-name"], @defn["country-name"]])
    return addr
  end
end

CSV.foreach($input_csv, :encoding => "ISO-8859-1", :headers => true) do |row|
  # There may be rows for previous years' accounts - we ignore these:
  if row["Is Most Recent"] == "1"
    initiative = Initiative.new(
      "name" => row["Organisation Name"],
      "postal-code" => row["Registered Postcode"],
      "country-name" => row["UK Nation"]
    )
    initiative.save_rdf($output_dir)
  end
end

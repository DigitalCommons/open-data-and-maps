require 'csv'
require 'linkeddata'
require 'rdf/vocab'

$input_csv, $output_dir, $uri_base  = $ARGV

def save_rdf(opts)
  filename = "#{opts[:dir] || $output_dir}#{opts[:basename]}.rdf"
  RDF::RDFXML::Writer.open(filename, prefixes: opts[:prefixes]) {|writer| writer << opts[:graph] }
end
def save_ttl(opts)
  filename = "#{opts[:dir] || $output_dir}#{opts[:basename]}.ttl"
  RDF::Turtle::Writer.open(filename, prefixes: opts[:prefixes]) {|writer| writer << opts[:graph] }
end

class Collection < Array	# of Initiatives
  def make_graph
    graph = RDF::Graph.new
    # TODO: should we be using parseType="Collection"?
    # https://www.w3.org/TR/rdf-syntax-grammar/#section-Syntax-parsetype-Collection
    # Not sure how to do that with RDF.rb.
    graph.insert([uri, RDF.type, collection_class])
    each {|i|	# each initiative in the collection
      graph.insert([uri, contains, i.uri])
    }
    return graph
  end
  def graph
    make_graph
  end
  def prefixes
    {}
  end
  def basename
    "collection"
  end
  private
  def collection_class
    RDF::URI("#{$uri_base}SSECollection")
  end
  def contains
    RDF::URI("#{$uri_base}contains")
  end
  def uri
    RDF::URI("#{$uri_base}#{basename}")
  end

end

class Initiative
  attr_reader :id
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
  def graph
    make_graph
  end
  def prefixes
    {vcard: RDF::Vocab::VCARD.to_uri.to_s, essglobal: essglobal.to_uri.to_s, gr: RDF::Vocab::GR.to_uri.to_s}
  end
  def basename	# for output files
    id
  end
  def uri
    RDF::URI("#{$uri_base}#{@id}")
  end
  private
  def essglobal
    @@essglobal
  end
  def make_graph
    graph = RDF::Graph.new
    graph.insert([uri, RDF.type, essglobal["SSEInitiative"]])
    graph.insert([uri, RDF::Vocab::GR.name, @defn["name"]])
    graph.insert([uri, essglobal.hasAddress, make_address(graph)])
    graph.insert([uri, essglobal.legalForm, RDF::URI("http://www.purl.org/essglobal/standard/legal-form/L2")])
    return graph
  end
  def make_address(graph)
    addr = RDF::Node.new
    graph.insert([addr, RDF.type, essglobal["Address"]])
    graph.insert([addr, RDF::Vocab::VCARD["postal-code"], @defn["postal-code"]])
    graph.insert([addr, RDF::Vocab::VCARD["country-name"], @defn["country-name"]])
    return addr
  end
end

collection = Collection.new
CSV.foreach($input_csv, :encoding => "ISO-8859-1", :headers => true) do |row|
  # There may be rows for previous years' accounts - we ignore these:
  if row["Is Most Recent"] == "1"
    initiative = Initiative.new(
      "name" => row["Organisation Name"],
      "postal-code" => row["Registered Postcode"],
      "country-name" => row["UK Nation"]
    )
    graph = initiative.graph
    save_rdf(:basename => initiative.basename, :prefixes => initiative.prefixes, :graph => graph);
    save_ttl(:basename => initiative.basename, :prefixes => initiative.prefixes, :graph => graph);
    #initiative.save_rdf($output_dir)
    #initiative.save_ttl($output_dir)
    collection << initiative
  end
end
graph = collection.graph
save_rdf(:basename => collection.basename, :prefixes => collection.prefixes, :graph => graph);
save_ttl(:basename => collection.basename, :prefixes => collection.prefixes, :graph => graph);
#collection.save_rdf($output_dir)

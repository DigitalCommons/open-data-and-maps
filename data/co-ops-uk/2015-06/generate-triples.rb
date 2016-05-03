require 'cgi'
require 'csv'
require 'linkeddata'
require 'rdf/vocab'

$input_csv, $output_dir, $uri_base, $dataset  = $ARGV
$essglobal = RDF::Vocabulary.new("http://purl.org/essglobal/vocab/")
$prefixes = {vcard: RDF::Vocab::VCARD.to_uri.to_s, essglobal: $essglobal.to_uri.to_s, gr: RDF::Vocab::GR.to_uri.to_s}

# Function for generating xml (used here for html).
def xml(ele, attr = {})
  "<#{ele}#{attr.keys.map{|k| " #{k}=\"#{attr[k]}\""}.join}>" + # Element opening tag with attributes.
    (block_given? ? yield : "") +	# Element contents.
    "</#{ele}>"	# Element closing tag.
end

def html_fragment_for_inserted_code(heading, filename)
  xml(:div) {
    xml(:h2) {
      heading
    } +
    xml(:pre) {
      CGI.escapeHTML(File.open(filename, "rb").read)
    }
  }
end

def save_rdf(opts)
  filename = "#{opts[:dir] || $output_dir}#{opts[:basename]}.rdf"
  RDF::RDFXML::Writer.open(filename, prefixes: opts[:prefixes]) {|writer| writer << opts[:graph] }
  filename
end
def save_ttl(opts)
  filename = "#{opts[:dir] || $output_dir}#{opts[:basename]}.ttl"
  RDF::Turtle::Writer.open(filename, prefixes: opts[:prefixes]) {|writer| writer << opts[:graph] }
  filename
end
def save_html(opts)
  filename = "#{opts[:dir] || $output_dir}#{opts[:basename]}.html"
  File.open(filename, "w") {|f|
    f.puts "<!DOCTYPE html>"
    f.puts opts[:html]
  }
  filename
end

class Collection < Array	# of Initiatives
  def make_graph
    graph = RDF::Graph.new
    # TODO: should we be using parseType="Collection"?
    # https://www.w3.org/TR/rdf-syntax-grammar/#section-Syntax-parsetype-Collection
    # Not sure how to do that with RDF.rb.
    # graph.insert([uri, RDF.type, collection_class])
    each {|i|	# each initiative in the collection
      graph.insert([i.uri, RDF.type, Initiative.type_uri])
    }
    return graph
  end
  def graph
    make_graph
  end
  def html
    xml(:html) {
      xml(:head) +
      xml(:body) {
	xml(:h1) { "Co-ops UK - experimental dataset" } +
	xml(:p) { "The URI for this list is: " + uri.to_s } +
	xml(:table) {
	  xml(:thead) {
	    xml(:tr) {
	      xml(:th) { "Co-op name" } + xml(:th) { "URI" }
	    }
	  } +
	  xml(:tbody) {
	    sort {|a, b| a.name <=> b.name}
	    .map {|i|
	      xml(:tr) {
		xml(:td) { i.name } + xml(:td) { 
		  xml(:a, :href => i.uri.to_s) { i.uri.to_s }
		}
	      }
	    }.join
	  }
	}
      }
    }
  end
  def html_fragment_for_link
    xml(:div) {
      xml(:p) {
	"The URI for the whole list is: " +
	xml(:a, :href => uri.to_s) { uri.to_s }
      }
    }
  end
  def basename
    $dataset
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
  attr_reader :id, :name
  @@last_id = 0
  def initialize(opts)
    # All expected params mus be listed in dflts, to enable error checking for unrecognized params:
    dflts = {"name" => "", "postal-code" => "", "country-name" => ""}
    @defn = dflts.merge(opts)
    @defn.each {|k, v| @defn[k] = dflts[k] if @defn[k].nil? }
    unless @defn.size == dflts.size	# i.e. nothing in opts not mentioned in dflts
      badopts = opts.keys
      raise ArgumentError, "Unrecognized: #{(opts.keys - dflts.keys).join(', ')}"
    end
    @name = @defn["name"]
    @@last_id += 1
    @id = @@last_id
  end
  def graph
    make_graph
  end
  def basename	# for output files
    "#{$dataset}/#{@id}"
  end
  def uri
    RDF::URI("#{$uri_base}#{basename}")
  end
  def html(rdf_filename, ttl_filename, collection_fragment)
    xml(:html) {
      xml(:head) +
      xml(:body) {
	xml(:h1) { @defn["name"] } +
	xml(:table) {
	  xml(:tr) {
	    xml(:td) { "URI" } + xml(:td) { uri.to_s }
	  } +
	  xml(:tr) {
	    xml(:td) { "Postcode" } + xml(:td) { @defn["postal-code"] }
	  } +
	  xml(:tr) {
	    xml(:td) { "Country" } + xml(:td) { @defn["country-name"] }
	  }
	} +
	collection_fragment +	# with link back to list of all.
	html_fragment_for_inserted_code("RDF document", rdf_filename) +
	html_fragment_for_inserted_code("Turtle document", ttl_filename)
      }
    }
  end
  def self.type_uri
    $essglobal["SSEInitiative"]
  end
  private
  def essglobal
    $essglobal
  end
  def make_graph
    graph = RDF::Graph.new
    graph.insert([uri, RDF.type, Initiative.type_uri])
    graph.insert([uri, RDF::Vocab::GR.name, @defn["name"]])
    graph.insert([uri, essglobal.hasAddress, make_address(graph)])
    # legal-form/L2 is a co-operative.
    # Is everything in the co-ops UK open dataset actually a co-operative?
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

# TODO: make some use of the Vocab class!
class Vocab
  @@vocabs = []
  attr_reader :pref, :vocab
  def initialize(vocab)
    @vocab = vocab
    @pref, @vocab = vocab[:pref], vocab[:vocab]
    @@vocabs << self
  end
  def self.prefixes(prefs)
    Hash[ *@@vocabs.select{ |x| prefs.include?(x.pref)}.map {|x| [x.pref, x.vocab.to_uri.to_s]}.flatten]
  end
end
vocabs = [ 
  {pref: :essglobal, vocab: RDF::Vocabulary.new("http://purl.org/essglobal/vocab/")},
  {pref: :vcard, vocab: RDF::Vocab::VCARD},
  {pref: :gr, vocab: RDF::Vocab::GR}
].map {|v| Vocab.new(v)}

puts Vocab.prefixes([:essglobal, :vcard])

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
    rdf_filename = save_rdf(:basename => initiative.basename, :prefixes => $prefixes, :graph => graph);
    ttl_filename = save_ttl(:basename => initiative.basename, :prefixes => $prefixes, :graph => graph);
    html_filename = save_html(:basename => initiative.basename, :html => initiative.html(rdf_filename, ttl_filename, collection.html_fragment_for_link));
    collection << initiative
    break if initiative.id > 10
  end
end
graph = collection.graph
rdf_filename = save_rdf(:basename => collection.basename, :prefixes => $prefixes, :graph => graph);
ttl_filename = save_ttl(:basename => collection.basename, :prefixes => $prefixes, :graph => graph);
html_filename = save_html(:basename => collection.basename, :html => collection.html);

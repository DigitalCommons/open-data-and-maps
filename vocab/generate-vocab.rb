require 'pp'
require 'cgi'
require 'csv'
require 'json'
require 'linkeddata'
require 'rdf/vocab'
require 'rdf'
$lib_dir = "../lib/p6/"
require_relative $lib_dir + 'xml'
require_relative $lib_dir + 'html'
require_relative $lib_dir + 'file'
require_relative $lib_dir + 'rdfxml'
require_relative $lib_dir + 'turtle'

$essglobal = RDF::Vocabulary.new("http://purl.org/essglobal/vocab/")
$solecon = RDF::Vocabulary.new("http://solidarityeconomics.org/vocab#")
$ospostcode = RDF::Vocabulary.new("http://data.ordnancesurvey.co.uk/id/postcodeunit/")
$prefixes = {
  #xsd: RDF::Vocab::XSD.to_uri.to_s,
  #rdfs: RDF::Vocab::RDFS.to_uri.to_s,
  #dcterms: RDF::Vocab::DC.to_uri.to_s,
  vcard: RDF::Vocab::VCARD.to_uri.to_s,
  essglobal: $essglobal.to_uri.to_s,
  solecon: $solecon.to_uri.to_s,
  gr: RDF::Vocab::GR.to_uri.to_s,
  foaf: RDF::Vocab::FOAF.to_uri.to_s,
  ospostcode: $ospostcode.to_uri.to_s
}

pp P6::Xml.xml('foo')
pp RDF::Vocab::RDFS.inspect
pp RDF::Vocab::DC.inspect
#P6::Html.save_file(html: RDF::Vocab::RDFS.to_html, filename: rdfs.html) 
class Vocab
  attr_reader :uri_base, :name, :prefixes
  def initialize(uri_base, name, prefixes)
    @uri_base = uri_base
    @name = name
    @prefixes = prefixes
  end
  def create_files(output_dir)
    graph = make_graph
    rdf_filename = P6::RdfXml.save_file(dir: output_dir, :basename => name, :prefixes => prefixes, :graph => graph)
    ttl_filename = P6::Turtle.save_file(dir: output_dir, :basename => name, :prefixes => prefixes, :graph => graph)
  end
  private
  def make_graph
    graph = RDF::Graph.new
    sse_initiative = uri("SSEInitiative")
    graph.insert([sse_initiative, RDF.type, RDF::RDFS.Class])
    graph.insert([sse_initiative, RDF::RDFS.subClassOf, $essglobal["SSEInitiative"]])
    graph.insert([sse_initiative, RDF::RDFS.label, RDF::Literal.new("Foo Bar", language: "en")])
    graph.insert([sse_initiative, RDF::RDFS.isDefinedBy, uri])
    graph.insert([sse_initiative, RDF::DC.issued, RDF::Literal::Date.new("2016-10-10")])
    graph.insert([sse_initiative, RDF::DC.modified, RDF::Literal::Date.new("2016-10-10")])
    graph.insert([sse_initiative, RDF::DC.description, RDF::Literal.new("Description of this ISE extension to ESSGLOBAL", language: "en")])
    return graph
  end
  def uri(object = "")
    RDF::URI("#{uri_base}#{name}/#{object}")
  end
end

# Command line args.
# Make sure these match the corresponding ones in the Makefile.
$output_dir, $uri_base, $doc_url_base, $vocab_name, $css_files  = $ARGV

vocab = Vocab.new($uri_base, $vocab_name, $prefixes)
vocab.create_files($output_dir)

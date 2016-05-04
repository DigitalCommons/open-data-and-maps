require 'pp'
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
    each {|i|	# each initiative in the collection
      graph.insert([i.uri, RDF.type, Initiative.type_uri])
    }
    return graph
  end
  def html
    xml(:html) {
      xml(:head) +
      xml(:body) {
	xml(:h1) { "Co-ops UK - experimental dataset" } +
	xml(:p) { "The URI for this list is: " + xml(:a, href: uri.to_s) {uri.to_s} } +
	xml(:p) { "See: " + xml(:a, href: Collection.about_uri.to_s) { " about this dataset"} + "." } +
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
  def about_html
    xml(:html) {
      xml(:head) +
      xml(:body) {
	xml(:h1) { "About this dataset"} +
	xml(:p) { "Base URI: " + xml(:a, href: uri.to_s) {uri.to_s} } +
	xml(:p) { 
	  "This is an experimental dataset, generated as part of the p6data project, which can be found " + 
	  xml(:a, href: "https://github.com/p6data-coop") { "on GitHub" } +
	  ". Its experimental nature means that"
	} +
	xml(:ul) {
	  xml(:li) { "No test has been used to check if the items in this dataset are part of the solidarity economy." } +
	  xml(:li) { "There's no guarantee that the URIs will be persistent. In fact it is most unlikely that they will be so." } +
	  xml(:li) { "The triples included in the linked data have been chosen for the purpose of testing." }
	}
      }
    }
  end
  def self.about_basename
    "#{basename}/about"
  end
  def self.about_uri
    RDF::URI("#{$uri_base}#{about_basename}")
  end

  def self.basename
    $dataset
  end
  def duplicate_ids
    ids = map{|i| i.id}
    ids.select{ |e| ids.count(e) > 1 }.uniq
  end
  def create_files
    dup_ids = duplicate_ids
    if dup_ids.size > 0
      $stderr.puts("WARNING! The dataset has the following duplicate ids:\nWARNING! " + dup_ids.join(", ") + "\nWARNING! Duplicates are being removed from the dataset. This may not be what you want!")
    end
    #remove elements with duplicate ids
    uniq!{|e| e.id}
    todo = size
    n = 0
    puts "Creating RDF, Turtle and HTML files for each initiative..."
    each {|i|
      n += 1
      $stdout.write "\r#{n} (#{100*n/todo}%)"
      graph = i.make_graph
      rdf_filename = save_rdf(:basename => i.basename, :prefixes => $prefixes, :graph => graph)
      ttl_filename = save_ttl(:basename => i.basename, :prefixes => $prefixes, :graph => graph)
      html_filename = save_html(:basename => i.basename, :html => i.html(rdf_filename, ttl_filename, html_fragment_for_link))
    }
    puts "\nCreating RDF, Turtle and HTML files for the collection of initiatives..."
    graph = make_graph
    rdf_filename = save_rdf(:basename => Collection.basename, :prefixes => $prefixes, :graph => graph)
    ttl_filename = save_ttl(:basename => Collection.basename, :prefixes => $prefixes, :graph => graph)
    html_filename = save_html(:basename => Collection.basename, :html => html)
    html_filename = save_html(:basename => Collection.about_basename, :html => about_html)
  end
  private
  def uri
    RDF::URI("#{$uri_base}#{Collection.basename}")
  end
  def html_fragment_for_link
    xml(:div) {
      xml(:p) {
	"The URI for the whole list is: " +
	xml(:a, :href => uri.to_s) { uri.to_s }
      }
    }
  end
end

class Initiative
  attr_reader :id, :name
  def initialize(opts)
    # All expected params must be listed in dflts, to enable error checking for unrecognized params:
    dflts = {"id" => "", "name" => "", "postal-code" => "", "country-name" => ""}
    @defn = dflts.merge(opts)
    @defn.each {|k, v| @defn[k] = dflts[k] if @defn[k].nil? }
    unless @defn.size == dflts.size	# i.e. unless nothing in opts not mentioned in dflts
      badopts = opts.keys
      raise ArgumentError, "Unrecognized: #{(opts.keys - dflts.keys).join(', ')}"
    end
    @name = @defn["name"]
    @id = @defn["id"]
    if @id.empty?
      raise "ERROR!   Id is empty. " + @defn.to_s
    end
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
	xml(:p) { "This dataset is experimental. See: " + xml(:a, href: Collection.about_uri.to_s) { " about this dataset"} + " for more information." } +
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
  private
  def essglobal
    $essglobal
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

#puts Vocab.prefixes([:essglobal, :vcard])

collection = Collection.new
puts "Reading #{$input_csv}..."
CSV.foreach($input_csv, :encoding => "ISO-8859-1", :headers => true) do |row|
  # There may be rows for previous years' accounts - we ignore these:
  if row["Is Most Recent"] == "1"
    begin
    initiative = Initiative.new(
      "name" => row["Organisation Name"],
      "postal-code" => row["Registered Postcode"],
      "country-name" => row["UK Nation"],
      "id" => row["Co-ops UK Identifier"]
    )
    collection << initiative
    rescue StandardError => e # includes ArgumentError, RuntimeError, and many others.
      $stderr.puts "WARNING! Could not create Initiative from CSV: e.message"
      $stderr.puts "WARNING! CSV data:"
      $stderr.puts "WARNING! " + row.to_s
    end

    # For rapidly testing on subset:
    #break if collection.size > 10
  end
end
collection.create_files

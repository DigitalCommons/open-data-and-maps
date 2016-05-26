# Update: June 2016:
# This file is for processing the Co-ops UK open dataset dated 2015-06.
# There is now a new dataset dated 2016-06, and this file has been cloned into the directory for processing that new dataset.
# Given that, with the avaiability of the new dataset, we don't need to work further on the 2015 dataset, 
# this file should be regarded as OBSOLETE.
# All ongoing work will be carried out on the 2016 (and later) datasets.
# If there turns out to be a requirement to continue to work on the 2015 dataset in parallel with the new dataset, 
# then the source code could be restructured to factor out the code that is common to both datasets.

require 'pp'
require 'cgi'
require 'csv'
require 'linkeddata'
require 'rdf/vocab'

$input_csv, $output_dir, $uri_base, $dataset, $css_files  = $ARGV
$css_files_array = $css_files.split.map{|f| $dataset + "/" + f}
$essglobal = RDF::Vocabulary.new("http://purl.org/essglobal/vocab/")
$solecon = RDF::Vocabulary.new("http://solidarityeconomics.org/vocab#")
$ospostcode = RDF::Vocabulary.new("http://data.ordnancesurvey.co.uk/id/postcodeunit/")
$prefixes = {
  vcard: RDF::Vocab::VCARD.to_uri.to_s,
  essglobal: $essglobal.to_uri.to_s,
  solecon: $solecon.to_uri.to_s,
  gr: RDF::Vocab::GR.to_uri.to_s,
  ospostcode: $ospostcode.to_uri.to_s
}

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
def warning(msgs)
  msgs = msgs.kind_of?(Array) ? msgs : [msgs]
  $stderr.puts msgs.map{|m| "\nWARNING! #{m}"}.join 
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
      xml(:head) {
	xml(:title) { "Co-ops UK experimental dataset" } +
	$css_files_array.map {|f|
	  xml(:link, rel: "stylesheet", type: "text/css", href: f)
	}.join
      } +
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
      xml(:head) {
	xml(:title) { "Co-ops UK experimental dataset" } +
	$css_files_array.map {|f|
	  xml(:link, rel: "stylesheet", type: "text/css", href: "../#{f}")
	}.join
      } +
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
      warning(["The dataset has the following duplicate ids:", dup_ids.join(", "), "Duplicates are being removed from the dataset. This may not be what you want!"])
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
    puts "\nCreating RDF, Turtle and HTML files for the collection as a whole..."
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
  # Map names used in this class to names of columns in the csv row
  @@field_map = {
      "name" => "Organisation Name",
      "postal-code" => "Registered Postcode",
      "country-name" => "UK Nation",
      "id" => "Co-ops UK Identifier"
  }
  def initialize(csv_row)
    @csv_row = csv_row
    # Populate the defn hash with keys from @@field_map and values from the corresponding column in the csv_row:
    # Note that empty columns are assigned the empty string, instead of nil
    @defn = Hash[ *@@field_map.keys.collect { |e| [e, csv_row[ @@field_map[e] ] || "" ] }.flatten ]
    @name = @defn["name"]
    @id = @defn["id"]
    if @id.empty?
      raise "Id is empty. " + @defn.to_s
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
      xml(:head) {
	xml(:title) { "Co-ops UK experimental dataset" } +
	$css_files_array.map {|f|
	  xml(:link, rel: "stylesheet", type: "text/css", href: "../#{f}")
	}.join
      } +
      xml(:body) {
	xml(:h1) { @defn["name"] } +
	xml(:p) { "This data is from an experimental dataset. See " + xml(:a, href: Collection.about_uri.to_s) { " about this dataset"} + " for more information." } +
	collection_fragment +	# with link back to list of all.
	xml(:h3) { "Contents" } +
	xml(:ul) {
	  xml(:li) { xml(:a, href: "#table") { @@heading[:table] } } +
	  xml(:li) { xml(:a, href: "#csv") { @@heading[:csv] } } +
	  xml(:li) { xml(:a, href: "#rdf") { @@heading[:rdf] } } +
	  xml(:li) { xml(:a, href: "#ttl") { @@heading[:ttl] } }
	} + 
	xml(:a, id: "table") + html_fragment_for_data_table +
	xml(:a, id: "csv") + html_fragment_for_csv_row +
	xml(:a, id: "rdf") + html_fragment_for_inserted_code(@@heading[:rdf], rdf_filename) +
	xml(:a, id: "ttl") + html_fragment_for_inserted_code(@@heading[:ttl], ttl_filename)
      }
    }
  end
  @@heading = {
    table: "Summary of generated linked data",
    csv: "Original CSV data",
    rdf: "RDF document",
    ttl: "Turtle document"
  }
  def html_fragment_for_data_table
    xml(:h2) { @@heading[:table] } +
    xml(:table) {
      xml(:tr) {
	xml(:td) { "Name" } + xml(:td) { @defn["name"] }
      } +
      xml(:tr) {
	xml(:td) { "URI (for RDF and HTML)" } + xml(:td) { xml(:a, href: uri.to_s) { uri.to_s } }
      } +
      xml(:tr) {
	xml(:td) { "Postcode" } + xml(:td) { @defn["postal-code"] }
      } +
      xml(:tr) {
	xml(:td) { "Country" } + xml(:td) { @defn["country-name"] }
      } +
      xml(:tr) {
	xml(:td) { "postcode URI" } + xml(:td) { 
	  begin
	    xml(:a, href: ospostcode_uri.to_uri.to_s) { ospostcode_uri.to_uri.to_s }
	  rescue
	    "none available"
	  end
	}
      }
    }
  end
  def html_fragment_for_csv_row
    xml(:h2) { @@heading[:csv] } +
    xml(:table) {
      @csv_row.headers.map {|h|
	v = @csv_row[h]
	hv = v.nil? ? "" : CGI.escapeHTML(v)
	xml(:tr) {
	  xml(:td) { CGI.escapeHTML(h) } + xml(:td) { hv } 
	}
      }.join
    }
  end
  def self.type_uri
    $essglobal["SSEInitiative"]
  end
  def ospostcode_uri
    # Return an ordnance survey postcode URI
    # TODO - raise an exception if there's not postcode URI for this postcode (e.g. Northern Irish ones??)
    postcode = @defn["postal-code"].gsub(/\s+/, "")
    raise "Empty postcode" if postcode.empty?
    $ospostcode[postcode]
  end
  def make_graph
    graph = RDF::Graph.new
    graph.insert([uri, RDF.type, Initiative.type_uri])
    graph.insert([uri, RDF::Vocab::GR.name, @defn["name"]])
    graph.insert([uri, essglobal.hasAddress, make_address(graph)])
    # legal-form/L2 is a co-operative.
    # Is everything in the co-ops UK open dataset actually a co-operative?
    graph.insert([uri, essglobal.legalForm, RDF::URI("http://www.purl.org/essglobal/standard/legal-form/L2")])

    begin
      postcode_uri = ospostcode_uri
      geolocation = RDF::Node.new	# Blank node, as we have no lat/long information.
      # The use of the solecon vocabulary is a temporary measure, until we figure out how to do this properly!
      # It may be that we should be looking at something along the lines of the examples (section 1.5)
      # presented at https://www.w3.org/2011/02/GeoSPARQL.pdf.
      graph.insert([geolocation, RDF.type, $solecon.GeoLocation])
      graph.insert([uri, $solecon.hasGeoLocation, geolocation])
      graph.insert([geolocation, $solecon.within, postcode_uri])
    rescue StandardError => e
      warning([e.message, @defn.to_s])
    end
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
#
# The design of this module "hopes" that everything above this line is about the generation
# of RDF, Turtle and HTML that is independent of the input dataset.
# So, when the dataset format changes next year, the changes will hopefully be restricted
# to what is below this line. New argument to the script may also be needed.

collection = Collection.new
puts "Reading #{$input_csv}..."
CSV.foreach($input_csv, :encoding => "ISO-8859-1", :headers => true) do |row|
  # There may be rows for previous years' accounts - we ignore these:
  if row["Is Most Recent"] == "1"
    begin
    initiative = Initiative.new(row)
    collection << initiative
    rescue StandardError => e # includes ArgumentError, RuntimeError, and many others.
      warning(["Could not create Initiative from CSV: #{e.message}", "The following row from the CSV data will be ignored:", row.to_s])
    end

    # For rapidly testing on subset:
    #break if collection.size > 10
  end
end
collection.create_files

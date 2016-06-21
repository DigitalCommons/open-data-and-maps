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
def save_html_file(html, filename)
  File.open(filename, "w") {|f|
    f.puts "<!DOCTYPE html>"
    f.puts html
  }
  filename
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
  save_html_file(opts[:html], filename)
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
  def to_hash
    # Create a hash that maps each id to an array of initiatives (an array, because of duplicate ids). 
    h = Hash.new { |h, k| h[k] = [] }
    each {|i| h[i.id] << i }
    h
  end
  def resolve_duplicates
    # Currently, this method does not resolve duplicates, but reports on them.
    # The HTML report produced by method duplicates_html may be a better choice than this.
    outlets_headers = ["CUK Organisation ID", "Registered Name", "Outlet Name", "Street", "City", "State/Province", "Postcode", "Description", "Phone", "Website"]
    h = to_hash
    dups = h.select {|k, v| v.count > 1}
    pp dups
    dups.each {|k, v| 
      common, different = outlets_headers.partition{|x|
	v.map { |i| i.csv_row[x] }.uniq.count == 1
      }
      puts common.map { |x| "#{x}: #{v[0].csv_row[x]}" }.join("; ")
      puts v.map { |i| "    #{different.map { |x| "#{x}: #{i.csv_row[x]}" }.join("; ")}\n"}.join

      if v.uniq.count == 1
	puts "Duplicate entries in source data:"
	pp v
      end
    }
  end
  def duplicates_html
    # Column headers from the Outlets CSV file:
    id_headers = ["CUK Organisation ID", "Postcode"]
    outlets_headers = ["Registered Name", "Outlet Name", "Street", "City", "State/Province", "Description", "Phone", "Website"]

    # hash ( id => Initiative ) of all Initiatives with duplicate ids:
    dups = to_hash.select {|k, v| v.count > 1}
    css = <<'ENDCSS'
td {vertical-align: top; }
td.common { background-color: #BFB; }
td.different { background-color: #FBB; } 
table {
    border-collapse: collapse;
}

table, th, td {
    border: 1px solid black;
}
td.first {
    border-top: 5px solid black;
}
ENDCSS
    xml(:html) {
      xml(:head) {
	xml(:title) { "Duplicates" }  +
	xml(:style) { css }
      } +
      xml(:body) {
	xml(:h1) { "Outlets with the same CUK ID and Postcode" } +
	xml(:p) {
	  "The table shows all outlets with the same CUK Organisation ID and Postcode.
	  The other cells are coloured green if all outlets with the same CUK ID and Postcode have the same value, 
	  and red if they are differnt values."
	} +
	xml(:p) {
	  "Green cells in the Outlet Name column may mean that the are genuine duplicates, which need to be cleaned"
	} +
	xml(:p) {
	  "Something else revealed by this (nothing to do with duplicate outlets) is that some rows of the CSV have the Description column missing, so that the phone number becomes the description. Search for Long Sutton Post Office, for example."
	} +
	xml(:table) {
	  # Header row:
	  xml(:tr) {
	    id_headers.map {|h| xml(:th) { h } }.join +
	    outlets_headers.map {|h| xml(:th) { h } }.join
	  } +

	  # Body rows:
	  dups.map {|k, v|
	    #common, different = outlets_headers.partition{|x|
	      #v.map { |i| i.csv_row[x] }.uniq.count  < v.count
	    #}
	    first = true
	    v.map {|i|  
	      xml(:tr) {
		classes = []
		if first
		  # First row of a set of Initiatives with the same ID is different - 
		  # The ID columns span the whole set:
		  # TODO - take this out of (above) the v.map loop, maybe
		  first = false
		  classes << "first"
		  id_headers.map { |h|
		    xml(:td, :class => classes.join(" "), :rowspan => v.count) { "#{i.csv_row[h]}" }
		  }.join
		else
		  ""
		end +

		outlets_headers.map {|h|
		  value = i.csv_row[h]

		  # An array of values for column h of the CSV for each Initiative with the same duplicated id:
		  all_values = v.map { |j| j.csv_row[h] }

		  # Now select out of all_values just those values equal to the value
		  # of this column for Initiative i:
		  same_values = all_values.select{ |j| j == value }

		  # We want to colour the background of the cell depending on whether or not Initiative i
		  # has the same value in column h as any other Initiative with the same id as i.
		  # To find this out, we just count up the number of elments in same:
		  td_classes = classes + [same_values.count > 1 ? "common" : "different"]

		  #xml(:td, :class => common.include?(h) ? "common" : "different") { "#{i.csv_row[h]}" }
		  xml(:td, :class => td_classes.join(" ")) { "#{i.csv_row[h]}" }
		}.join
	      }
	    }.join
	  }.join
	}
      }
    }
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
  attr_reader :id, :name, :postcode_text, :postcode_normalized, :csv_row
  # Map names used in this class to names of columns in the csv row
  #@@field_map = {
      #"outlet-name" => "Outlet Name",
      #"postal-code" => "Postcode",
      ##"country-name" => "UK Nation",
      #"orgid" => "CUK Organisation ID"
  #}
  def initialize(csv_row)
    @csv_row = csv_row
    # Populate the defn hash with keys from @@field_map and values from the corresponding column in the csv_row:
    #@defn = Hash[ *@@field_map.keys.collect { |e| [e, csv_row[ @@field_map[e] ] || "" ] }.flatten ]
    @name = source("Outlet Name")
    @postcode_text = source("Postcode").upcase
    @postcode_normalized = postcode_text.gsub(/\s+/, "")
    # There may be many outlets with the same CUK Organisation ID, so we add the postcode to (hopefilly!) create a unique ID.
    @id = source("CUK Organisation ID") + postcode_normalized
    if @id.empty?
      raise "Id is empty. " + source_as_str
    end
  end
  def source(fld)
    # Note that empty columns are assigned the empty string, instead of nil
    @csv_row[fld] || ""
  end
  def source_as_str
    @csv_row.to_s
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
	xml(:h1) { name } +
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
	xml(:td) { "Name" } + xml(:td) { name }
      } +
      xml(:tr) {
	xml(:td) { "URI (for RDF and HTML)" } + xml(:td) { xml(:a, href: uri.to_s) { uri.to_s } }
      } +
      xml(:tr) {
	xml(:td) { "Postcode" } + xml(:td) { postcode_text }
      } +
      xml(:tr) {
	xml(:td) { "Country" } + xml(:td) { country_name }
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
	#v = @csv_row[h]
	#hv = v.nil? ? "" : CGI.escapeHTML(v)
	hv = CGI.escapeHTML(source(h))
	xml(:tr) {
	  xml(:td) { CGI.escapeHTML(h) } + xml(:td) { hv } 
	}
      }.join
    }
  end
  def self.type_uri
    $essglobal["SSEInitiative"]
  end
  def country_name
    "UK"
  end
  def ospostcode_uri
    # Return an ordnance survey postcode URI
    # TODO - raise an exception if there's not postcode URI for this postcode (e.g. Northern Irish ones??)
    postcode = postcode_normalized
    raise "Empty postcode" if postcode.empty?
    $ospostcode[postcode]	# Convert it to RDF URI, using $ospostcode vocab.
  end
  def make_graph
    graph = RDF::Graph.new
    graph.insert([uri, RDF.type, Initiative.type_uri])
    graph.insert([uri, RDF::Vocab::GR.name, name])
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
      warning([e.message, source_as_str])
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
    graph.insert([addr, RDF::Vocab::VCARD["postal-code"], postcode_text])
    graph.insert([addr, RDF::Vocab::VCARD["country-name"], country_name])
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

collection = Collection.new
puts "Reading #{$input_csv}..."
CSV.foreach($input_csv, :encoding => "ISO-8859-1", :headers => true) do |row|
  # There may be rows for previous years' accounts - we ignore these:
  #if row["Is Most Recent"] == "1"
    begin
    initiative = Initiative.new(row)
    collection << initiative
    rescue StandardError => e # includes ArgumentError, RuntimeError, and many others.
      warning(["Could not create Initiative from CSV: #{e.message}", "The following row from the CSV data will be ignored:", row.to_s])
    end

    # For rapidly testing on subset:
    #break if collection.size > 10
  #end
end
dups_html_file = "duplicates.html"
puts "Saving table of duplicates to #{dups_html_file} ..."
save_html_file(collection.duplicates_html, "duplicates.html")
#collection.resolve_duplicates
collection.create_files

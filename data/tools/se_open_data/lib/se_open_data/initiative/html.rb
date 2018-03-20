# Generating HTML for initiatives

require 'se_open_data/utils/xml'
require 'se_open_data/utils/html'

module SeOpenData
  class Initiative
    class HTML
      include SeOpenData::Utils::Xml
      include SeOpenData::Utils::Html
      attr_reader :initiative, :config
      def initialize(initiative, config)
	@initiative, @config = initiative, config
      end
      def save(outdir)
	fname = File.name(initiative.id, outdir, ".html")
	::File.open(fname, "w") {|f|
	  f.write(html(outdir))
	}
      end
      def html(outdir)
	"<!DOCTYPE html>\n" + 
	  xml(:html) {
	  xml(:head) {
	    xml(:title) { initiative.name }
	  } +
	  xml(:body) {
	    rdf_file = File.name(initiative.id, outdir, ".rdf")
	    ttl_file = File.name(initiative.id, outdir, ".ttl")
	    xml(:h1) {
	      initiative.name
	    } +
	    table_of_csv_input +
	    links_to_other_datasets +
	    links_to_rdf_browsers +
	    html_fragment_for_inserted_code("RDF/XML serialization", rdf_file) +
	    html_fragment_for_inserted_code("RDF Turtle serialization", ttl_file)
	  }
	}
      end
      def table_of_csv_input
	xml(:h2) {
	  "CSV data"
	} +
	table(
	  headers: ["heading", "value"],
	  rows: config.csv_standard::Headers.map {|key, col_heading|
	    [col_heading, initiative.send(key) || ""]
	  }
	)
      end
      def links_to_other_datasets
	xml(:h2) {
	  "Links to other datasets"
	} +
	xml(:ul) {
	  xml(:li) {
	    geocontainer_link
	  } +
	  xml(:li) {
	    companies_house_link
	  }
	}
      end
      def companies_house_link
	uri = initiative.rdf.companies_house_uri
	uri ?  link_to(uri, uri) : ""
      end
      def geocontainer_link
	uri = initiative.rdf.geocontainer_uri
	uri ?  link_to(uri, uri) : ""
      end
      def links_to_rdf_browsers
	escaped_uri = CGI.escapeHTML(initiative.rdf.uri)
	xml(:h2) {
	  "Linked Data Browsers"
	} +
	xml(:p) {
	  "You can look at this data, and follow its links using these tools:"
	} +
	xml(:ul) {
	  xml(:li) {
	    link_to("http://graphite.ecs.soton.ac.uk/browser/?uri=#{escaped_uri}", "Graphite browser") +
	    ", courtesy of University of Southampton"
	  } +
	  xml(:li) {
	    link_to("http://uri4uri.net/uri/#{escaped_uri}", "uri4uri.net")
	  }
	}
      end
    end
  end
end


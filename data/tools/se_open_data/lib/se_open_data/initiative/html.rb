# Generating HTML for initiatives

require 'se_open_data/utils/xml'
require 'se_open_data/utils/html'

module SeOpenData
  class Initiative
    class HTML
      include SeOpenData::Utils::Xml    # for method xml()
      include SeOpenData::Utils::Html
      attr_reader :initiative, :config
      def initialize(initiative, config)
        @initiative, @config = initiative, config
      end
      def save(outdir)
        fname = File.name(initiative.id, outdir, ".html")
        ::File.open(fname, "w") {|f| f.write(html(outdir)) }
      end
      def html(outdir)
        begin
        "<!DOCTYPE html>\n" + 
          xml(:html) {
          xml(:head) {
            xml(:title) { initiative.name } +
            config.css_files.map {|f|
              xml(:link, rel: "stylesheet", href: f)
            }.join
          } +
          xml(:body) {
            rdf_file = File.name(initiative.id, outdir, ".rdf")
            ttl_file = File.name(initiative.id, outdir, ".ttl")
            xml(:h1) {
              initiative.name
            } +
            summary +
            sameas_links +
            table_of_csv_input +
            links_to_other_datasets +
            links_to_rdf_browsers +
            html_fragment_for_inserted_code("Machine readable data: RDF/XML format", rdf_file) +
            html_fragment_for_inserted_code("Machine readable data: RDF Turtle format", ttl_file)
          }
        }
        rescue => e
          puts "Exception creating html for initiative #{initiative.id}."
          puts e.inspect
          "<!DOCTYPE html>\n" 
        end
      end
      def summary
        xml(:h2) {
          "Linked Data URI"
        } +
        xml(:p) {
          "This Linked Data URI can be used to view this page in a web browser, or by a computer program to access the same information in a machine-readable format:"
        } +
        xml(:ul) {
          xml(:li) {
            link_to(initiative.rdf.uri, initiative.rdf.uri)
          }
        } +
        xml(:p) {
          "This is part of a dataset which has its own Linked Data URI: This provides a human-readable list of contents if you click on it; It can also be used by computers to get a list of everything in the dataset in a machine-readable format:"
        } +
        xml(:ul) {
          xml(:li) {
            link_to(config.uri_prefix, config.uri_prefix)
          }
        }
      end
      def sameas_links
        return "" unless config.sameas.has_key?(initiative.rdf.uri_s)

        sameas = config.sameas[initiative.rdf.uri_s]
        xml(:h2) {
          initiative.name + " in other datasets"
        } +
        xml(:ul) {
          sameas.map { |sameas_uri|
            xml(:li) {
              link_to(sameas_uri, sameas_uri)
            }
          }.join
        } 
      end
      def table_of_csv_input
        xml(:h2) {
          "CSV data"
        } +
        xml(:p) {
          "This is the original information from which this Linked Data was generated and published on the web:"
        } +
        table(
          headers: ["heading", "value"],
          rows: config.csv_standard::Headers.map {|key, col_heading|
            [col_heading, initiative.send(key) || ""]
          }
        )
      end
      def links_to_other_datasets
        uris = [initiative.rdf.geocontainer_uri, initiative.rdf.companies_house_uri].compact
        if !uris.empty?
          xml(:h2) {
            "Links to other datasets"
          } +
          xml(:p) {
            "These are Linked Data URIs: You can click on these in your browser to see human-readable information; Computers can use the same Linked Data URIs to get machine-readable information:"
          } +
          xml(:ul) {
            uris.map {|uri| xml(:li) { link_to(uri, uri) } }.join
          }
        else
          ""
        end
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
          }
        }
      end
    end
  end
end


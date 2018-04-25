require 'cgi'
require_relative 'xml'
#require_relative 'file'

module SeOpenData
  module Utils
    module Html
      include SeOpenData::Utils::Xml
      def link_to(href, text = nil)
        xml(:a, href: href) { text || href } 
      end
      def html_fragment_for_inserted_code(heading, filename)
        xml(:div) {
          xml(:h2) {
            heading
          } +
          xml(:pre) {
            CGI.escapeHTML(::File.open(filename, "rb").read)
          }
        }
      end
      def save_file(opts)       # named params :html, :dir, :basename, :filename
        # Only use :dir and :basename if :filename is missing:
        filename = opts[:filename] || File.name(opts[:dir], opts[:basename], "html")
        File.save("<!DOCTYPE html>\n" + opts[:html], filename)
      end
      def table(opts)
        # Named params
        #   :rows - Array of Arrays of columns
        #   :headers - Array of column headings

        thead = opts[:headers] ? xml(:thead) { xml(:tr) { opts[:headers].map {|h| xml(:th) { h } }.join } } : ""
        xml(:table) {
          thead +
          xml(:tbody) {
            opts[:rows].map {|row|
              xml(:tr) {
                row.map {|col|
                  xml(:td) { col || "" }
                }.join
              }
            }.join
          }
        }
      end
    end
  end
end

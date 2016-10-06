require 'cgi'
require_relative 'xml'
require_relative 'file'

module P6
  module Html
    def Html.link_to(href, text = nil)
      P6::Xml.xml(:a, href: href) { text || href } 
    end
    def Html.html_fragment_for_inserted_code(heading, filename)
      P6::Xml.xml(:div) {
	P6::Xml.xml(:h2) {
	  heading
	} +
	P6::Xml.xml(:pre) {
	  CGI.escapeHTML(::File.open(filename, "rb").read)
	}
      }
    end
    def Html.save_file(opts)	# named params :html, :dir, :basename, :filename
      # Only use :dir and :basename if :filename is missing:
      filename = opts[:filename] || P6::File.name(opts[:dir], opts[:basename], "html")
      P6::File.save("<!DOCTYPE html>\n" + opts[:html], filename)
    end
    def Html.table(opts)
      # Named params
      #   :rows - Array of Arrays of columns
      #   :headers - Array of column headings

      thead = opts[:headers] ? P6::Xml.xml(:thead) { P6::Xml.xml(:tr) { opts[:headers].map {|h| P6::Xml.xml(:th) { h } }.join } } : ""
      P6::Xml.xml(:table) {
	thead +
	P6::Xml.xml(:tbody) {
	  opts[:rows].map {|row|
	    P6::Xml.xml(:tr) {
	      row.map {|col|
		P6::Xml.xml(:td) { col }
	      }.join
	    }
	  }.join
	}
      }
    end
  end
end

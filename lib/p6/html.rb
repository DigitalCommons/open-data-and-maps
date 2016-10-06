require 'cgi'
require_relative 'xml'
require_relative 'file'

module P6
  module Html
    def Html.link_to(url)
      P6::Xml.xml(:a, href: url) { url } 
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
    def Html.save_file(html, filename) 
      P6::File.save("<!DOCTYPE html>\n" + html, filename)
    end
  end
end

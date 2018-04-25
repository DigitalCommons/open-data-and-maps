# Contains utilities that are common to the task of dealing with XML

module SeOpenData
  module Utils
    module Xml
      # Function for generating xml.
      # Example usage:
      #    xml(:div, id: "foo", class: "bar") {
      #      xml(:p) {
      #        "paragraph contents"
      #      }
      #    }
      def xml(ele, attr = {})
	"<#{ele}#{attr.keys.map{|k| " #{k}=\"#{attr[k]}\""}.join}>" + # Element opening tag with attributes.
	  (block_given? ? yield : "") +	# Element contents.
	  "</#{ele}>"	# Element closing tag.
      end
    end
  end
end

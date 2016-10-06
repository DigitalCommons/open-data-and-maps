require 'linkeddata'
require 'rdf/vocab'
require 'rdf'

module P6
  module Turtle
    def Turtle.save_file(opts)	# named params :graph, :prefixes, :dir, :basename, :filename
      # Only use :dir and :basename if :filename is missing:
      filename = opts[:filename] || P6::File.name(opts[:dir], opts[:basename], "ttl")
      RDF::Turtle::Writer.open(filename, prefixes: opts[:prefixes]) {|writer| writer << opts[:graph] }
      filename
    end
  end
end



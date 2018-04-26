require 'linkeddata'
module SeOpenData
  module RDF
    def RDF.create_sameas_graph(uri_pairs)
      graph = ::RDF::Graph.new
      uri_pairs.each do |pair|
        graph.insert([::RDF::URI(pair[0]), ::RDF::Vocab::OWL.sameAs, ::RDF::URI(pair[1])])
      end
      graph
    end
  end
end

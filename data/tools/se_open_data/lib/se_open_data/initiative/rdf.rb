require 'linkeddata'

module SeOpenData
  class Initiative
    class RDF
      attr_reader :initiative, :config
      def initialize(initiative, config)
	@initiative, @config = initiative, config
      end
      def graph
	puts uri.to_s
	g = ::RDF::Graph.new
	populate_graph(g)
	#puts g.to_s
	g
      end
      def uri
	config.uri(initiative)
      end
      def populate_graph(graph)
	graph.insert([uri, ::RDF.type, config.rdf_type])
      end
    end
  end
end


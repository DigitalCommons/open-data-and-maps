require 'linkeddata'

module SeOpenData
  class Initiative
    class RDF
      attr_reader :initiative, :config, :graph
      def initialize(initiative, config)
	@initiative, @config = initiative, config
	@graph = make_graph
      end
      def save_rdfxml(outdir)
	f = filename(outdir, ".rdf")
	::RDF::RDFXML::Writer.open(f, standard_prefixes: true, prefixes: config.prefixes) {|writer|
	  writer << graph
	}
      end
      def filename(outdir, ext)
	outdir + config.dataset + "/" + initiative.id + ext
      end
      def make_graph
	puts uri.to_s
	g = ::RDF::Graph.new
	populate_graph(g)
	#puts g.to_s
	g
      end
      def uri
	::RDF::URI("#{config.uri_base}#{initiative.id}")
      end
      def populate_graph(graph)
	graph.insert([uri, ::RDF.type, config.rdf_type])
      end
      private
    end
  end
end


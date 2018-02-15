require 'linkeddata'

module SeOpenData
  class Initiative
    class Collection
      class RDF
	attr_reader :collection, :config
	def initialize(collection, config)
	  @collection, @config = collection, config
	end
	def save_rdfxml(outdir)
	  f = filename(outdir, ".rdf")
	  ::RDF::RDFXML::Writer.open(f, standard_prefixes: true, prefixes: config.prefixes) {|writer|
	    writer << graph
	  }
	end
	def save_turtle(outdir)
	  f = filename(outdir, ".ttl")
	  ::RDF::Turtle::Writer.open(f, standard_prefixes: true, prefixes: config.prefixes) {|writer|
	    writer << graph
	  }
	end
	def filename(outdir, ext)
	  outdir + config.dataset + ext
	end
	def graph
	  @graph ||= make_graph
	end
	def make_graph
	  g = ::RDF::Graph.new
	  collection.each {|i|	# each initiative in the collection
	    g.insert([i.rdf.uri, ::RDF.type, config.initiative_rdf_type])
	  }
	  g
	end
      end
    end
  end
end

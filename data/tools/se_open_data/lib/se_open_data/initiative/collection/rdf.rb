require 'linkeddata'

module SeOpenData
  class Initiative
    class Collection
      class RDF
	class Graph < ::RDF::Graph
	  # This class is needed bacause insert_graph is a protected method of ::RDF::Graph.
	  # No other reason.
	  def insert_graph(g)
	    super.insert_graph(g)
	  end
	end
	OneBigFileSuffix = "_all"
	attr_reader :collection, :config
	def initialize(collection, config)
	  @collection, @config = collection, config
	end
	def save_index_rdfxml(outdir)
	  f = index_filename(outdir, ".rdf")
	  ::RDF::RDFXML::Writer.open(f, standard_prefixes: true, prefixes: config.prefixes) {|writer|
	    writer << index_graph
	  }
	end
	def save_index_turtle(outdir)
	  f = index_filename(outdir, ".ttl")
	  ::RDF::Turtle::Writer.open(f, standard_prefixes: true, prefixes: config.prefixes) {|writer|
	    writer << index_graph
	  }
	end
	def index_filename(outdir, ext)
	  outdir + config.dataset + ext
	end
	def save_one_big_rdfxml(outdir)
	  f = one_big_filename(outdir, ".rdf")
	  ::RDF::RDFXML::Writer.open(f, standard_prefixes: true, prefixes: config.prefixes) {|writer|
	    writer << one_big_graph
	  }
	end
	def save_one_big_turtle(outdir)
	  f = one_big_filename(outdir, ".ttl")
	  ::RDF::Turtle::Writer.open(f, standard_prefixes: true, prefixes: config.prefixes) {|writer|
	    writer << one_big_graph
	  }
	end
	def one_big_filename(outdir, ext)
	  outdir + config.dataset + OneBigFileSuffix + ext
	end
	private
	def index_graph
	  # We're going to cache the results of this method in the variable @index_graph.
	  if @size_when_index_graph_created
	    # Of course, it is also possible that the cache could be outdated with the sizes matching.
	    # But this should catch the most likely error:
	    raise "Using outdated cache" unless @size_when_index_graph_created == @collection.size
	  end
	  @size_when_index_graph_created = @collection.size
	  # Caching the result means that we don't have to recreate the index_graph for each of the different serializations.
	  @index_graph ||= make_index_graph
	end
	def make_index_graph
	  graph = ::RDF::Graph.new
	  collection.each {|i|	# each initiative in the collection
	    graph.insert([i.rdf.uri, ::RDF.type, config.initiative_rdf_type])
	  }
	  graph
	end
	def one_big_graph
	  # We're going to cache the results of this method in the variable @one_big_graph.
	  if @size_when_one_big_graph_created
	    # Of course, it is also possible that the cache could be outdated with the sizes matching.
	    # But this should catch the most likely error:
	    raise "Using outdated cache" unless @size_when_one_big_graph_created == @collection.size
	  end
	  @size_when_one_big_graph_created = @collection.size
	  # Caching the result means that we don't have to recreate the one_big_graph for each of the different serializations.
	  @one_big_graph ||= make_one_big_graph
	end
	def make_one_big_graph
	  # N.B. This is not ::RDF::Graph because we need to be able to use the protected method insert_graph:
	  graph = Graph.new
	  collection.each {|i|	# each initiative in the collection
	    graph.insert_graph(i.rdf.graph)
	  }
	  graph
	end
      end
    end
  end
end

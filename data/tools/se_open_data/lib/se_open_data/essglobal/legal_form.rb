require 'linkeddata'
require 'rdf/rdfxml'

module SeOpenData
  module Essglobal
    class LegalForm
      def initialize(essglobal_uri)
	uri = "#{essglobal_uri}standard/legal-form"
	puts uri
	#graph = ::RDF::Graph.load(uri, graph_name: nil, content_type: "application/rdf+xml")
	graph = ::RDF::Graph.load(uri, format: :rdfxml)
	#puts "graph loaded"
	#puts graph.dump(:ntriples)
	#::RDF::Reader.each { |klass| puts klass.name }
	#::RDF::Format.each { |klass| puts klass.name }
	query = ::RDF::Query.new do
	  pattern [:concept, ::RDF.type, ::RDF::Vocab::SKOS.Concept]
	  pattern [:concept, ::RDF::Vocab::SKOS.prefLabel, :label]
	end
	@lookup = {}
	query.execute(graph).each do |solution|
	  #puts solution.inspect
	  #puts solution.concept.to_s
	  #puts solution.label.to_s
	  #puts solution.label.language
	  @lookup[solution.label.to_s.gsub(/ /, "")] = solution
	end
      end
      def has_label? (label)
	@lookup.has_key?(label.gsub(/ /, ""))
      end
      def concept_uri(label)
	@lookup[label.gsub(/ /, "")].concept.to_s
      end
    end
  end
end


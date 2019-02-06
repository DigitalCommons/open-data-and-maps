require 'linkeddata'
require 'rdf/rdfxml'

module SeOpenData
  module Essglobal
    class LegalForm
      def initialize(essglobal_uri)
        uri = "#{essglobal_uri}standard/legal-form"
        puts uri
        graph = ::RDF::Graph.load(uri, format: :rdfxml)
        #puts graph.dump(:ntriples)
        #::RDF::Reader.each { |klass| puts klass.name }
        #::RDF::Format.each { |klass| puts klass.name }
        query = ::RDF::Query.new do
          pattern [:concept, ::RDF.type, ::RDF::Vocab::SKOS.Concept]
          pattern [:concept, ::RDF::Vocab::SKOS.prefLabel, :label]
        end
        @lookup = {}
        query.execute(graph).each do |solution|
          #puts "LegalForm: #{solution.label}"
          #@lookup[solution.label.to_s.gsub(/ /, "")] = solution
          @lookup[to_key(solution.label.to_s)] = solution
        end
      end
      def has_label? (label)
        #@lookup.has_key?(label.gsub(/ /, ""))
        @lookup.has_key?(to_key(label))
      end
      def concept_uri(label)
        #@lookup[label.gsub(/ /, "")].concept.to_s
        @lookup[to_key(label)].concept.to_s
      end
      def to_key(label)
        label.upcase.gsub(/ /, "")
      end

    end
  end
end


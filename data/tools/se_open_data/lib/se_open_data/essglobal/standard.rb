require 'linkeddata'
require 'rdf/rdfxml'

module SeOpenData
  module Essglobal
    class Standard
      def initialize(essglobal_uri, taxonomy)
        # taxonomy is a string that matches one of the filenames (but without `.skos`) in:
        # https://github.com/essglobal-linked-open-data/map-sse/tree/develop/vocabs/standard
        uri = "#{essglobal_uri}standard/#{taxonomy}"
        puts uri
        graph = ::RDF::Graph.load(uri, format: :rdfxml)
        query = ::RDF::Query.new do
          pattern [:concept, ::RDF.type, ::RDF::Vocab::SKOS.Concept]
          pattern [:concept, ::RDF::Vocab::SKOS.prefLabel, :label]
        end
        @lookup = {}
        query.execute(graph).each do |solution|
          @lookup[to_key(solution.label.to_s)] = solution
        end
      end
      def has_label? (label)
        @lookup.has_key?(to_key(label))
      end
      def concept_uri(label)
        @lookup[to_key(label)].concept.to_s
      end
      private
      def to_key(label)
        label.upcase.gsub(/ /, "")
      end
    end
  end
end



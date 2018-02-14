require 'linkeddata'

module SeOpenData
  class Initiative
    class RDF
      class Config
	attr_reader :uri_prefix, :dataset, :essglobal_uri, :essglobal_vocab
	def initialize(uri_prefix, dataset, essglobal_uri)
	  @uri_prefix, @dataset, @essglobal_uri = uri_prefix, dataset, essglobal_uri
	  @essglobal_vocab = ::RDF::Vocabulary.new(essglobal_uri + "vocab/")
	end
	def uri(initiative)
	  ::RDF::URI("#{uri_prefix}#{dataset}/#{initiative.id}")
	end
	def rdf_type
	  essglobal_vocab["SSEInitiative"]
	end
      end
    end
  end
end


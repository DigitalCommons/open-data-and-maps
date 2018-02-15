require 'linkeddata'

module SeOpenData
  class Initiative
    class RDF
      class Config
	Ospostcode = ::RDF::Vocabulary.new("http://data.ordnancesurvey.co.uk/id/postcodeunit/")
	Osspatialrelations = ::RDF::Vocabulary.new("http://data.ordnancesurvey.co.uk/ontology/spatialrelations/")
	Rov = ::RDF::Vocabulary.new("http://www.w3.org/ns/regorg#")
	attr_reader :uri_prefix, :dataset, :essglobal_uri, :essglobal_vocab, :essglobal_standard
	def initialize(uri_prefix, dataset, essglobal_uri)
	  @uri_prefix, @dataset, @essglobal_uri = uri_prefix, dataset, essglobal_uri
	  @essglobal_vocab = ::RDF::Vocabulary.new(essglobal_uri + "vocab/")
	  @essglobal_standard = ::RDF::Vocabulary.new(essglobal_uri + "standard/")
	end
	def prefixes
	  {
	    vcard: ::RDF::Vocab::VCARD.to_uri.to_s,
	    geo: ::RDF::Vocab::GEO.to_uri.to_s,
	    essglobal: essglobal_vocab.to_uri.to_s,
	    gr: ::RDF::Vocab::GR.to_uri.to_s,
	    foaf: ::RDF::Vocab::FOAF.to_uri.to_s,
	    ospostcode: Ospostcode.to_uri.to_s,
	    rov: Rov.to_uri.to_s,
	    osspatialrelations: Osspatialrelations.to_uri.to_s
	  }
	end
	def uri_base
	  "#{uri_prefix}#{dataset}/"
	end
	def rdf_type
	  essglobal_vocab["SSEInitiative"]
	end
      end
    end
  end
end


require 'linkeddata'

module SeOpenData
  class Initiative
    class RDF
      class Config
	Ospostcode = ::RDF::Vocabulary.new("http://data.ordnancesurvey.co.uk/id/postcodeunit/")
	Osspatialrelations = ::RDF::Vocabulary.new("http://data.ordnancesurvey.co.uk/ontology/spatialrelations/")
	Geo = ::RDF::Vocabulary.new("http://www.w3.org/2003/01/geo/wgs84_pos#")
	Rov = ::RDF::Vocabulary.new("http://www.w3.org/ns/regorg#")
	attr_reader :uri_prefix, :essglobal_uri, :essglobal_vocab, :one_big_file_basename, :map_app_sparql_query_filename, :essglobal_standard, :postcodeunit_cache, :legal_form_lookup, :csv_standard
	def initialize(uri_prefix, essglobal_uri, one_big_file_basename, map_app_sparql_query_filename, postcodeunit_cache_filename, csv_standard)
	  @uri_prefix, @essglobal_uri, @postcodeunit_cache = uri_prefix, essglobal_uri, postcodeunit_cache
	  @essglobal_vocab = ::RDF::Vocabulary.new(essglobal_uri + "vocab/")
	  @essglobal_standard = ::RDF::Vocabulary.new(essglobal_uri + "standard/")
	  @one_big_file_basename = one_big_file_basename
	  @map_app_sparql_query_filename = map_app_sparql_query_filename
	  @postcodeunit_cache = SeOpenData::RDF::OsPostcodeUnit::Client.new(postcodeunit_cache_filename)
	  @legal_form_lookup = SeOpenData::Essglobal::LegalForm.new(essglobal_uri)
	  @csv_standard = csv_standard
	end
	def prefixes
	  {
	    rdf: ::RDF.to_uri.to_s,
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
	def initiative_rdf_type
	  essglobal_vocab["SSEInitiative"]
	end
      end
    end
  end
end


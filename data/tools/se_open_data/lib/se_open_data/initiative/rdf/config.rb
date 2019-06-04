require 'linkeddata'
require 'csv'

module SeOpenData
  class Initiative
    class RDF
      class Config
        Ospostcode = ::RDF::Vocabulary.new("http://data.ordnancesurvey.co.uk/id/postcodeunit/")
        Osspatialrelations = ::RDF::Vocabulary.new("http://data.ordnancesurvey.co.uk/ontology/spatialrelations/")
        Geo = ::RDF::Vocabulary.new("http://www.w3.org/2003/01/geo/wgs84_pos#")
        Rov = ::RDF::Vocabulary.new("http://www.w3.org/ns/regorg#")
        attr_reader :uri_prefix, :essglobal_uri, :essglobal_vocab, :one_big_file_basename, :map_app_sparql_query_filename, :css_files, :essglobal_standard, :postcodeunit_cache, :organisational_structure_lookup, :activities_mod_lookup, :legal_form_lookup, :activities_lookup, :csv_standard, :sameas
        def initialize(uri_prefix, essglobal_uri, one_big_file_basename, map_app_sparql_query_filename, css_files, postcodeunit_cache_filename, csv_standard, sameas_csv=nil, sameas_headers=nil)
          @uri_prefix, @essglobal_uri, @postcodeunit_cache = uri_prefix, essglobal_uri, postcodeunit_cache
          @essglobal_vocab = ::RDF::Vocabulary.new(essglobal_uri + "vocab/")
          @essglobal_standard = ::RDF::Vocabulary.new(essglobal_uri + "standard/")
          @one_big_file_basename = one_big_file_basename
          @map_app_sparql_query_filename = map_app_sparql_query_filename
          @css_files = css_files
          @postcodeunit_cache = SeOpenData::RDF::OsPostcodeUnit::Client.new(postcodeunit_cache_filename)

          # Lookups for standard vocabs:
          # second param is a string that matches one of the filenames (but without `.skos`) in:
          # https://github.com/essglobal-linked-open-data/map-sse/tree/develop/vocabs/standard
          @organisational_structure_lookup = SeOpenData::Essglobal::Standard.new(essglobal_uri, "organisational-structure")
          @activities_mod_lookup = SeOpenData::Essglobal::Standard.new(essglobal_uri, "activities-modified")
          # @legal_form_lookup = SeOpenData::Essglobal::Standard.new(essglobal_uri, "legal-form")
          # @activities_lookup = SeOpenData::Essglobal::Standard.new(essglobal_uri, "activities-modified")

          @csv_standard = csv_standard

          # keys are URIs in *this* dataset. values are arrays of URIs in other datasets.
          # @sameas = Hash.new { |h, k| h[k] = [] }
          # if sameas_csv
          #   puts sameas_headers
          #   raise("Expected 2 sameas_headers to be defined") unless sameas_headers && sameas_headers.size == 2
          #   ::CSV.foreach(sameas_csv, headers: true) do |row|
          #     @sameas[row[sameas_headers[0]]] << row[sameas_headers[1]]
          #   end
          # end
        end
        def prefixes
          {
            rdf: ::RDF.to_uri.to_s,
            dc: ::RDF::Vocab::DC.to_uri.to_s,
            vcard: ::RDF::Vocab::VCARD.to_uri.to_s,
            geo: ::RDF::Vocab::GEO.to_uri.to_s,
            owl: ::RDF::Vocab::OWL.to_uri.to_s,
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


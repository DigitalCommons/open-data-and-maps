require 'linkeddata'

#$lib_dir = "../../../lib/p6/"
#require_relative $lib_dir + 'rdf-cache'
require_relative 'cache'

module SeOpenData
  module RDF
    module OsPostcodeUnit
      OsVocab = ::RDF::Vocabulary.new("http://data.ordnancesurvey.co.uk/id/postcodeunit/")
      Geo = ::RDF::Vocabulary.new("http://www.w3.org/2003/01/geo/wgs84_pos#")

      class Client
	def initialize(rdf_cache_filename)
	  @cache = Cache.new(rdf_cache_filename, {
	    lat: Geo["lat"].to_s,
	    lng: Geo["long"].to_s
	  })
	end
	def get(postcode)
	  return nil unless postcode.ascii_only?

	  postcode_normalized = normalize(postcode)
	  return nil if postcode_normalized.empty?

	  postcode_uri = OsVocab[postcode_normalized]
	  res = @cache.get(postcode_uri)
	  return nil unless res

	  {
	    within: postcode_uri,
	    lat: res.lat.value,
	    lng: res.lng.value
	  }
	end
	def normalize(postcode)
	  postcode.upcase.gsub(/\s+/, "")
	end
      end

    end
  end
end

require 'linkeddata'

require_relative 'cache'

module SeOpenData
  module RDF
    module OsPostcodeUnit

      class Client
	def initialize(rdf_cache_filename)
	  @cache = Cache.new(rdf_cache_filename, {
	    lat: Initiative::RDF::Config::Geo["lat"].to_s,
	    lng: Initiative::RDF::Config::Geo["long"].to_s
	  })
	end
	def get(postcode)
	  return nil unless postcode.ascii_only?

	  postcode_normalized = normalize(postcode)
	  return nil if postcode_normalized.empty?

	  postcode_uri = Initiative::RDF::Config::Ospostcode[postcode_normalized]
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

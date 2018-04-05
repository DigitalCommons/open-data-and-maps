require 'linkeddata'

module SeOpenData
  class Initiative
    class Collection
      class Sparql
	attr_reader :collection, :config
	def initialize(collection, config)
	  @collection, @config = collection, config
	end
	def save_map_app_sparql_query
	  ::File.open(config.map_app_sparql_query_filename, "w") {|f|
	    config.prefixes.each {|prefix, uri|
	      f.puts "PREFIX #{prefix.to_s}: <#{uri}>"
	    }
	    f.puts <<ENDSPARQL
PREFIX : <#{config.uri_prefix}>

SELECT ?name ?uri ?within ?lat ?lng ?www ?regorg
WHERE {
	?uri rdf:type essglobal:SSEInitiative .
	?uri gr:name ?name .
	OPTIONAL { ?uri foaf:homepage ?www . }
	?uri essglobal:hasAddress ?addr .
	OPTIONAL { ?uri rov:hasRegisteredOrganization ?regorg . }
	?addr osspatialrelations:within ?within .
	?within geo:lat ?lat.
	?within geo:long ?lng.
}
LIMIT #{collection.size}
ENDSPARQL
	  }
	end
      end
    end
  end
end



require 'linkeddata'

module SeOpenData
  class Initiative
    class RDF
      attr_reader :initiative, :config
      def initialize(initiative, config)
	#puts "Initiative::RDF:" + initiative.id
	@initiative, @config = initiative, config
      end
      def save_rdfxml(outdir)
	f = File.name(initiative.id, outdir, ".rdf")
	::RDF::RDFXML::Writer.open(f, standard_prefixes: true, prefixes: config.prefixes) {|writer|
	  writer << graph
	}
      end
      def save_turtle(outdir)
	f = File.name(initiative.id, outdir, ".ttl")
	::RDF::Turtle::Writer.open(f, standard_prefixes: true, prefixes: config.prefixes) {|writer|
	  writer << graph
	}
      end
      def graph
	@graph ||= make_graph
      end
      def make_graph
	#puts uri.to_s
	g = ::RDF::Graph.new
	populate_graph(g)
	g
      end
      def uri
	::RDF::URI("#{config.uri_prefix}#{initiative.id}")
      end
      def address_uri
	# We don't really weant to have to mint URIs for the Address, but OntoWiki doesn't seem to
	# want to load the data inside blank URIs.
	# Furthermore, http://wifo5-03.informatik.uni-mannheim.de/bizer/pub/LinkedDataTutorial/#datamodel
	# discourages the use of blank nodes.
	# See also: https://github.com/SolidarityEconomyAssociation/open-data-and-maps/issues/13
	::RDF::URI("#{uri}#Address")
      end
      def geocontainer_uri
	initiative.geocontainer && !initiative.geocontainer.empty? ?
	  ::RDF::URI(initiative.geocontainer) : nil
      end
      def lat_lng
	initiative.geocontainer_lat && initiative.geocontainer_lon && ! initiative.geocontainer_lat.empty? && ! initiative.geocontainer_lon.empty? ?
	  { lat: initiative.geocontainer_lat, lng: initiative.geocontainer_lon } : nil
      end
      def legal_form_uris
	# Returns array of URIs
	initiative.legal_forms.split(config.csv_standard::SubFieldSeparator).map {|form|
	  if config.legal_form_lookup.has_label?(form)
	    ::RDF::URI(config.legal_form_lookup.concept_uri(form))
	  else
	    $stderr.puts "Could not find legal-form: #{form}"
	    nil
	  end
	}.compact	# To remove any nil elements added above.
      end

      def populate_graph(graph)
	graph.insert([uri, ::RDF.type, config.initiative_rdf_type])
	if initiative.name && !initiative.name.empty?
	  graph.insert([uri, ::RDF::Vocab::GR.name, initiative.name])
	end
	if initiative.homepage && !initiative.homepage.empty?
	  graph.insert([uri, ::RDF::Vocab::FOAF.homepage, initiative.homepage])
	end
	legal_form_uris.each {|legal_form_uri|
	  graph.insert([uri, config.essglobal_vocab.legalForm, legal_form_uri])
	}
	if initiative.companies_house_number && !initiative.companies_house_number.empty?
	  graph.insert([uri, Config::Rov.hasRegisteredOrganization,
		 SeOpenData::RDF::CompaniesHouse.uri(initiative.companies_house_number)])
	end
	graph.insert([uri, config.essglobal_vocab.hasAddress, address_uri])

	# Populate the Address:
	graph.insert([address_uri, ::RDF.type, config.essglobal_vocab["Address"]])

	# Map values onto their VCARD porperties:
	{
	  initiative.street_address => "street-address",
	  initiative.locality => "locality",
	  initiative.region => "region",
	  initiative.postcode => "postal-code",
	  initiative.country_name => "country-name"
	}.each {|val, property|
	  if val && !val.empty?
	    graph.insert([address_uri, ::RDF::Vocab::VCARD[property], val])
	  end
	}
	if geocontainer_uri
	  graph.insert([address_uri, Config::Osspatialrelations.within, geocontainer_uri])
	  loc = lat_lng
	  if loc
	    graph.insert([geocontainer_uri, Config::Geo["lat"], ::RDF::Literal::Decimal.new(loc[:lat])])
	    graph.insert([geocontainer_uri, Config::Geo["long"], ::RDF::Literal::Decimal.new(loc[:lng])])
	  end
	end

      end
      private
    end
  end
end


require 'linkeddata'

module SeOpenData
  class Initiative
    class RDF
      attr_reader :initiative, :config, :graph
      def initialize(initiative, config)
	@initiative, @config = initiative, config
	@graph = make_graph
      end
      def save_rdfxml(outdir)
	f = filename(outdir, ".rdf")
	::RDF::RDFXML::Writer.open(f, standard_prefixes: true, prefixes: config.prefixes) {|writer|
	  writer << graph
	}
      end
      def filename(outdir, ext)
	outdir + config.dataset + "/" + initiative.id + ext
      end
      def make_graph
	puts uri.to_s
	g = ::RDF::Graph.new
	populate_graph(g)
	#puts g.to_s
	g
      end
      def uri
	::RDF::URI("#{config.uri_base}#{initiative.id}")
      end
      def address_uri
	# We don't really weant to have to mint URIs for the Address, but OntoWiki doesn't seem to
	# want to load the data inside blank URIs.
	# Furthermore, http://wifo5-03.informatik.uni-mannheim.de/bizer/pub/LinkedDataTutorial/#datamodel
	# discourages the use of blank nodes.
	# See also: https://github.com/SolidarityEconomyAssociation/open-data-and-maps/issues/13
	::RDF::URI("#{uri}Address")
      end
      def ospostcodeunit_uri
	initiative.ospostcodeunit && !initiative.ospostcodeunit.empty? ?
	  ::RDF::URI(initiative.ospostcodeunit) : nil
      end

      def populate_graph(graph)
	graph.insert([uri, ::RDF.type, config.rdf_type])
	if initiative.name && !initiative.name.empty?
	  graph.insert([uri, ::RDF::Vocab::GR.name, initiative.name])
	end
	if initiative.homepage && !initiative.homepage.empty?
	  graph.insert([uri, ::RDF::Vocab::FOAF.homepage, initiative.homepage])
	end
	graph.insert([uri, config.essglobal_vocab.legalForm, config.essglobal_standard["legal-form/L2"]])
	if initiative.companies_house_number && !initiative.companies_house_number.empty?
	  graph.insert([uri, Config::Rov.hasRegisteredOrganization, SeOpenData::RDF::CompaniesHouse.uri(initiative.companies_house_number)])
	end
	graph.insert([uri, config.essglobal_vocab.hasAddress, address_uri])
	graph.insert([address_uri, ::RDF.type, config.essglobal_vocab["Address"]])
	if initiative.postcode && !initiative.postcode.empty?
	  graph.insert([address_uri, ::RDF::Vocab::VCARD["postal-code"], initiative.postcode])
	end
	if initiative.country_name && !initiative.country_name.empty?
	  graph.insert([address_uri, ::RDF::Vocab::VCARD["country-name"], initiative.country_name])
	end
	if ospostcodeunit_uri
	  graph.insert([address_uri, Config::Osspatialrelations.within, ospostcodeunit_uri])
	end

      end
      private
    end
  end
end


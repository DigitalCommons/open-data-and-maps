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
      def uri_s
        "#{config.uri_prefix}#{initiative.id}"
      end
      def uri
        ::RDF::URI(uri_s)
      end
      def address_uri
        # We don't really weant to have to mint URIs for the Address, but OntoWiki doesn't seem to
        # want to load the data inside blank URIs.
        # Furthermore, http://wifo5-03.informatik.uni-mannheim.de/bizer/pub/LinkedDataTutorial/#datamodel
        # discourages the use of blank nodes.
        # See also: https://github.com/SolidarityEconomyAssociation/open-data-and-maps/issues/13
        ::RDF::URI("#{uri}#Address")
      end
      def phone_uri
        ::RDF::URI("#{uri}#Telephone")
      end
      def email_uri
        ::RDF::URI("#{uri}#Email")
      end
      def geocontainer_uri
        initiative.geocontainer && !initiative.geocontainer.empty? ?
          ::RDF::URI(initiative.geocontainer) : nil
      end
      def companies_house_uri
        ch_num = initiative.companies_house_number 
        ch_num && !ch_num.empty? && SeOpenData::RDF::CompaniesHouse.uri(ch_num) || nil
      end
      def lat_lng
        initiative.latitude && initiative.longitude && ! initiative.latitude.empty? && ! initiative.longitude.empty? ?
          { lat: initiative.latitude, lng: initiative.longitude } : nil
      end
      def geocontainer_lat_lng
        initiative.geocontainer_lat && initiative.geocontainer_lon && ! initiative.geocontainer_lat.empty? && ! initiative.geocontainer_lon.empty? ?
          { lat: initiative.geocontainer_lat, lng: initiative.geocontainer_lon } : nil
      end
      # def legal_form_uris
      #   # @returns array of URIs
      #   if initiative.legal_forms.nil?
      #     []
      #   else
      #     initiative.legal_forms.split(config.csv_standard::SubFieldSeparator).map {|form|
      #       if config.legal_form_lookup.has_label?(form)
      #         ::RDF::URI(config.legal_form_lookup.concept_uri(form))
      #       else
      #         $stderr.puts "Could not find legal-form: #{form}"
      #         nil
      #       end
      #     }.compact       # To remove any nil elements added above.
      #   end
      # end

      def activities_uris
        # @returns array of URIs
        if initiative.activities.nil?
          []
        else
          initiative.activities.split(config.csv_standard::SubFieldSeparator).map {|activity|
            if config.activities_mod_lookup.has_label?(activity)
              ::RDF::URI(config.activities_mod_lookup.concept_uri(activity))
            else
              $stderr.puts "Could not find activities: #{activity}"
              nil
            end
          }.compact       # To remove any nil elements added above.
        end
      end
      def organisational_structure_uris
        # @returns array of URIs
        if initiative.organisational_structure.nil?
          []
        else
          initiative.organisational_structure.split(config.csv_standard::SubFieldSeparator).map {|structure|
            if config.organisational_structure_lookup.has_label?(structure)
              ::RDF::URI(config.organisational_structure_lookup.concept_uri(structure))
            else
              $stderr.puts "Could not find organisational-structure: #{structure}"
              nil
            end
          }.compact       # To remove any nil elements added above.
        end
      end
      def primary_activity_uris
        # @returns array of URIs
        if initiative.primary_activity.nil?
          []
        else
          initiative.primary_activity.split(config.csv_standard::SubFieldSeparator).map {|activity|
            if config.activities_mod_lookup.has_label?(activity)
              ::RDF::URI(config.activities_mod_lookup.concept_uri(activity))
            else
              $stderr.puts "Could not find activities: #{activity}"
              nil
            end
          }.compact       # To remove any nil elements added above.
        end
      end

      def populate_graph(graph)
        graph.insert([uri, ::RDF.type, config.initiative_rdf_type])
        if initiative.name && !initiative.name.empty?
          graph.insert([uri, ::RDF::Vocab::GR.name, initiative.name])
        end
        if initiative.description && !initiative.description.empty?
          graph.insert([uri, ::RDF::Vocab::DC.description, ::RDF::Literal.new(initiative.description)])
        end
        if initiative.homepage && !initiative.homepage.empty?
          graph.insert([uri, ::RDF::Vocab::FOAF.homepage, initiative.homepage])
        end
        # legal_form_uris.each {|legal_form_uri|
        #   graph.insert([uri, config.essglobal_vocab.legalForm, legal_form_uri])
        # }
        activities_uris.each {|activities_mod_uri|
          graph.insert([uri, config.essglobal_vocab.economicSector, activities_mod_uri])
        }
        organisational_structure_uris.each {|organisational_structure_uri|
          graph.insert([uri, config.essglobal_vocab.organisationalStructure, organisational_structure_uri])
        }
        primary_activity_uris.each {|activities_mod_uri| # There should only be one
          graph.insert([uri, config.essglobal_vocab.primarySector, activities_mod_uri])
        }
        if companies_house_uri
          graph.insert([uri, Config::Rov.hasRegisteredOrganization, companies_house_uri])
        end

        if(initiative.postcode && !initiative.postcode.empty?)
          graph.insert([uri, config.essglobal_vocab.hasAddress, address_uri])

          # Populate the Address:
          graph.insert([address_uri, ::RDF.type, config.essglobal_vocab["Address"]])

          # This is the actual lat/long as opposed to the lat/long of a geocontainer (such as a postcode)
          loc = lat_lng
          if loc
            graph.insert([address_uri, Config::Geo["lat"], ::RDF::Literal::Decimal.new(loc[:lat])])
            graph.insert([address_uri, Config::Geo["long"], ::RDF::Literal::Decimal.new(loc[:lng])])
          end

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
            loc = geocontainer_lat_lng
            if loc
              graph.insert([geocontainer_uri, Config::Geo["lat"], ::RDF::Literal::Decimal.new(loc[:lat])])
              graph.insert([geocontainer_uri, Config::Geo["long"], ::RDF::Literal::Decimal.new(loc[:lng])])
            end
          end
        end
        
        if(initiative.phone && !initiative.phone.empty?)
          graph.insert([uri, ::RDF::Vocab::VCARD.hasTelephone, phone_uri])
          graph.insert([phone_uri, ::RDF::Vocab::VCARD.value, initiative.phone])
        end
        
        if(initiative.email && !initiative.email.empty?)
          graph.insert([uri, ::RDF::Vocab::VCARD.hasEmail, email_uri])
          graph.insert([email_uri, ::RDF::Vocab::VCARD.value, initiative.email])
        end

        # TODO: Need to work out how to add accounts in the following way (RDF)
        # <foaf:account>
        #   <foaf:OnlineAccount>
        #     <rdf:type rdf:resource="http://xmlns.com/foaf/0.1/OnlineAccount"/>
        #     <foaf:accountServiceHomepage 
        #             rdf:resource="http://twitter.com/"/>
        #     <foaf:accountName>solidarityeconomyassociation</foaf:accountName>
        #   </foaf:OnlineAccount>
        # </foaf:account>
        # <foaf:account>
        #   <foaf:OnlineAccount>
        #     <rdf:type rdf:resource="http://xmlns.com/foaf/0.1/OnlineAccount"/>
        #     <foaf:accountServiceHomepage 
        #             rdf:resource="http://facebook.com/"/>
        #     <foaf:accountName>solidarityeconomyassociation</foaf:accountName>
        #   </foaf:OnlineAccount>
        # </foaf:account>

        # This is equivalent to (TTL)
        # foaf:account [
        #   a foaf:OnlineAccount ;
        #   foaf:accountServiceHomepage <http://www.twitter.com/> ;
        #   foaf:accountName "solidarityeconomyassociation"
        # ], [
        #   a foaf:OnlineAccount ;
        #   foaf:accountServiceHomepage <http://www.faebook.com/> ;
        #   foaf:accountName "solidarityeconomyassociation"
        # ] ;

        # The above is also true of hasAddress/hasTelephone and hasEmail

        # if(initiative.twitter && !initiative.twitter.empty?)
        #   graph.insert([uri, ::RDF::Vocab::FOAF.account, twitter_uri])
        #   graph.insert([twitter_uri, ::RDF.type, "http://xmlns.com/foaf/0.1/OnlineAccount"])
        #   graph.insert([twitter_uri, ::RDF::Vocab::FOAF.accountServiceHomepage, "https://twitter.com/"])
        #   graph.insert([twitter_uri, ::RDF::Vocab::FOAF.accountName, initiative.twitter])
        # end

        # if(initiative.facebook && !initiative.facebook.empty?)
        #   graph.insert([uri, ::RDF::Vocab::FOAF.account, facebook_uri])
        #   graph.insert([twitter_uri, ::RDF.type, "http://xmlns.com/foaf/0.1/OnlineAccount"])
        #   graph.insert([twitter_uri, ::RDF::Vocab::FOAF.accountServiceHomepage, "https://facebook.com/"])
        #   graph.insert([twitter_uri, ::RDF::Vocab::FOAF.accountName, initiative.facebook])
        # end

        if config.sameas.has_key? (uri_s)
          config.sameas[uri_s].each do |sameas_uri|
            graph.insert([uri, ::RDF::Vocab::OWL.sameAs, ::RDF::URI(sameas_uri)])
          end
        end

      end
      private
    end
  end
end


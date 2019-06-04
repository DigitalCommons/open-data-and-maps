# Here we define the standard column headings for CSV that we convert to Linked Data
#
# The symbols in these Headers hashes are used elsewhere in the SeOpenData library
# in order to address the data in a CSV file, with an extra level of indirection,
# removing the dependency on the text of the Column header.
# e.g. use 
#    SeOpenData::CSV::Standard::V1::Headers[:postcode]
# instead of
#    "Postcode"
#
# So don't mess with the symbol names!!

module SeOpenData
  module CSV
    module Standard
      module V1
        # Note - from ruby 1.9, keys and values are returned in insertion order,
        #        so the headers Hash also defines the ordering of the columns.
        Headers = {
          id: "Identifier",
          name: "Name",
          description: "Description",
          # The allowed values for legal_form are taken from essglobal.
          organisational_structure: "Organisational Structure",
          primary_activity: "Primary Activity",
          activities: "Activities",
          street_address: "Street Address",
          locality: "Locality",
          region: "Region",
          postcode: "Postcode",
          country_name: "Country Name",
          homepage: "Website",
          phone: "Phone",
          email: "Email",
          twitter: "Twitter",
          facebook: "Facebook",
          companies_house_number: "Companies House Number",

          # latitude and longitude are for the exact geolocation of the SSE initiative,
          # if it is known. 
          # If only a postcode is known, see geocontainer, below.
          latitude: "Latitude",
          longitude: "Longitude",

          # Often, we don't know the exact lat/long of an SSE initiative, but we know about 
          # a geographic container which has a known lat/long.
          # The most common example of this is the postcode as a geographic container.
          #
          # Note that the utility `bin/csv/standard/add-postcode-lat-long.rb` will populate
          # these 3 fields based on the value of the Postcode, so don't do it manually!
          # This is used, for example, in the toolchain for generating the co-ops-uk 2017 RDF.
          geocontainer: "Geo Container",
          geocontainer_lat: "Geo Container Latitude",
          geocontainer_lon: "Geo Container Longitude"
        }
        # Sometimes a single column can take values that are in fact a list.
        # So we need to know the character used to separate the items in the list.
        # For example, in the legal_form column, we might have an initiative that
        # is both a 'Cooperative' and a 'Company', the cell would then have the value "Cooperative;Company"
        SubFieldSeparator = ";"

        # Keys should provide unique access to the dataset (no dups)
        UniqueKeys = [:id]
      end
    end
  end
end

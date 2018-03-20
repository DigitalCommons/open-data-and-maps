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
	  legal_forms: "Legal Forms",
	  street_address: "Street Address",
	  locality: "Locality",
	  region: "Region",
	  postcode: "Postcode",
	  country_name: "Country Name",
	  homepage: "Website",
	  companies_house_number: "Companies House Number",

	  # Postcode location
	  # Don't add these columns by hand!
	  # Use bin/csv/standard/add-postcode-lat-long.rb to generate them from the postcode.
	  # TODO - generalise this to be about any containing geographic area to which the 'within'
	  # predicate can be applied.
	  geocontainer: "Geo Container",
	  geocontainer_lat: "Geo Container Latitude",
	  geocontainer_lon: "Geo Container Longitide"
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

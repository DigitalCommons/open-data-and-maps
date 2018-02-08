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
	  postcode: "Postcode",
	  homepage: "Website",
	  companies_house_number: "Companies House Number"
	}

	# Keys should provide unique access to the dataset (no dups)
	UniqueKeys = [:id]
      end
      module OsPostcodeUnit
	Headers = {
	  ospostcodeunit: "Postcode Unit",
	  latitude: "Postcode Latitude",
	  longitude: "Postcode Longitide"
	}
      end
      module V1WithOsPostcodeUnit
	Headers = V1::Headers.merge(OsPostcodeUnit::Headers)
      end
    end
  end
end

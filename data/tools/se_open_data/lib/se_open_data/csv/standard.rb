# Here we define the standard column headings for CSV that we convert to Linked Data

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

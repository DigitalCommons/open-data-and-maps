# Here we define the standard column headings for CSV that we convert to Linked Data

module SeOpenData
  module CSV
    module Standard
      # The order of the columns:
      HeadersV1 = [:id, :name, :postcode, :homepage, :companies_house_number]

      # Keys should provide unique access to the dataset (no dups)
      KeysV1 = [:id]

      # The text of each column:
      HeaderText = {
	id: "Identifier",
	name: "Name",
	postcode: "Postcode",
	homepage: "Website",
	companies_house_number: "Companies House Number"
      }
    end
  end
end

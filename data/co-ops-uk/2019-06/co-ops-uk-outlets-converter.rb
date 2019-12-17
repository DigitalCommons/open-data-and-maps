# This is the Converter for Co-ops UK 'outlets' CSV.
# It converts it into a CSV with standard column headings.

require 'se_open_data'

# This is the CSV standard that we're converting into:
OutputStandard = SeOpenData::CSV::Standard::V1

class CoopsUkOutletsReader < SeOpenData::CSV::RowReader
  # Headers in input CSV (with Hash key symbols matching Hash key symbols in output CSV Headers)
  InputHeaders = {
    # These symbols match symbols in OutputStandard::Headers.
    # So the corresponding cells with be copied fro inpiut to output:
    name: "Outlet Name",
    description: "Description",
    street_address: "Street",
    locality: "City",
    region: "State/Province",
    homepage: "Website",
    postcode: "Postcode",

    # These symbold don't match symbold in OutputStandard::Headers.
    # But CSV::RowReader creates method using these symbol names to read that colm from the row:
    org_id: "CUK Organisation ID"
  }
  def initialize(row)
    # Let CSV::RowReader provide methods for accessing columns described by InputHeaders, above:
    super(row, InputHeaders)
  end

  # Some columns in the output are not simple copies of input columns
  # Here are the methods for generating those output columns:
  # (So all method names below should aldo appear as keys in the output_headers Hash)
  def id
    # NB - If there is more than one co-op outlet with the same org_id and postcode,
    # the non-unique id created here will be fixed by a later process
    # (see bin/csv/standard/fix-duplicates.rb)
    "#{org_id}/#{postcode_normalized}"
  end
  def country_name
    # The co-ops UK outlet CSV data, unlike the co-ops UK organizations CSV data,
    # does not include the coiuntry name explicitly, so we just hard-code UK:
    "UK"
  end
  def legal_forms
    # Return a list of strings, separated by OutputStandard::SubFieldSeparator.
    # Each item in the list is a prefLabel taken from essglobal/standard/legal-form.skos.
    # See lib/se_open_data/essglobal/legal_form.rb
    #
    # This is Co-ops UK data, so we assume everything is a co-operative.
    "Cooperative"
  end
end

SeOpenData::CSV.convert(
  # Output:
  $stdout, OutputStandard::Headers,
  # Input:
  ARGF.read, CoopsUkOutletsReader, encoding: "ISO-8859-1"
)

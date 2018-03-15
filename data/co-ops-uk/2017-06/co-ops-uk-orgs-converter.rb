# This is the Converter for Co-ops UK 'outlets' CSV.
# It converts it into a CSV with standard column headings.

require 'se_open_data'

# This is the CSV standard that we're converting into:
OutputStandard = SeOpenData::CSV::Standard::V1

class CoopsUkOrgsReader < SeOpenData::CSV::RowReader
  # Headers in input CSV (with Hash key symbols matching Hash key symbols in output CSV Headers)
  InputHeaders = {
    # These symbols match symbols in OutputStandard::Headers.
    # So the corresponding cells with be copied fro inpiut to output:
    name: "Trading Name",
    postcode: "Registered Postcode",
    country_name: "UK Nation",
    id: "CUK Organisation ID",

    # These symbold don't match symbold in OutputStandard::Headers.
    # But CSV::RowReader creates method using these symbol names to read that colm from the row:
    registrar: "Registrar",
    registered_number: "Registered Number"
  }
  def initialize(row)
    # Let CSV::RowReader provide methods for accessing columns described by InputHeaders, above:
    super(row, InputHeaders)
  end
  # Some columns in the output are not simple copies of input columns:
  # Here are the methods for generating those output columns:
  # (So all method names below should aldo appear as keys in the output_headers Hash)
  def companies_house_number
    # Registered number with Companies House
    registrar == "Companies House" ? registered_number : nil
  end
  def legal_forms
    # Return a list of strings, separated by OutputStandard::SubFieldSeparator.
    # Each item in the list is a prefLabel taken from essglobal/standard/legal-form.skos.
    # See lib/se_open_data/essglobal/legal_form.rb
    [
      "Cooperative", 
      registrar == "Companies House" ? "Company" : nil
    ].compact.join(OutputStandard::SubFieldSeparator)
  end
end

# Convert to CSV with OutputStandard::Headers.
# OutputStandard::Headers is a Hash of <symbol, headerString>
# The values for each header <symbol, string> in OutputStandard::Headers are taken from either:
#   Looking up row[inputHeaderString] in the input CSV, where inputHeaderString = CoopsUkOrgsReader::InputHeaders[symbol], or
#   The return value of the method in CoopsUkOrgsReader whose name is symbol, or
#   Empty if neither of the above apply.
 
SeOpenData::CSV.convert(
  # Output:
  $stdout, OutputStandard::Headers,
  # Input:
  ARGF.read, CoopsUkOrgsReader, encoding: "ISO-8859-1"
)

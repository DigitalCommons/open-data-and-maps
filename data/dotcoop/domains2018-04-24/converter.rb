# This is the Converter for Co-ops UK 'outlets' CSV.
# It converts it into a CSV with standard column headings.

require 'se_open_data'

# This is the CSV standard that we're converting into:
OutputStandard = SeOpenData::CSV::Standard::V1

class DotCoopV1Reader < SeOpenData::CSV::RowReader
  # Headers in input CSV (with Hash key symbols matching Hash key symbols in output CSV Headers)
  InputHeaders = {
    # These symbols match symbols in OutputStandard::Headers.
    # So the corresponding cells with be copied fro inpiut to output:
    name: "Name",
    postcode: "Postcode",
    country_name: "UK Nation",

    # These symbols don't match symbols in OutputStandard::Headers.
    # But CSV::RowReader creates method using these symbol names to read that column from the row:
    #registrar: "Registrar",
    #registered_number: "Registered Number"
    domain: "Domain",
  }
  def initialize(row)
    # Let CSV::RowReader provide methods for accessing columns described by InputHeaders, above:
    super(row, InputHeaders)
  end
  # Some columns in the output are not simple copies of input columns:
  # Here are the methods for generating those output columns:
  # (So all method names below should aldo appear as keys in the output_headers Hash)
  def id
    raise(SeOpenData::Exception::IgnoreCsvRow, "\"Domain\" column is empty") unless domain
    domain.sub(/\.coop$/, "")
  end
  def homepage
    raise(SeOpenData::Exception::IgnoreCsvRow, "\"Domain\" column is empty") unless domain
    domain
  end
  def legal_forms
    # Return a list of strings, separated by OutputStandard::SubFieldSeparator.
    # Each item in the list is a prefLabel taken from essglobal/standard/legal-form.skos.
    # See lib/se_open_data/essglobal/legal_form.rb
    [
      "Cooperative"
    ].compact.join(OutputStandard::SubFieldSeparator)
  end
  
end

# Convert to CSV with OutputStandard::Headers.
# OutputStandard::Headers is a Hash of <symbol, headerString>
# The values for each header <symbol, string> in OutputStandard::Headers are taken from either:
#   Looking up row[inputHeaderString] in the input CSV, where inputHeaderString = DotCoopV1Reader::InputHeaders[symbol], or
#   The return value of the method in DotCoopV1Reader whose name is symbol, or
#   Empty if neither of the above apply.
 
SeOpenData::CSV.convert(
  # Output:
  $stdout, OutputStandard::Headers,
  # Input:
  ARGF.read, DotCoopV1Reader, encoding: "UTF-8"
  #ARGF.read, DotCoopV1Reader, {}
)

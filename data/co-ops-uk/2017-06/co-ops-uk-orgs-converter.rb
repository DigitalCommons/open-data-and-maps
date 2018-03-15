# This is the Converter for Co-ops UK 'outlets' CSV.
# It converts it into a CSV with standard column headings.

require 'se_open_data'

OutputStandard = SeOpenData::CSV::Standard::V1
class CoopsUkOrgsReader < SeOpenData::CSV::RowReader
  # Headers in input CSV (with Hash key symbols matching Hash key symbols in output CSV Headers)
  InputHeaders = {
    name: "Trading Name",
    postcode: "Registered Postcode",
    country_name: "UK Nation",
    id: "CUK Organisation ID"
    # TODO - consider adding other Headers, e.g. 
    # registrar: "Registrar"
    # and then using the generated methods from RowReader to read these.
    # This should be fine, provide we choose symbols that don't class with those 
    # in OutputStandard::Headers for which a method is provided below.
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
    row["Registrar"] == "Companies House" ? row["Registered Number"] : nil
  end
  def legal_forms
    [
      "Cooperative", 
      row["Registrar"] == "Companies House" ? "Company" : nil
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

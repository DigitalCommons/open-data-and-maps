# This is the Converter for Co-ops UK 'outlets' CSV.
# It converts it into a CSV with standard column headings.

require 'se_open_data'

class CoopsUkOutletsReader < SeOpenData::CSV::RowReader
  # For each symbol S in output_headers, the class determines how that output column is populated:
  # EITHER:
  #   This class provides a method with the same name as the symbol S, and the method S provides the value.
  # OR:
  #   The symbol S is also a key of the CsvHeaders hash, in which case the output column
  #   is populated from the input column with header the same as the corresponding value in the CsvHeader Hash.
  # OR:
  #   If neither of the above, then that column in the output will contain empty strings.
  CsvHeaders = {
    name: "Outlet Name",
    homepage: "Website",
    postcode: "Postcode"
  }
  def initialize(row)
    super(row, CsvHeaders)
  end
  # Some columns in the output are not simple copies of input columns
  # Here are the methods for generating those output columns:
  # (So all method names below should aldo appear as keys in the output_headers Hash)
  def id
    row["CUK Organisation ID"] + postcode_normalized
  end
  def country_name
    # The co-ops UK outlet CSV data, unlike the co-ops UK organizations CSV data,
    # does not include the coiuntry name explicitly, so we just hard-code UK:
    "UK"
  end
end

SeOpenData::CSV.convert(
  # Output:
  $stdout, SeOpenData::CSV::Standard::V1::Headers,
  # Input:
  ARGF.read, CoopsUkOutletsReader, encoding: "ISO-8859-1"
)

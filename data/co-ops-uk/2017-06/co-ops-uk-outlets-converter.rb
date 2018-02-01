# This is the Converter for Co-ops UK 'outlets' CSV.
# It converts it into a CSV with standard column headings.

require_relative '../../lib/csv-converter'

class CoopsUkOutletsReader < SeOpenData::CsvRowReader
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
end
output_headers = SeOpenData::CsvConverter::StandardHeadersV1
csv_converter = SeOpenData::CsvConverter.new(output_headers)
csv_converter.convert(CoopsUkOutletsReader, encoding: "ISO-8859-1")

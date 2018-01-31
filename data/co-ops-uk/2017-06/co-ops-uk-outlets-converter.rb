# This is the Converter for Co-ops UK 'outlets' CSV.
# It converts it into a CSV with standard column headings.

require_relative '../../lib/csv-converter'

class CoopsUkOutletsReader < SeOpenData::CsvRowReader
  # Some columns in the output are simple copies of input columns:
  # The keys of CsvHeaders should also exist in the headers of the CSV that is created
  # by the CsvConverter (i.e. in output_headers). 
  # The values of CsvHeaders are the column headings of the input CSV
  # The values of output_headers are the column headings of the output CSV
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
csv_converter = SeOpenData::CsvConverter.new(ARGV, output_headers)
csv_converter.convert(CoopsUkOutletsReader, encoding: "ISO-8859-1")

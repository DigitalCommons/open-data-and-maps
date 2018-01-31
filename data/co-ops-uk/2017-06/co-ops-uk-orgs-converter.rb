require_relative '../../lib/csv-converter'

class CoopsUkOrgsReader < SeOpenData::CsvRowReader
  # Some columns in the output are simple copies of input columns:
  # The keys of CsvHeaders should also exist in the headers of the CSV that is created
  # by the CsvConverter (i.e. in output_headers). 
  # The values of CsvHeaders are the column headings of the input CSV
  # The values of output_headers are the column headings of the output CSV
  CsvHeaders = {
    name: "Trading Name",
    postcode: "Registered Postcode",
    id: "CUK Organisation ID"
  }
  def initialize(row)
    super(row, CsvHeaders)
  end
  # Some columns in the output are not simple copies of input columns:
  # Here are the methods for generating those output columns:
  # (So all method names below should aldo appear as keys in the output_headers Hash)
  def companies_house_number
    # Registered number with Companies House
    row["Registrar"] == "Companies House" ? row["Registered Number"] : nil
  end
end
output_headers = SeOpenData::CsvConverter::StandardHeadersV1
csv_converter = SeOpenData::CsvConverter.new(ARGV, output_headers)
csv_converter.convert(CoopsUkOrgsReader, encoding: "ISO-8859-1")


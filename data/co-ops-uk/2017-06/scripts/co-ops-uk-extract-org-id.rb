
require 'se_open_data'

class CsvFilter < SeOpenData::CSV::RowReader
  OutputHeaders = {
    org_id: "CUK Organisation ID"
  }
  CsvHeaders = {
    org_id: "CUK Organisation ID"
  }
  def initialize(row)
    super(row, CsvHeaders)
  end
end

SeOpenData::CSV.convert(
  # Output:
  $stdout, CsvFilter::OutputHeaders,
  # Input:
  ARGF.read, CsvFilter, encoding: "ISO-8859-1"
)


require 'se_open_data'

class CsvFilter < SeOpenData::CSV::RowReader
  OutputHeaders = {
    org_id: "Registrar"
  }
  CsvHeaders = {
    org_id: "Registrar"
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

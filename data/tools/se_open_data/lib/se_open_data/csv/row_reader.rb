# This is used as a super-class  for a class that reads CSV.
#
module SeOpenData
  module CSV
    class RowReader
      attr_reader :row, :headers
      def initialize(row, headers)
	@row, @headers = row, headers
      end
      def postcode_normalized
	postcode.upcase.gsub(/\s+/, "")
      end
      def method_missing(method, *args, &block)
	@headers.keys.include?(method) ?  @row[@headers[method]] : nil
      end
    end
  end
end

__END__

The use of this is best illustrated by example:

require_relative '../../../lib/se-open-data/csv/standard'
require_relative '../../../lib/se-open-data/csv/convert'
require_relative '../../../lib/se-open-data/csv/row-reader'

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
end

SeOpenData::CSV.convert(
  # Output:
  $stdout, SeOpenData::CSV::Standard::V1::Headers,
  # Input:
  ARGF.read, CoopsUkOutletsReader, encoding: "ISO-8859-1"
)

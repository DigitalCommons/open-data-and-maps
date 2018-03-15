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

The use of this is best illustrated by example. See co-ops-uk-orgs-converter.rb

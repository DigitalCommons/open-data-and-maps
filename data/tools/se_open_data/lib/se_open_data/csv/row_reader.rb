# This is used as a super-class  for a class that reads CSV.
#
module SeOpenData
  module CSV
    class RowReader
      attr_reader :row, :headers
      def initialize(row, headers)
        @row, @headers = row, headers
        @comments = []
      end
      def postcode_normalized
        return "" unless postcode
        postcode.upcase.gsub(/\s+/, "")
      end
      def method_missing(method, *args, &block)
        @headers.keys.include?(method) ?  @row[@headers[method]] : nil
      end
      def add_comment(comment)
        @comments << comment
      end
      def row_with_comments
        new_row = ::CSV::Row.new(row.headers(), row.fields)
        new_row << @comments.join("\n")
      end
    end
  end
end

__END__

The use of this is best illustrated by example. See co-ops-uk-orgs-converter.rb

module SeOpenData
  class Initiative
    class Collection < Array
      def initialize
	super
      end
      def add_from_csv(input_io, headers, csv_opts = {})
	# The way this works is based on having column headings:
	csv_opts.merge!(headers: true)
	csv_in = ::CSV.new(input_io, csv_opts)
	csv_in.each {|row|
	  push Initiative.new(CSV::RowReader.new(row, headers))
	}
	self
      end
    end
  end
end


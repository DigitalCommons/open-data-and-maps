module SeOpenData
  class Initiative
    class Collection < Array
      attr_reader :config
      def initialize(config)
	@config = config
	@graph = nil
	super()
      end
      def rdf
	@rdf ||= RDF::new(self, config)
      end
      def add_from_csv(input_io, headers, csv_opts = {})
	# The way this works is based on having column headings:
	csv_opts.merge!(headers: true)
	csv_in = ::CSV.new(input_io, csv_opts)
	csv_in.each {|row|
	  push Initiative.new(config, CSV::RowReader.new(row, headers))
	}
	self
      end
    end
  end
end


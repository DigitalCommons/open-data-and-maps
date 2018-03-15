module SeOpenData
  class Initiative
    class Collection < Array
      attr_reader :config
      def initialize(config)
	@config = config
	@graph = nil	# Huh? What's this for?
	super()
      end
      def rdf
	@rdf ||= RDF::new(self, config)
      end
      def add_from_csv(input_io, csv_opts = {})
	# The way this works is based on having column headings:
	csv_opts.merge!(headers: true)
	csv_in = ::CSV.new(input_io, csv_opts)
	csv_in.each {|row|
	  push Initiative.new(config, CSV::RowReader.new(row, @config.csv_standard::Headers))
	}
	self
      end
      def serialize_everything(outdir)
	# Create RDF for each initiative
	counter = SeOpenData::Utils::ProgressCounter.new("Saving RDF files for each initiative", size)
	each {|initiative|

	  initiative.rdf.save_rdfxml($options.outdir)
	  initiative.rdf.save_turtle($options.outdir)
	  counter.step
	}
	rdf.save_index_rdfxml($options.outdir)
	rdf.save_index_turtle($options.outdir)
	rdf.save_one_big_rdfxml($options.outdir)
	rdf.save_one_big_turtle($options.outdir)
      end
    end
  end
end


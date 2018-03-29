module SeOpenData
  class Initiative
    class Collection < Array
      OneBigFileBasename = "all"
      IndexBasename = "index"
      attr_reader :config
      def initialize(config)
	@config = config
	@graph = nil	# Huh? What's this for?
	super()
      end
      def html
	@html ||= HTML::new(self, config)
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
	  initiative.html.save($options.outdir)
	  counter.step
	}
	rdf.save_index_rdfxml($options.outdir)
	rdf.save_index_turtle($options.outdir)
	rdf.save_one_big_rdfxml($options.outdir)
	rdf.save_one_big_turtle($options.outdir)
	html.save($options.outdir)
      end
      def index_filename(outdir, ext)
	outdir + IndexBasename + ext
      end
      def one_big_filename(outdir, ext)
	outdir + OneBigFileBasename + ext
      end
    end
  end
end


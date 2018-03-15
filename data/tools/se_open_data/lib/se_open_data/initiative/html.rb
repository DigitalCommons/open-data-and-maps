# Generating HTML for initiatives


module SeOpenData
  class Initiative
    class HTML
      attr_reader :initiative, :config
      def initialize(initiative, config)
	@initiative, @config = initiative, config
      end
      def save(outdir)
	fname = File.name(initiative.id, outdir, ".html")
	::File.open(fname, "w") {|f|
	  f.write(html)
	}
      end
      def html
	"<html></html>"
      end
    end
  end
end


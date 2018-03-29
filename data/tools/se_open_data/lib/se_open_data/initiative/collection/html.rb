module SeOpenData
  class Initiative
    class Collection
      class HTML
	include SeOpenData::Utils::Xml	# for method xml()
	include SeOpenData::Utils::Html
	attr_reader :collection, :config
	def initialize(collection, config)
	  @collection, @config = collection, config
	end
	def save(outdir)
	  fname = collection.index_filename(outdir, ".html")
	  ::File.open(fname, "w") {|f| f.write(html(outdir)) }
	end
	def html(outdir)
	  "<!DOCTYPE html>\n" + 
	    xml(:html) {
	    xml(:head) {
	      xml(:title) { "TODO: config title" }
	    } +
	    xml(:body) {
	      xml(:h1) { "TODO: config title" }
	    }
	  }
	end
      end
    end
  end
end

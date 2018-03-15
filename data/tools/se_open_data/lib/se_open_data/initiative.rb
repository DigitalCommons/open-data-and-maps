module SeOpenData
  class Initiative
    attr_reader :config
    def initialize(config, csv_row)
      @config, @csv_row = config, csv_row
    end
    def rdf
      @rdf ||= RDF::new(self, config)
    end
    def html
      @html ||= HTML::new(self, config)
    end
    def method_missing(method, *args, &block)
      @csv_row.send(method, *args)
    end
  end
end

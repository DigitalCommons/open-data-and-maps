module SeOpenData
  class Initiative
    def initialize(csv_row)
      @csv_row = csv_row
    end
    def self.from_csv(row)
      new(row)
    end
    def method_missing(method, *args, &block)
      @csv_row.send(method, *args)
    end
  end
end

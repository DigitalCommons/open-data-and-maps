require 'linkeddata'

module SeOpenData
  module CSV
    def CSV.create_sameas_from_csv(input_io, output_io, headers, csv_opts = {})
      csv_opts.merge!(headers: true)
      csv_in = ::CSV.new(input_io, csv_opts)

      pairs = csv_in.map { |row| [row[headers[0]], row[headers[1]]] }
      graph = RDF.create_sameas_graph(pairs)

      output_io.puts ::RDF::Turtle::Writer.buffer(standard_prefixes: true) {|writer|
        graph.each_statement do |statement|
          writer << statement
        end

        #writer << graph
      }
    end
  end
end


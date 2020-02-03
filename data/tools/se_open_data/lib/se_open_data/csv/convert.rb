#  SeOpenData::CSV.convert converts a CSV into a new CSV with diffent columns

require 'pp'
require 'csv'

module SeOpenData
  module CSV
    @@report_csv = nil
    @@report_csv_filename = nil
    def self.set_csv_comment_filename(filename)
      # if called, then a CSV file will be generated with the same content as 
      # the input CSV, but with an extra column of comments added.
      # Comments can be added using the add_comment method (grep for it for examples!)
      @@report_csv_filename = filename
      @@report_csv = ::CSV::open(filename, "wb")
    end
    def CSV.convert(output_io, output_headers, input_io, csv_row_reader, csv_opts = {})
      # The way this works is based on having column headings:
      csv_opts.merge!(headers: true, skip_blanks: true)

      # If it's there, strip BOM from utf8
      input_io.delete!("\xEF\xBB\xBF")

      csv_in = ::CSV.new(input_io, csv_opts)
      csv_out = ::CSV.new(output_io)
      csv_out << output_headers.values

      if @@report_csv
        csv_in.shift
        # Report CSV has the same headers at the input:
        @@report_csv << csv_in.headers()
        csv_in.rewind
      end

      csv_in.reject {
        |row| row.to_hash.values.all?(&:nil?)
      }.each do |row|
        begin
          # An empty column in the first row of the CSV (the headers row) will
          # result in a header with value nil. So, use compact:
          # row.headers.compact.each {|h|
          #   if row[h]
          #     # Change encoding! This is a workaround for a problem that emerged when processing the orgs_csv file.
          #     #row.headers.each {|h| row[h].encode!(Encoding::ASCII_8BIT) unless row[h].nil? }
          #     # Why does it not work with UTF-8?  UPDATE - seems to work with UTF-8 for 2017 data.
          #     #
          #     # UPDATE: See issue https://github.com/SolidarityEconomyAssociation/open-data-and-maps/issues/57
          #     #         More investigation is needed to get to the bottom of this.
          #     if row[h].encoding != Encoding::UTF_8
          #       puts "ENCODING: #{row[h].encoding}"
          #     end
          #     row[h].encode!(Encoding::UTF_8) unless row[h].nil?
          #   end
          # }
          # Create an object to read and transform the row.
          # It provides methods that have the same name as the keys in the output_headers Hash,
          # so that the output row can be populated by calling the method that corresponds
          # to the header of each column in the output.
          r = csv_row_reader.new(row)
          if csv_row_reader.method_defined? :pre_flight_checks
            r.pre_flight_checks
          end
          csv_out << output_headers.keys.map {
            |h| r.send(h)
          }

        rescue SeOpenData::Exception::IgnoreCsvRow => e
          $stderr.puts "Ignoring row: #{e.message}:\n#{row}\n"
          r.add_comment("Ignoring row: #{e.message}")

        rescue StandardError => e # includes ArgumentError, RuntimeError, and many others.
          warning(["Could not create Initiative from CSV: #{e.message}", "The following row from the CSV data will be ignored:", row.to_s])
          raise
        ensure
          if @@report_csv
            # Add a row to the report CSV that includes any comments (see add_comment).
            # Note: comments can be added in the methods of the csv_row_reader. 
            @@report_csv << r.row_with_comments
          end

        end
      end
      if @@report_csv_filename
        $stderr.puts "Comments have been added to #{@@report_csv_filename}"
      end
    end
    def CSV.warning(msgs)
      msgs = msgs.kind_of?(Array) ? msgs : [msgs]
      $stderr.puts msgs.map{|m| "\nWARNING! #{m}"}.join 
    end
  end
end

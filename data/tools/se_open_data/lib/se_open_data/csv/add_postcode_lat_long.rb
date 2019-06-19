
def uk_postcode?(s)
  uk_postcode_regex = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/
  uk_postcode_regex.match(s)
end

# OX1 = 51.75207,-1.25769
# OX2 = 

module SeOpenData
  module CSV
    def CSV.add_postcode_lat_long(input_io, output_io, input_csv_postcode_header, new_headers, postcodeunit_cache, csv_opts = {})
      csv_opts.merge!(headers: true)
      csv_in = ::CSV.new(input_io, csv_opts)
      csv_out = ::CSV.new(output_io)
      postcode_client = SeOpenData::RDF::OsPostcodeUnit::Client.new(postcodeunit_cache)
      headers = nil
      #row_count = csv_in.count
      #csv_in.rewind    # needed after the count
      #prog_ctr = P6::ProgressCounter.new("Saving map-app data to #{map_app_json_file} ... ", collection.size)

      csv_in.each do |row|
        unless headers
          headers = row.headers + new_headers.values.reject {|h| row.headers.include? h }
          csv_out << headers
        end
        # Only run if matches uk postcodes
        postcode = row[input_csv_postcode_header]
        if uk_postcode?(postcode)
          pcunit = postcode_client.get(postcode)
          loc_data = {
            geocontainer: pcunit ? pcunit[:within] : nil,
            geocontainer_lat: pcunit ? pcunit[:lat] : nil,
            geocontainer_lon: pcunit ? pcunit[:lng] : nil
          }
          new_headers.each {|k, v|
              row[v] = loc_data[k]
          }
        end
        csv_out << row
      end
    end
  end
end

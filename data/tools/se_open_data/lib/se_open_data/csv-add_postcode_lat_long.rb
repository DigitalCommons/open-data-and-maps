
module SeOpenData
  module CSV
    def CSV.add_postcode_lat_long(input_io, output_io, input_headers, new_headers, postcodeunit_cache, csv_opts = {})
      csv_opts.merge!(headers: true)
      csv_in = ::CSV.new(input_io, csv_opts)
      csv_out = ::CSV.new(output_io)
      postcode_client = SeOpenData::RDF::OsPostcodeUnit::Client.new(postcodeunit_cache)
      headers = nil
      #row_count = csv_in.count
      #csv_in.rewind	# needed after the count
      #prog_ctr = P6::ProgressCounter.new("Saving map-app data to #{map_app_json_file} ... ", collection.size)

      csv_in.each do |row|
	unless headers
	  headers = row.headers + new_headers.values
	  csv_out << headers
	end
	pcunit = postcode_client.get(row[input_headers[:postcode]])
	row << {
	  new_headers[:ospostcodeunit] => pcunit ? pcunit[:within] : nil,
	  new_headers[:latitude] => pcunit ? pcunit[:lat] : nil,
	  new_headers[:longitude] => pcunit ? pcunit[:lng] : nil
	}
	csv_out << row
      end
    end
  end
end

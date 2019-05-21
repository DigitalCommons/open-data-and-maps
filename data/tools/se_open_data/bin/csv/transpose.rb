#!/usr/bin/env ruby
require 'csv'
require 'pp'

# Transpose a CSV file
def transpose(input_io, output_io)
  csv_opts = {}
  csv_in = ::CSV.new(input_io, csv_opts)
  csv_out = ::CSV.new(output_io)

  csv_in.readlines().transpose.each {|trow| csv_out << trow}
end
transpose(ARGF.read, $stdout)

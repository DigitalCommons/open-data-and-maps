#!/usr/bin/env ruby
require 'csv'
require 'pp'

# Transpose a CSV file
def transpose(input_io, output_io, csv_opts = {})

  # See https://stackoverflow.com/a/30103307/685715:
  Signal.trap("SIGPIPE", "SYSTEM_DEFAULT")

  csv_in = ::CSV.new(input_io, csv_opts)
  csv_out = ::CSV.new(output_io)

  csv_in.readlines().transpose.each {|trow| csv_out << trow}
end
transpose(ARGF.read, $stdout)

require 'json'
require 'pp'

$json_file = ARGV[0]

$json = IO.read($json_file)

#puts $json

begin
  $res = JSON.parse($json)
rescue JSON::ParserError => e
  pp e
end

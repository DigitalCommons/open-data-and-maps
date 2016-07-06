require 'pp'
require 'json'

initiatives_file, osres_file = ARGV

inf = File.open(initiatives_file, "rb")
inarray = JSON.parse(inf.read)
#pp inarray
osres = {}
inarray.each{|x| 
  #pp x
  osres[x["loc_uri"]] = [x["lat"], x["lng"]]
}
File.open(osres_file, "w") {|f| f.write(JSON.pretty_generate(osres))}



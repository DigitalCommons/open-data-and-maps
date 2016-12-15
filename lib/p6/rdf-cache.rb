# This is motivated initially by the need to cache the lat/long results about postcodeunits.
#

require 'pp'
require 'json'
require 'linkeddata'
require 'rdf'
require 'net/http'
require 'objspace'

class RdfCache
  Failure_value = 0	# value stored in cache when query fails
  def initialize(cache_file, query_hash)
    # Example
    #  rdf_cache = RdfCache.new("os_postcode_cache.json", {
    #    lat: "http://www.w3.org/2003/01/geo/wgs84_pos#lat",
    #    lng: "http://www.w3.org/2003/01/geo/wgs84_pos#long"
    #  })

    @cache_file, @query_hash = cache_file, query_hash

    # Make the RDF::Query. 
    # For example, with the above parameters, the query would look like this:
    #  query = RDF::Query.new({
    #    :stuff => {
    #      RDF::URI("http://www.w3.org/2003/01/geo/wgs84_pos#lat") => :lat,
    #      RDF::URI("http://www.w3.org/2003/01/geo/wgs84_pos#long") => :lng
    #    }
    #  })
    @rdf_query = RDF::Query.new({stuff: Hash[query_hash.map {|k,v| [RDF::URI(v), k]}]})

    begin
      File.open(cache_file, "rb") {|f|
	@cache_hash = JSON.parse(f.read)
      }
    rescue => e
      $stderr.puts "Failed to read #{cache_file}: #{e.message}"
      $stderr.puts "Creating empty cache."
      @cache_hash = {}
    end
    puts "Initial cache: "
    pp @cache_hash
    ObjectSpace.define_finalizer(self, proc {|id| self.destructor})
  end
  def destructor
    puts "destructor"
    save_cache unless @cache_hash.empty?
  end
  def save_cache
    File.open(@cache_file, "w") {|f| f.write(JSON.pretty_generate(@cache_hash))}
  end
  def get(subject_uri)
    # Returns a Results object, or nil if the query fails
    key = subject_uri.to_s
    if @cache_hash[key] == nil
      # key not found in cache_hash, so we need to query it.
      begin
	graph = RDF::Graph.new
	graph.load(subject_uri)
	res = @rdf_query.execute(graph)
	raise "No results from query" if res.size < 1
	$stderr.puts "Expected 1 result from query of #{key}. Found #{res.size} results. Ignoring all but first." if res.size > 1
	pp res
	#pp res[0].to_hash
	# The data for this subject is stored in a hash
	result = {}

	@query_hash.keys.each {|k|
	  field = result[k.to_s] = {}
	  field["value"] = res[0][k].to_s

	  if res[0][k].literal? 

	    field["type"] = "literal"
	    if (res[0][k].literal? && res[0][k].has_datatype?)
	      field["datatype"] = res[0][k].datatype.to_uri.to_s
	    end
	    if (res[0][k].literal? && res[0][k].has_language?)
	      field["language"] = res[0][k].language.to_uri.to_s
	    end

	  elsif res[0][k].uri? 

	    field["type"] = "uri"

	  else
	    raise "Unexpected type of Term - we need to implement more types"
	  end
	}
	puts "Just loaded data from network: "
	pp result
	@cache_hash[key] = result
      rescue => e
	$stderr.puts "Failed to load resource #{key}: #{e.message}"
	@cache_hash[key] = Failure_value
      end
    end
    return (@cache_hash[key] == Failure_value) ? nil : Results.new(@cache_hash[key])
  end
  class Results
    # Results for all fields in the @query_hash
    # Access the result for one field by using that field's symbolic name as a method
    def initialize(h)
      @res = h
    end
    def method_missing(m)
      x = @res[m.to_s]
      if x
	return Result.new(x)
      else
	raise "Unknown method '#{m}' in Results class. Try one of these: #{@res.keys.map{|x| x.to_sym}}"
      end
    end
  end
  class Result
    Methods = [:value, :datatype, :type, :language]
    def initialize(x)
      @x = x
    end
    def method_missing(m)
      if Methods.include?(m)
	return @x[m.to_s]
      else
	raise "Unknown method '#{m}' in Result class. Try one of these: #{Methods}"
      end
    end
  end
end

def test(cache_file, query, test_data)
  rdf_cache = RdfCache.new(cache_file, query)
  test_data.each {|s|
    res = rdf_cache.get(RDF::URI(s))
    puts "Result returned by get(#{s}):"
    pp res
  }
end
def test1
  test("foo.json", {
    lat: "http://www.w3.org/2003/01/geo/wgs84_pos#lat",
    lng: "http://www.w3.org/2003/01/geo/wgs84_pos#long"
  },
  [
    "http://data.ordnancesurvey.co.uk/id/postcodeunit/PE37PR",
    "http://data.ordnancesurvey.co.uk/id/postcodeunit/JE24TR"
  ])

  test("bar.json", {
    ward:  "http://data.ordnancesurvey.co.uk/ontology/postcode/ward"
  },
  [
    "http://data.ordnancesurvey.co.uk/id/postcodeunit/PE37PR",
    "http://data.ordnancesurvey.co.uk/id/postcodeunit/JE24TR"
  ])
end
def test2
  cache_file = "foo.json"
  query = {
    lat: "http://www.w3.org/2003/01/geo/wgs84_pos#lat",
    lng: "http://www.w3.org/2003/01/geo/wgs84_pos#long"
  }
  test_data =
  [
    "http://data.ordnancesurvey.co.uk/id/postcodeunit/PE37PR",
    "http://data.ordnancesurvey.co.uk/id/postcodeunit/JE24TR"
  ]
  rdf_cache = RdfCache.new(cache_file, query)
  test_data.each {|s|
    res = rdf_cache.get(RDF::URI(s))
    puts "Result returned by get(#{s}):"
    pp res
    if res
      puts "lat: #{res.lat.value} #{res.lat.type} #{res.lat.datatype} #{res.lat.language}"
      puts "lng: #{res.lng.value} #{res.lng.type} #{res.lng.datatype} #{res.lng.language}"
    end
  }
end
test1
test2

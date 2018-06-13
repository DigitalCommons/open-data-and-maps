require 'json'
require 'pp'

res = JSON.parse(ARGF.read)

class PropertyAgregator
  def initialize(features)
    # We want to create a Hash of all of the different properties,
    # with property name as key, and as a value for that key and array of all of the unique values
    # for that property.
    agg = Hash.new {|h, k| h[k] = [] }
    features.each {|f|
      f["properties"].each {|k, v|
        agg[k] << v
      }
    }
    @res = Hash[agg.map{|k, v| [k, v.uniq]}]
    @res = Hash[
      agg.map{|k, v|
        [
          k, Hash[
            v.uniq.map {|e| [e, v.count(e)]}
          ]
        ]
      }
    ]
  end
  def res
    @res
  end
end
agg = PropertyAgregator.new(res["features"])
#pp agg.res.keys
#puts res.keys
#res["features"].each {|f|
#puts f.keys
#pp f
#exit
#}
pp agg.res

# This is the Converter for Co-ops UK 'outlets' CSV.
# It converts it into a CSV with standard column headings.

require 'se_open_data'

# This is the CSV standard that we're converting into:
OutputStandard = SeOpenData::CSV::Standard::V1

def uk_postcode?(s)
  uk_postcode_regex = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/
  uk_postcode_regex.match(s)
end

def domain_to_homepage(domain)  # UNUSED
  # WARNING: This is a time-consuming operation
  # I expect it could be sped up considerably using Curl::Multi (see https://github.com/taf2/curb)
  $stderr.puts "Finding effective URL for domain #{domain}"
  effective_url = `curl -Ls -o /dev/null --max-time 10 -w %{url_effective} http://#{domain}`
  $stderr.puts "effective URL: #{effective_url}"
  res = nil
  if effective_url && !effective_url.empty?
    res = system("curl --output /dev/null --max-time 10 --silent --head --fail #{effective_url}") ? effective_url : nil
    if res
      $stderr.puts "URL OK: #{effective_url}"
    else
      $stderr.puts "URL not found: #{effective_url}"
    end
  end
  res
end
class DotCoopV1Reader < SeOpenData::CSV::RowReader
  # Headers in input CSV (with Hash key symbols matching Hash key symbols in output CSV Headers)
  InputHeaders = {
    # These symbols match symbols in OutputStandard::Headers.
    # So the corresponding cells with be copied fro inpiut to output:
    name: "Company",
    street_address: "Address",
    description: "Details",

    # These symbols don't match symbols in OutputStandard::Headers.
    # But CSV::RowReader creates method using these symbol names to read that column from the row:
    #registrar: "Registrar",
    #registered_number: "Registered Number"
    website: "Website",
  }
  def initialize(row)
    # Let CSV::RowReader provide methods for accessing columns described by InputHeaders, above:
    super(row, InputHeaders)
  end
  def pre_flight_checks
    unless description || website || street_address
      raise(SeOpenData::Exception::IgnoreCsvRow, "Nothing in Details, Address, or Website")
    end
  end
  # Some columns in the output are not simple copies of input columns:
  # Here are the methods for generating those output columns:
  # (So all method names below should aldo appear as keys in the output_headers Hash)
  def id
    raise(SeOpenData::Exception::IgnoreCsvRow, "\"Company\" column is empty") unless name

    name.gsub(/[^0-9a-z]/i, '')
  end
  def homepage
    if website
      regex = /https?\S+/
      m = regex.match(website)
      if m
        m[0]
      else
        add_comment("This doesn't look like a website: #{website} (Maybe it's missing the http:// ?)")
        nil
      end
    else
      nil
    end
  end
  def postcode
    if street_address.nil?
      add_comment("There's no Address, so we can't get the postcode in order to guess a location, so this won't appear on the map")
      nil
    else
      last_line = street_address.rstrip.split("\n").last
      postcode = last_line.upcase.gsub(/[^A-Z0-9 ]/, "")
      add_comment("Trying to get postcode from last line of Address, but it doesn't look like a postcode: #{last_line}") unless uk_postcode?(postcode)
      postcode
    end
  end
  #def legal_forms       # UNUSED
    ## Return a list of strings, separated by OutputStandard::SubFieldSeparator.
    ## Each item in the list is a prefLabel taken from essglobal/standard/legal-form.skos.
    ## See lib/se_open_data/essglobal/legal_form.rb
    #[
      #"Cooperative"
    #].compact.join(OutputStandard::SubFieldSeparator)
  #end
  
end

# Convert to CSV with OutputStandard::Headers.
# OutputStandard::Headers is a Hash of <symbol, headerString>
# The values for each header <symbol, string> in OutputStandard::Headers are taken from either:
#   Looking up row[inputHeaderString] in the input CSV, where inputHeaderString = DotCoopV1Reader::InputHeaders[symbol], or
#   The return value of the method in DotCoopV1Reader whose name is symbol, or
#   Empty if neither of the above apply.
 
SeOpenData::CSV.set_csv_comment_filename("input_csv_with_comments.csv")
SeOpenData::CSV.convert(
  # Output:
  $stdout, OutputStandard::Headers,
  # Input:
  #ARGF.read, DotCoopV1Reader, encoding: "UTF-8"
  ARGF.read, DotCoopV1Reader, {}
)

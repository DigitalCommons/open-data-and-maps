# This is the Converter for Oxford LimeSurvey raw output CSV.
# It converts it into a CSV with standard column headings.

# $LOAD_PATH.unshift '/Volumes/Extra/SEA-dev/open-data-and-maps/data/tools/se_open_data/lib'
require 'se_open_data'

# EXPECTS the name of the report CSV file to be provided as a simple argument:
ReportCsv = ARGV.shift
# ReportCsv = "/Volumes/Extra/SEA-dev/open-data-and-maps/data/oxford/pilot/generated-data/experimental/csv/report.csv"
$stderr.puts "A report will be written to #{ReportCsv}"

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

# Headers in input CSV:
# Response ID,Name,Street,Town,Postcode,Email,Phone,Website,Facebook,Twitter,Legal forms,Activities

class SpecializedCsvReader < SeOpenData::CSV::RowReader
  # Headers in input CSV (with Hash key symbols matching Hash key symbols in output CSV Headers)
  InputHeaders = {
    # These symbols match symbols in OutputStandard::Headers.
    # So the corresponding cells with be copied from input to output:
    id: "id",
    name: "name",
    description: "description",
    organisational_structure: "",
    primary_activity: "activity",
    activities: "secondaryActivities[SQ002]",
    street_address: "address[a]",
    locality: "address[d]",
    postcode: "address[e]",
    email: "email",
    phone: "",
    website: "website",
    facebook: "facebook",
    twitter: "twitter",

    # These symbols don't match symbols in OutputStandard::Headers.
    # But CSV::RowReader creates method using these symbol names to read that column from the row:
    #registrar: "Registrar",
    #registered_number: "Registered Number"

    # street_address is made up of three cells
    address1: "address[a]",
    address2: "address[b]",
    address3: "address[c]",

    phone_raw: "phone",
    twitter_raw: "twitter",
    facebook_raw: "facebook",

    arts: "secondaryActivities[SQ002]",
    campaigning: "secondaryActivities[SQ003]",
    community: "secondaryActivities[SQ004]",
    education: "secondaryActivities[SQ005]",
    energy: "secondaryActivities[SQ006]",
    food: "secondaryActivities[SQ007]",
    goods_services: "secondaryActivities[SQ008]",
    health: "secondaryActivities[SQ009]",
    housing: "secondaryActivities[SQ010]",
    money: "secondaryActivities[SQ011]",
    nature: "secondaryActivities[SQ012]",
    reuse: "secondaryActivities[SQ013]",

    community_group: "structure[SQ001]",
    non_profit: "structure[SQ002]",
    social_enterprise: "structure[SQ003]",
    charity: "structure[SQ004]",
    company: "structure[SQ005]",
    workers_coop: "structure[SQ006]",
    housing_coop: "structure[SQ007]",
    consumer_coop: "structure[SQ008]",
    producer_coop: "structure[SQ009]",
    stakeholder_coop: "structure[SQ010]",
    community_interest_company: "structure[SQ011]",
    community_benefit_society: "structure[SQ012]",

    consent: "websiteConsent"
  }
  def initialize(row)
    # Let CSV::RowReader provide methods for accessing columns described by InputHeaders, above:
    super(row, InputHeaders)
  end
  def pre_flight_checks
    #unless description || website || street_address
    #raise(SeOpenData::Exception::IgnoreCsvRow, "Nothing in Details, Address, or Website")
    #end
  end
  # Some columns in the output are not simple copies of input columns:
  # Here are the methods for generating those output columns:
  # (So all method names below should aldo appear as keys in the output_headers Hash)
  # def id
  #   #raise(SeOpenData::Exception::IgnoreCsvRow, "\"Name\" column is empty") unless name
  #   #name.gsub(/[^0-9a-z]/i, '')
  #   raise(SeOpenData::Exception::IgnoreCsvRow, "\"Response ID\" column is empty") if res_id.empty?
  #   res_id
  # end
  def street_address
    [
      !address1.empty? ? address1 : nil,
      !address2.empty? ? address2 : nil,
      !address3.empty? ? address3 : nil
    ].compact.join(OutputStandard::SubFieldSeparator)
  end

  def phone
    phone_raw.delete! "(" ")" " "
    phone_raw.sub!(/^\+?44/, "0")
    phone_raw.sub!(/^00/, "0")
    phone_raw.gsub!(/[^\d]/, "")
    phone_raw
  end

  def twitter
    twitter_raw.downcase!
    twitter_raw.sub!(/h?t?t?p?s?:?\/?\/?w?w?w?\.?twitter\.com\//, "")
    twitter_raw.delete! "@" "#" "/"
    twitter_raw
  end

  def facebook
    facebook_raw.downcase!
    facebook_raw.sub!(/h?t?t?p?s?:?\/?\/?w?w?w?\.?facebook\.com\//, "")
    facebook_raw.sub!(/h?t?t?p?s?:?\/?\/?w?w?w?\.?fb\.com\//, "")
    facebook_raw.delete! "@" "#" "/"
    facebook_raw
  end

  def activities
    [
      arts == "Yes" ? "Arts, Media, Culture & Leisure" : nil,
      campaigning == "Yes" ? "Campaigning, Activism & Advocacy" : nil,
      community == "Yes" ? "Community & Collective Spaces" : nil,
      education == "Yes" ? "Education" : nil,
      energy == "Yes" ? "Energy" : nil,
      food == "Yes" ? "Food" : nil,
      goods_services == "Yes" ? "Goods & Services" : nil,
      health == "Yes" ? "Health, Social Care & Wellbeing" : nil,
      housing == "Yes" ? "Housing" : nil,
      money == "Yes" ? "Money & Finance" : nil,
      nature == "Yes" ? "Nature, Conservation & Environment" : nil,
      reuse == "Yes" ? "Reduce, Reuse, Repair & Recycle" : nil
    ].compact.join(OutputStandard::SubFieldSeparator)
  end

  def homepage
    if website && !website.empty? && website != "N/A"
      http_regex = /https?\S+/
      m = http_regex.match(website)
      if m
        m[0]
      else
        www_regex =  /^www\./
        www_m = www_regex.match(website)
        if www_m
          "http://#{website}"
        else
          add_comment("This doesn't look like a website: #{website} (Maybe it's missing the http:// ?)")
          nil
        end
      end
    end
  end

#  def postcode
#    if street_address.nil?
#      add_comment("There's no Address, so we can't get the postcode in order to guess a location, so this won't appear on the map")
#      nil
#    else
#      last_line = street_address.rstrip.split("\n").last
#      postcode = last_line.upcase.gsub(/[^A-Z0-9 ]/, "")
#      add_comment("Trying to get postcode from last line of Address, but it doesn't look like a postcode: #{last_line}") unless uk_postcode?(postcode)
#      postcode
#    end
#  end

  def organisational_structure
    ## Return a list of strings, separated by OutputStandard::SubFieldSeparator.
    ## Each item in the list is a prefLabel taken from essglobal/standard/legal-form.skos.
    ## See lib/se_open_data/essglobal/legal_form.rb
    regEx = /Yes/

    [
      community_group == "Yes" ? "Community group (formal or informal)" : nil,
      non_profit == "Yes" ? "Not-for-profit organisation" : nil,
      social_enterprise == "Yes" ? "Social enterprise" : nil,
      charity == "Yes" ? "Charity" : nil,
      company == "Yes" ? "Company (Other)" : nil,
      workers_coop == "Yes" ? "Workers co-operative" : nil,
      housing_coop == "Yes" ? "Housing co-operative" : nil,
      consumer_coop == "Yes" ? "Consumer co-operative" : nil,
      producer_coop == "Yes" ? "Producer co-operative" : nil,
      stakeholder_coop == "Yes" ? "Multi-stakeholder co-operative" : nil,
      community_interest_company == "Yes" ? "Community Interest Company (CIC)" : nil,
      community_benefit_society == "Yes" ? "Community Benefit Society / Industrial and Provident Society (IPS)" : nil
    ].compact.join(OutputStandard::SubFieldSeparator)
  end
  
end

# Convert to CSV with OutputStandard::Headers.
# OutputStandard::Headers is a Hash of <symbol, headerString>
# The values for each header <symbol, string> in OutputStandard::Headers are taken from either:
#   Looking up row[inputHeaderString] in the input CSV, where inputHeaderString = SpecializedCsvReader::InputHeaders[symbol], or
#   The return value of the method in SpecializedCsvReader whose name is symbol, or
#   Empty if neither of the above apply.
 
# For debugging 

# input = File.open("/Volumes/Extra/SEA-dev/open-data-and-maps/data/oxford/pilot/original-data/2019-05-09.csv", "r:utf-8")
# inputContent = input.read;
# input.close
# $stdout.reopen("/Volumes/Extra/SEA-dev/open-data-and-maps/data/oxford/pilot/generated-data/experimental/csv/initiatives.csv", "w")
# $stderr.reopen("/Volumes/Extra/SEA-dev/open-data-and-maps/data/dotcoop/domains2018-04-24/generated-data/experimental-new-server/csv/ignored-duplicates.csv", "w")
# $stdout.sync = true
# $stderr.sync = true
# SeOpenData::CSV.merge_and_de_duplicate(inputContent, $stdout, $stderr, keys, domainHeader, nameHeader)

SeOpenData::CSV.set_csv_comment_filename(ReportCsv)
SeOpenData::CSV.convert(
  # Output:
  $stdout, OutputStandard::Headers,
  # Input:
  #ARGF.read, SpecializedCsvReader, encoding: "UTF-8"
  ARGF.read, SpecializedCsvReader, {}
  # inputContent, SpecializedCsvReader, {}
)

#
# To assist matching coops UK data with dotcoop data
#
require 'pp'
require 'csv'
require 'set'

# Item in a dataset
class Item
  def initialize(csv_row)
    @row = csv_row
  end
  def uri
    @row['URI']
  end
  def name
    @row['Name']
  end
  def postcode
    @row['Postcode']
  end
  def name_normalized
    #name.gsub(/\s/, "").upcase
    small_words = %w(on the and ltd limited llp community)
    small_word_regex = /\b#{small_words.map{|w| w.upcase}.join('|')}\b/
    name.
      gsub(/\s/, "").
      upcase.
      gsub(small_word_regex, "").
      sub(/\([[:alpha:]]*\)/, "").
      gsub(/[[:punct:]]/, "").
      sub(/COOPERATIVE/, "COOP")
  end
end
# Contains all the data in a dataset
class Dataset < Array
  attr_reader :name
  def initialize(name, csv_file, csv_opts = {})
    @name = name
    @by_name = Hash.new {|h, k| h[k] = [] }
    @by_postcode = Hash.new {|h, k| h[k] = [] }

    csv_opts.merge!(headers: true)
    CSV.foreach(csv_file, csv_opts) do |row|
      item = Item.new(row)
      @by_name[item.name_normalized] << item
      @by_postcode[item.postcode] << item
      self << item
    end
  end
  def find_items_by_name(item)
    @by_name[item.name_normalized]
  end
  def find_items_by_postcode(item)
    @by_postcode[item.postcode]
  end
end

# For each item in the first dataset, we want to find a match in the second dataset.
class Match
  attr_accessor :items
  def initialize(item1, item2)
    @items = [item1, item2]
  end
end
class Comparer
  def initialize(dot_dataset, cuk_dataset)
    @ds = [dot_dataset, cuk_dataset]
    @perfect_matches = []
    @candidate_matches = []
    @no_matches = []

    @ds[0].each do |item|
      match_name_items = @ds[1].find_items_by_name(item).to_set
      match_postcode_items = @ds[1].find_items_by_postcode(item).to_set
      intersection = match_name_items & match_postcode_items
      if intersection.size > 0
        # if names and postcodes match, regard this as a perfect match:
        intersection.each do |jtem|
          @perfect_matches << Match.new(item, jtem)
        end

        next

      end
      if match_name_items.size == 1
        # If only the names match, but there's only one matching name, treat this as perfect:
        match_name_items.each do |jtem|
          @perfect_matches << Match.new(item, jtem)
        end

        next

      end
      # Find items where one name is entirely included within the other:
      match_name_substr = match_postcode_items.find_all do |jtem|
        (jtem.name_normalized.include? item.name_normalized) || (item.name_normalized.include? jtem.name_normalized)
      end
      unless match_name_substr.empty?
        # Regard these as perfect matches:
        match_name_substr.each do |jtem|
          @perfect_matches << Match.new(item, jtem)
        end

        next

      end
      if match_name_items.size > 0
        match_name_items.each do |jtem|
          @candidate_matches << Match.new(item, jtem)
        end
      elsif match_postcode_items.size > 0
        match_postcode_items.each do |jtem|
          @candidate_matches << Match.new(item, jtem)
        end
      end
      @no_matches << item
    end
  end
  def save_perfect_matches(csv_file)
    CSV.open(csv_file, "wb") do |csv|
      csv << [
        @ds[0].name + " uri",
        @ds[1].name + " uri",
        "Common Postcode",
        "Common Name",
      ]
      @perfect_matches.each do |m|
        i, j = m.items
        csv << [i.uri, j.uri, i.postcode, j.postcode, i.name, j.name]
      end
    end
  end
  def save_candidate_matches(csv_file)
    CSV.open(csv_file, "wb") do |csv|
      csv << [
        @ds[0].name + " uri",
        @ds[1].name + " uri",
        @ds[0].name + " Postcode",
        @ds[1].name + " Postcode",
        @ds[0].name + " Name",
        @ds[1].name + " Name",
      ]
      @candidate_matches.each do |m|
        i, j = m.items
        csv << [i.uri, j.uri, i.postcode, j.postcode, i.name, j.name, i.name_normalized, j.name_normalized]
      end
    end
  end
  def save_no_matches(csv_file)
    CSV.open(csv_file, "wb") do |csv|
      csv << [
        @ds[0].name + " uri",
        @ds[0].name + " Postcode",
        @ds[0].name + " Name",
      ]
      @no_matches.each do |i|
        csv << [i.uri, i.postcode, i.name]
      end
    end
  end
end

# @todo - these should be passed to script as arguments
COOPS_UK_CSV = "../../co-ops-uk/2019-06/generated-data/test2019/csv/uri-name-postcode.csv"
DOTCOOP_CSV = "generated-data/experimental/csv/uri-name-postcode.csv"
PERFECT_MATCH_CSV = "generated-data/experimental/sameas.csv"
CANDIDATE_MATCH_CSV = "generated-data/experimental/csv/candidate_match.csv"
NO_MATCH_CSV = "generated-data/experimental/csv/no_match.csv"

comp = Comparer.new(Dataset.new("dot", DOTCOOP_CSV), Dataset.new("cuk", COOPS_UK_CSV))
comp.save_perfect_matches(PERFECT_MATCH_CSV)
comp.save_candidate_matches(CANDIDATE_MATCH_CSV)
comp.save_no_matches(NO_MATCH_CSV)


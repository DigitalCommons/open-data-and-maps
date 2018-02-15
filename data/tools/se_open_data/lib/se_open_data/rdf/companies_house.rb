require 'linkeddata'

module SeOpenData
  module RDF
    module CompaniesHouse
      Vocab = ::RDF::Vocabulary.new("http://business.data.gov.uk/id/company/")
      def CompaniesHouse.uri(companies_house_number)
	raise "Missing CH number" unless companies_house_number.length > 0
	Vocab[companies_house_number.rjust(8, "0")]
      end
    end
  end
end

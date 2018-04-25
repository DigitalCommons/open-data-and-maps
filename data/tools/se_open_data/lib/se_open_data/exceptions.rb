
module SeOpenData
  module Exception
    # Exception to indicate that a CSV row cannot be processed, and should be ignored.
    class IgnoreCsvRow < StandardError
      # @param msg [String] the error message 
      def initialize(msg = "Ignoring CSV row")
        super
      end
    end
  end
end

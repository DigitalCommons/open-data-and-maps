# ProgressCounter
# On initialize, outputs the 'explanation' (without a '\n').
# On step, backspaces over the previous progress status message, and outputs a new progress status message (without '\n').
# When we reach 100% done, a final '\n\ is output.

module SeOpenData
  module Utils
    class ProgressCounter

      # @param explanation [String] description of the process whose progress is being counted
      # @param size [Integer] total number of steps to complete the process
      def initialize(explanation, size)
        @todo = size
        @done = 0
        @prev_msg_size = 0
        $stdout.write explanation + " "
      end

      # Tell the Progress counter how many step have been made towards completion
      # A message will be printed to stdout if the percentage complete has changed.
      # 
      # @param steps [Integer] number of steps made towards progress since last calling this method
      def step(steps = 1)
        @done += steps
        pc = 100 * @done / @todo
        if pc != @prev_pc
          @prev_pc = pc
          msg = "(#{pc}%)"
          $stdout.write "\b"*@prev_msg_size + msg
          @prev_msg_size = msg.size
          $stdout.write "\n" if @done == @todo
        end
      end
    end
  end
end

# ProgressCounter
# On initialize, outputs the 'explanation' (without a '\n').
# On step, backspaces over the previous progress status message, and outputs a new progress status message (without '\n').
# When we reach 100% done, a final '\n\ is output.

module SeOpenData
  module Utils
    class ProgressCounter
      def initialize(explanation, size)
	@todo = size
	@done = 0
	@prev_msg_size = 0
	$stdout.write explanation + " "
      end
      def step(n = 1)
	@done += n
	pc = 100*@done/@todo
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

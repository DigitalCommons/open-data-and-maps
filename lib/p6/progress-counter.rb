# ProgressCounter
# On initialize, outputs the 'explanation' (without a '\n').
# On step, backspaces over the previous progress status message, and outputs a new progress status message (without '\n').
# When we reach 100% done, a final '\n\ is output.

module P6
  class ProgressCounter
    def initialize(explanation, size)
      @todo = size
      @done = 0
      @prev_msg_size = 0
      $stdout.write explanation
    end
    def step(n = 1)
      @done += n
      msg = "#{@done} (#{100*@done/@todo}%)"
      $stdout.write "\b"*@prev_msg_size + msg
      @prev_msg_size = msg.size
      $stdout.write "\n" if @done == @todo
    end
  end
end

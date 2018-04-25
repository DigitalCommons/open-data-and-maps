# Rakefile contents copied from https://gist.github.com/zuazo/650eda19dc88a4eb91d4
#
# Available Rake tasks:
#
# $ rake -T
# rake doc   # Generate Ruby documentation
# rake style                    # Run all style checks
# rake style:ruby               # Run Ruby style checks using rubocop
# rake style:ruby:auto_correct  # Auto-correct RuboCop offenses
# rake yard                     # Generate Ruby documentation using yard

desc 'Generate Ruby documentation using yard'
task :yard do
  require 'yard'
  YARD::Rake::YardocTask.new do |t|
    t.stats_options = %w(--list-undoc)
  end
end

desc 'Generate Ruby documentation'
task doc: %w(yard)

namespace :style do
  require 'rubocop/rake_task'
  desc 'Run Ruby style checks using rubocop'
  RuboCop::RakeTask.new(:ruby)
end

desc 'Run all style checks'
task style: %w(style:ruby)


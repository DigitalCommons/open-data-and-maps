
module P6
  module File
    def File.save(contents, filename)
      ::File.open(filename, "w") {|f|
	f.puts contents
      }
      filename
    end
    def File.name(dir, base, ext)
      dir + base + "." +ext
    end
  end
end

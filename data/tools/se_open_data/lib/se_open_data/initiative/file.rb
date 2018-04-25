# Stuff to do with files associated with initiatives.

module SeOpenData
  class Initiative
    class File
      def self.name(id, outdir, ext)
        # Returns the filename for this initiative.

        # ALSO - side effect - makes sure the directory exists.
        # History: This was not necessary when RDF serializations were written to files like:
        #    R000001BD157AB.ttl
        # But now, in keeping with the URIs for initiatives, the filenames might be like this:
        #    R000001/BD158AB/2.ttl
        # So we have to create subdirectories for these.

        dirsep = "/"
        # The parent dir is assumed to already exist ...
        parent_dir = outdir
        initiative_path = id.split(dirsep)
        # Last part of initiative_path is filename, not dir name.
        # We're just interested in ensuring dirs exist.
        initiative_path.pop
        if initiative_path.size > 0
          # The initiative file is in a subdir of the parent dir.
          # We must ensure that subdir exists:
          Dir.chdir(parent_dir) do
            ensure_subdir_exists(initiative_path)
          end
        end
        parent_dir + id + ext
      end
      def self.ensure_subdir_exists(path)
        # This is not really a method of this class. Just a convenience utility.
        dir = path.shift
        Dir.mkdir(dir) unless Dir.exist?(dir)
        if path.size > 0
          Dir.chdir(dir) do
            ensure_subdir_exists(path)
          end
        end
      end
    end
  end
end

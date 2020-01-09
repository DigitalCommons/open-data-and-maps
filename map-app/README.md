# PACKAGE

map-app - A web application for mapping initiatives in the Solidarity Economy

# USAGE

This package is designed to supply the basic source and web assets for
a Solidarity Economy Association map website.  This is tailored for a
particular case by a configuration file, and an about.html page,
supplied by the consumer site package.

The consumer package should supply a script target to build itself
like this, which uses the `sea-site-build` script exported by this
package.

The "dev" package is a suggestion for allowing local hosting of the
site for development, using the command-line PHP executable's facility
to launch a web server.

```
  "scripts": {
    "build": "generate-version $npm_package_name >config/version.json && sea-site-build config node_modules/sea-map node_modules/sea-dataserver build",
    "dev": "php -t build/out -S localhost:8080"
  },
```

Given these, basic usage of a consuming NPM package therefore would
look like this:

    npm install         # Download the dependencies
	npm run build       # Build and minify the source into builds/out
    npm run def         # Launch a development web server on http://localhost:8080

# CONSUMING PACKAGE REQUIREMENTS

These need to have a configuration directory containing:

 - `about.html` - containing mark-up which will be displayed on the about tab in the sidebar
 - `config.json` - configuration parameters, see beloow
 - *<dataset>*/ - a directory for each dataset named in the config, containing parameters for the SPARQL query to send to Virtuoso (these will be url-encoded):
   - `query.rq` - the `query` parameter to pass
   - `default-graph-uri.txt` - the `default-graph-uri` parameter to pass
   - `endpoint.txt` - the base URL to the Virtuoso server

The NPM `sea-map` package needs to be a dependency, which exports the
`sea-site-build` script.

The package needs to invoke it like this(typically as an npm build
script target):

     sea-site-build $config_dir node_modules/sea-map node_modules/sea-dataserver $build_dir",

Where:

  - `$config_dir` is the path to the configuration directory mentioned above
  - `node_modules/sea-map` is the path to the `sea-map` package directory
  - `node_modules/sea-dataserver` is the path to the `sea-dataserver` package directory
  - `$build_dir` is the path in which to build the site.
  
`$build_dir` will be populated with two directories:

 - `in` - which contains a RequireJS `build.js` script and the assets
   it needs (linked from eleewhere)
 - `out` - the generated site content

`build/out` can then be served by a (PHP enabled) web server directly,
or packaged for deployment.

 ## CONFIG.JSON
 
 This is not currently properly documented, but here is an example:

```
 {
  "namedDatasets_comment": "These names correspond to directories in www/services which contain: default-graph-uri.txt, endpoint.txt, query.rq",
  "namedDatasets": ["oxford"],
  "htmlTitle_comment": "This will override the default value for the htmp <title> tag",
  "htmlTitle": "Solidarity Oxford",
  "defaultNongeoLatLng_comment": "The default latitude and longitude values for initiatives with no address",
  "defaultNongeoLatLng": { "lat": "51.7520", "lng": "-1.2577" },
  "filterableFields_comment": "A list of the fields that can populate the directory",
  "filterableFields": [{ "field": "primaryActivity", "label": "Activities" }],
  "doesDirectoryHaveColours_comment": "Does the directory feature coloured entries",
  "doesDirectoryHaveColours": true,
  "disableClusteringAtZoom_comment": "Zoom level to stop clustering at (false for off)",
  "disableClusteringAtZoom": false
}
```

# SCRIPT TARGETS

This package does little in its own right. The following are the
script targets it supports.

    npm lint
	
Runs a static analysis of the source, highlighting possible improvements



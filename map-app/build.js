// Config file for the r.js optimiser.
//
// Docs: 	http://requirejs.org/docs/optimization.html
// Example: https://github.com/jrburke/r.js/blob/master/build/example.build.js
//
// Typical usage:
// node r.js -o build.js
({
  // Read requirejs.config from the following file,
  // then override and augment these values in the rest of this build file.
  mainConfigFile: "www/map-app/app.js",
  waitSeconds: 200,

  paths: {
    // We are not going to optimise d3 (after all, we're getting it from a CDN!)
    d3: "empty:",

    // Mysteriously, the optimization seemed to be screwing things up for leafletAwesomeMarkers...
    // Hopefully this fixes https://github.com/SolidarityEconomyAssociation/open-data-and-maps/issues/24
    leafletAwesomeMarkers: "empty:",

    leafletBeautifyMarkers: "empty:",

    // While we're at it, let's not optimize other stuff too :-)
    leafletMarkerCluster: "empty:"
  },

  // Our web app source is in www:
  appDir: "www",

  // We want the optimised build to go here:
  // (Frequently overridden on node command line - see Makefile)
  dir: "www-built",

  // We don't want our built directory to contain js files that have been combined into app.js:
  removeCombined: true,

  // Application-specific configuration:
  pragmas: {
    // We want the www-built code to exclude debugging.
    debugInclude: false
  },

  // When building for deployment, we don't want the stubview, only the real view.
  // Also, we want to exclude hidden files (e.g. the .bla.swp files created by vim).
  // TODO - restore this, somehow, perhaps using a pragma?
  //fileExclusionRegExp: /stubview|^\./,

  modules: [
    {
      name: "app"
    }
  ],

  // Remove the text.js module (needed for the requirejs-json plugin) from lib in the built dir. :
  // TODO - Check: This may be a left-over from another project from which this was cloned!:
  //stubModules: ["text"],
  optimizeCss: "standard"
});

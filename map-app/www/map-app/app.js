"use strict";
requirejs.config({
  //appDir: "map-app",
  // baseUrl is relative to appDir.
  // By default, load modules from the lib directory:
  baseUrl: "map-app/lib",
  // except, if the module ID starts with "app",
  // load it from the app directory. Paths
  // config is relative to the baseUrl, and
  // never includes a ".js" extension since
  // the paths config could be for a directory.
  paths: {
    app: "../app",
    view: "../app/view",
    stubview: "../app/stubview", // for testing
    model: "../app/model",
    presenter: "../app/presenter",
    data: "../app/data",

    configuration: "../configuration",

    //jQuery: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-beta1/jquery.min",
    //topojson: "http://d3js.org/topojson.v1.min",
    //topojson: "https://cdnjs.cloudflare.com/ajax/libs/topojson/1.6.19/topojson.min",

    // d3 version 3:
    // If we want to load D3 from a local source:
    //d3: "d3.v3.min"
    // To load from CDN:
    //d3: "https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min",

    // d3 version 5:
    d3: "https://cdnjs.cloudflare.com/ajax/libs/d3/5.7.0/d3.min",

    // d3 v5 provides separate modules, if we want to use these
    // in order to load only what we need.For example:
    //"d3-dsv": "https://cdnjs.cloudflare.com/ajax/libs/d3-dsv/1.0.8/d3-dsv.min",
    //"d3-fetch": "https://d3js.org/d3-fetch.v1.min",

    // postal (eventbus) depends on lodash.
    postal: "postal",

    // postal.lodash.js is packaged with postal.js.
    // But it produces an error. See https://github.com/postaljs/postal.js/issues/182
    // lodash: "postal.lodash",
    //
    // So, I've used the core one direct from lodash:
    // https://raw.githubusercontent.com/lodash/lodash/4.17.10-npm/core.js
    lodash: "lodash.core",

    leaflet: "leaflet",
    leafletAwesomeMarkers: "leaflet.awesome-markers.min",
    leafletMarkerCluster: "leaflet.markercluster-src-1.4.1",

    // For expressing dependencies on json files:
    json: "require/json",
    // json uses the text module, se we need it too:
    text: "require/text"
  },
  shim: {
    // leaflet must be loaded before leafletAwesomeMarkers.
    // See http://requirejs.org/docs/api.html#config-shim
    // Note that this assumes that leafletAwesomeMarkers is NOT an AMD module.

    // Following: https://github.com/lvoogdt/Leaflet.awesome-markers/issues/57:
    leaflet: {
      exports: "L"
    },
    leafletAwesomeMarkers: {
      deps: ["leaflet"]
    },
    leafletMarkerCluster: {
      deps: ["leaflet"]
    }
  }
});

requirejs(["app/main"], function(main) {
  "use strict";
  console.log("app/main.js has been loaded");
  main.init();
});

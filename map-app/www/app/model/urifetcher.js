define(["rdflib"], function(rdflib) {
	"use strict";

	function Fetcher(store) {
		this.store = store;
	}
	Fetcher.prototype.fetch = function(uri) {
		console.log("Fetcher.fetch: " + uri);
		// Code based on that found here:
		// https://github.com/solid/solid-tutorial-rdflib.js/

		var graph = rdflib.graph();
		var timeout = 5000; // 5000 ms timeout
		var fetcher = new rdflib.Fetcher(graph, timeout);

		// Cross-origin proxying.
		// Copied from https://github.com/linkeddata/rdflib.js/wiki/Howtos
		// TODO - I don't think this is a suitable permanent solution!
		//var proxyUri = "http://data.fm/proxy?uri=" + uri;
		//var proxyUri = "http://data.solidarityeconomics.org/proxy.php?url=" + uri;

		// There's a symbolic link in ~matt/Sites that points to the checked out map-app directory.
		var proxyUri = "http://localhost/~matt/ise-map-app/server/proxy.php?mode=native&url=" + uri;
		var store = this.store;

		fetcher.nowOrWhenFetched(proxyUri, function(ok, body, xhr) {
			if (!ok) {
				console.log("Oops, something happened and couldn't fetch data for " + proxyUri);
			} else {
				// do something with the data in the graph (see below)
				console.log("Fetcher.fetch: OK");
				store.save(uri, graph);
			}
		});
	};

// Cross-origin proxying.
// Copied from https://github.com/linkeddata/rdflib.js/wiki/Howtos
// TODO - I don't think this is a suitable permanent solution!
//jq.ajaxPrefilter(function(options) {
    //if (options.crossDomain) {
        //options.url = "http://data.fm/proxy?uri=" + encodeURIComponent(options.url);
    //}
//});

	var pub = {
		Fetcher: Fetcher
	};
	return pub;
});

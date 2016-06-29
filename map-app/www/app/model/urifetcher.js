define(["d3", "rdflib"], function(d3, rdflib) {
	"use strict";

	function Fetcher(store) {
		this.store = store;
	}
	Fetcher.prototype.fetchUsingRdflib = function(uri) {
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
	Fetcher.prototype.fetchUsingD3xhr = function(uri) {
		var proxyUri = "http://localhost/~matt/ise-map-app/server/proxy.php?mode=native&url=" + uri;
		//d3.xml(proxyUri, "application/rdf+xml", function(error, data) {
		//d3.xhr(proxyUri, "application/json", function(error, data) {
		
		d3.xhr(proxyUri)
	    	//.mimeType("application/json")
	    	.mimeType("application/rdf+xml")
			//.responseType("blob")
			//.responseType("json")
			//.responseType("arraybuffer")
			.responseType("text")
			.get(function(error, data) {
				var graph = rdflib.graph();
				console.log(error);
				if (error) {
					console.log("Failed to get URI: " + uri);
					console.log(error);
				}
				else {
					console.log(data.getResponseHeaders);
					console.log(data);
					// TODO - figure out why this is telling us the mimeType that we asked for instead of 
					//        the one that (I think) was returned in the Response from our proxy: 
					console.log(data.getResponseHeader("Content-Type"));
					//console.log(data.response);
					// It seems that rdflib.js does not support JSON-LD. Blast!
					// TODO - We may have to consider running a service on the server, with access to 
					//        more capable libraries.
					console.log(rdflib.parse(data.response, graph, uri, data.getResponseHeader("Content-Type")));
				}
			});
	};
	//Fetcher.prototype.fetch = Fetcher.prototype.fetchUsingRdflib;
	Fetcher.prototype.fetch = Fetcher.prototype.fetchUsingD3xhr;

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

define( ["d3", "model/sse_initiative", "model/rdf"], function(d3, initiativeModel, rdfModel) {
	"use strict";

	var view;

	function loadRdfFromUri() {
		//var uri = "http://data.solidarityeconomics.org/doc/experimental/co-ops-uk.rdf";
		//var uri = "http://data.solidarityeconomics.org/id/experimental/co-ops-uk";
		var uri = "http://data.solidarityeconomics.org/id/experimental/co-ops-uk/R008807";
		//var uri = "http://data.ordnancesurvey.co.uk/id/postcodeunit/OX11BP";
		//var uri = "http://data.ordnancesurvey.co.uk/doc/postcodeunit/OX11BP.rdf";
		console.log("Load data from URI - hard-coded URI:");
		console.log(uri);
		rdfModel.loadUri(uri);
	}

	function registerView(v) {
		view = v;
		return {
			menus: [
				{
					text: "File",
					items: [
						//{ text: "Load RDF from URI (obsolete?)", click: loadRdfFromUri },
						// The data is now loaded automatically whe the "Main.ready" event is published.
						// TODO - remove this?
						//{ text: "Load data (obsolete?)", click: initiativeModel.loadFromWebService }
					]
				},
				{
					text: "View",
					items: []
				},
				{
					text: "Help",
					items: []
				}
			]
		};	// return settings
	}

	var pub = {
		registerView: registerView
	};
	return pub;
});

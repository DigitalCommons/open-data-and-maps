define( ["model/rdf"], function(rdfModel) {
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
						{ text: "Load RDF from URI", click: loadRdfFromUri }
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

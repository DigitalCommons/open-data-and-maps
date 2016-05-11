define(["rdflib"], function(rdflib) {
	"use strict";

	/*
var GR = rdflib.Namespace("http://purl.org/goodrelations/v1#");
var ESSGLOBAL = rdflib.Namespace("http://purl.org/essglobal/vocab/");
var VCARD = rdflib.Namespace("http://www.w3.org/2006/vcard/ns#");
var WGS84 = rdflib.Namespace("http://www.w3.org/2003/01/geo/wgs84_pos#");
var getCoop = function(id) {
	var name, postcode, latitude, longitude;

	var coopURI = "http://data.solidarityeconomics.org/id/experimental/co-ops-uk/" + id;
	fetcher(coopURI, function(store) {
		// do something with the data in the store (see below)
		//console.log(store);
		name = store.any(rdflib.sym(coopURI), GR('name'), undefined);
		console.log(name.toString());
		var hasaddr = store.any(rdflib.sym(coopURI), ESSGLOBAL('hasAddress'), undefined);
		//console.log(hasaddr);
		postcode = store.any(hasaddr, VCARD('postal-code'), undefined);
		//console.log(postcode.toString());
		var barePostcode = postcode.toString().replace(/\s+/g, '');
		//console.log(barePostcode);
		var osURI = "http://data.ordnancesurvey.co.uk/id/postcodeunit/" + barePostcode;
		console.log(osURI);
		fetcher(osURI, function(store) {
			//console.log(store);
			var latitide = store.any(rdflib.sym(osURI), WGS84('lat'), undefined);
			//console.log(latitide.toString());
			var longitide = store.any(rdflib.sym(osURI), WGS84('long'), undefined);
			//console.log(longitide.toString());
			putPinInMap(name, postcode, latitide.toString(), longitide.toString());
		});
	});
};
//getCoop("R008807");
*/


	function Store(store) {
	}
	Store.prototype.save = function(uri, graph) {
		console.log("Store.save:" + uri);
		console.log(graph);
	};

	var pub = {
		Store: Store
	};
	return pub;
});


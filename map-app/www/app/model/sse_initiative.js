// Model for SSE Initiatives.
define(["app/eventbus"], function(eventbus) {
	"use strict";

	var objects = [];
	var initiativesToLoad = [];

	function Initiative(e) {
		Object.defineProperties(this, {
			name: { value: e.name, enumerable: true },
			uri: { value: e.uri, enumerable: true },
			within: { value: e.within, enumerable: true },
			lat: { value: e.lat, enumerable: true },
			lng: { value: e.lng, enumerable: true },
			www: { value: e.www, enumerable: true },
			regorg: { value: e.regorg, enumerable: true }
		});
		objects.push(this);
		eventbus.publish({topic: "Initiative.new", data: this});
	}
	function loadNextInitiatives() {
		var i, e;
		var maxInitiativesToLoadPerFrame = 100;
		// By loading the initiatives in chunks, we keep the UI responsive
		for (i = 0; i < maxInitiativesToLoadPerFrame; ++i) {
			e = initiativesToLoad.pop();
			if (e !== undefined) {
				new Initiative(e);
			}
		}
		// If there's still more to load, we do so after returning to the event loop:
		if (e !== undefined) {
			setTimeout(function() {
				loadNextInitiatives();
			});
		}
	}
	function add(json) {
		initiativesToLoad = initiativesToLoad.concat(json);
		loadNextInitiatives();
	}
	function errorMessage(response) {
		// Extract error message from parsed JSON response.
		// Returns error string, or null if no error.
		// API response uses JSend: https://labs.omniti.com/labs/jsend
		switch (response.status) {
			case ("error"):
				return response.message;
			case ("fail"):
				return response.data.toString();
			case ("success"):
				return null;
			default:
				return "Unexpected JSON error message - cannot be extracted.";
		}
	}
	function loadFromWebService() {
		var service = "services/getdata_using_sparql.php";
		//var service = "services/getdata.php";
		var response = null;
		var message = null;
		eventbus.publish({topic: "Initiative.loadStarted", data: {message: "Loading data via " + service}});
		// We want to allow the effects of publishing the above event to take place in the UI before
		// continuing with the loading of the data, so we allow the event queue to be processed:
		setTimeout(function() {
			d3.json(service, function(error, json) {
				console.log(json);
				if (error) {
					console.warn(error);
					try {
						response = JSON.parse(error.responseText);
						message = errorMessage(response);
					}
					catch(e) {
						message = "Response contained no JSON."
					}
					eventbus.publish({
						topic: "Initiative.loadFailed",
						data: {message: error.status + ": " + error.statusText + ": " + error.responseURL + ": " + message}
					});
				}
				else {
					// API response uses JSend: https://labs.omniti.com/labs/jsend
					message = errorMessage(json);
					if (message === null) {
						console.log(json);
						add(json.data);
						eventbus.publish({topic: "Initiative.loadComplete"});
					}
					else {
						eventbus.publish({
							topic: "Initiative.loadFailed",
							data: {message: "Error from service: " + message}
						});
					}
				}
			});
		}, 0);
	}
	var pub = {
		add: add,
		loadFromWebService: loadFromWebService
	};
	// Automatically load the data when the app is ready:
	eventbus.subscribe({topic: "Main.ready", callback: loadFromWebService});
	return pub;
});

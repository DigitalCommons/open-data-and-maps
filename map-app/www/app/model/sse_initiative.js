// Model for SSE Initiatives.
define(["app/eventbus"], function(eventbus) {
	"use strict";

	var objects = [];

	function Initiative(name, uri, lat, lng, www) {
		Object.defineProperties(this, {
			name: { value: name, enumerable: true },
			uri: { value: uri, enumerable: true },
			lat: { value: lat, enumerable: true },
			lng: { value: lng, enumerable: true },
			www: { value: www, enumerable: true }
		});
		objects.push(this);
		eventbus.publish({topic: "Initiative.new", data: this});
	}
	function add(json) {
		json.forEach(function(e) {
			new Initiative(e.name, e.uri, e.lat, e.lng, e.www);
		});
	}
	function loadFromWebService() {
		var service = "services/getdata.php";
		eventbus.publish({topic: "Initiative.loadStarted", data: {message: "Loading data via " + service}});
		// We want to allow the effects of publishing the above event to take place in the UI before
		// continuing with the loading of the data, so we allow the event queue to be processed:
		setTimeout(function() {
			d3.json(service, function(error, json) {
				if (error) {
					console.warn(error);
					eventbus.publish({
						topic: "Initiative.loadFailed",
						data: {message: error.status + ": " + error.statusText + ": " + error.responseURL}
					});
				}
				else {
					console.log(json);
					add(json);
					eventbus.publish({topic: "Initiative.loadComplete"});
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

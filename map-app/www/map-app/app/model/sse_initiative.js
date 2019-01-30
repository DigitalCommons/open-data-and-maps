// Model for SSE Initiatives.
define(["d3", "app/eventbus", "model/config"], function(d3, eventbus, config) {
	"use strict";

	var objects = [];
	var initiativesToLoad = [];

	function Initiative(e) {
		Object.defineProperties(this, {
			name: { value: e.name, enumerable: true },
			desc: { value: e.desc, enumerable: true },
			dataset: { value: e.dataset, enumerable: true },
			uri: { value: e.uri, enumerable: true },
			uniqueId: { value: e.uri, enumerable: true },
			within: { value: e.within, enumerable: true },
			lat: { value: e.lat, enumerable: true },
			lng: { value: e.lng, enumerable: true },
			www: { value: e.www, enumerable: true },
			regorg: { value: e.regorg, enumerable: true }
		});
		objects.push(this);
		this.hasGeoLocation = function() {
			return this.lat && this.lng;
		}
		eventbus.publish({topic: "Initiative.new", data: this});
	}
	function allInitiatives() {
		return objects;
	};
	function search(text) {
		// returns an array of sse objkects whose name contains the search text
		var up = text.toUpperCase();
		return objects.filter(function(i) { return i.name.toUpperCase().includes(up); });
	}
	function sortInitiatives() {
		console.log(`sorting ${objects.length} initiatives`);
		// Optimization:
		// We could just have sorted the array here, but we don't want to perform a String.toLowerCase
		// any more times than we need to, so we're doing it just once for each initiative
		// and keeping that in a temporary arrap (mapped).
		// Code based on
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Sorting_with_map
		//
		// Temporary array holds objects with position and sort-value:
		var mapped = objects.map(function(el, i) {
			return { index: i, value: el.name.toLowerCase() };
		});

		// Sorting the mapped array containing the reduced values
		mapped.sort(function(a, b) {
			if (a.value > b.value) {
				return 1;
			}
			if (a.value < b.value) {
				return -1;
			}
			return 0;
		});

		// Now use mapped to re-order objects:
		objects = mapped.map(function(el){
			return objects[el.index];
		});
	}
	function latLngBounds() {
		// @returns an a pair of lat-long pairs that define the bounding box of all the initiatives,
		// The first element is south-west, the second north east
		//
		// Careful: isNaN(null) returns false ...
		const lats = objects.filter(obj => obj.lat !== null && !isNaN(obj.lat)).map(obj => obj.lat);
		const lngs = objects.filter(obj => obj.lng !== null && !isNaN(obj.lng)).map(obj => obj.lng);
		const west = Math.min.apply(Math, lngs);
		const east = Math.max.apply(Math, lngs);
		const south = Math.min.apply(Math, lats);
		const north = Math.max.apply(Math, lats);

		return [[south, west], [north, east]];
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
		else {
			// No more initiatives to load. 

			// We sort the initiatives so that the default order for viewing lists of
			// initiatives is sorted, and we don't want to have to re-sort the list each time the
			// UI wants to display a list.
			sortInitiatives();
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
		var ds = config.namedDatasets();
		var i;
		for (i = 0; i < ds.length; i++) {
			loadDataset(ds[i]);
		}
	}
	function loadDataset(dataset) {
		var service = config.getServicesPath() + "get_dataset.php?dataset=" + dataset;
		var response = null;
		var message = null;
		eventbus.publish({topic: "Initiative.loadStarted", data: {message: "Loading data via " + service}});
		// We want to allow the effects of publishing the above event to take place in the UI before
		// continuing with the loading of the data, so we allow the event queue to be processed:
		//setTimeout(function() {
			d3.json(service).then(function(json) {
				// This now uses d3.fetch and the fetch API.
				// TODO - error handling
				// TODO - publish events (e.g. loading, success, failure)
				//        so that the UI can display info about datasets.
				//console.log(json);
				add(json.data);

				eventbus.publish({topic: "Initiative.datasetLoaded"});
			});
			/*
			d3.json(service, function(error, json) {
			// This is the old version based on xmlHttpRequest
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
		*/
	}
	var pub = {
		allInitiatives,
		loadFromWebService: loadFromWebService,
		search: search,
		latLngBounds: latLngBounds
	};
	// Automatically load the data when the app is ready:
	//eventbus.subscribe({topic: "Main.ready", callback: loadFromWebService});
	return pub;
});

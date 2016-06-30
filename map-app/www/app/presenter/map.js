define(["app/eventbus", "model/markers"], function(eventbus, markerModel) {
	"use strict";

	var view;
	function registerView(v) {
		view = v;
		return { };	// return settings
	}
	// TODO - return contextmenuitems as a property of settings in registerView.
	function getContextmenuItems() {
		return [
			{
				text: "Placehoder 1 - does nothing",
				callback: function(e) {
					console.log("Context menu item 1 selected.");
					console.log(e);
				}
			},
			{
				text: "Placehoder 2 - does nothing",
				callback: function(e) {
					console.log("Context menu item 2 selected.");
					console.log(e);
				}
			},
			{
				text: "Launch Google maps",
				callback: function(e) {
					// Documentation of Google maps URL parameters from here:
					// https://moz.com/ugc/everything-you-never-wanted-to-know-about-google-maps-parameters
					// Example:
					// https://www.google.co.uk/maps?q=loc:49.8764953,1.1566544&z=14&t=p

					var params = [
						// TODO - put a marker on Google maps at e.latlng.
						//"q=loc:" puts a marker on the map, BUT ignores the z and t parameters. Hmmm.
						//"q=loc:" + e.latlng.lat.toFixed(7) + "," + e.latlng.lng.toFixed(7),
						"ll=" + e.latlng.lat.toFixed(7) + "," + e.latlng.lng.toFixed(7),
						"z=14", // zoom. TODO: Consider matching with current view?
						"t=p" 	// for terrain map
					];
					var url = "https://www.google.co.uk/maps?" + params.join("&");

					// This version of the URL also works (and is more modern?).
					// But I have not worked out how to specify a terrain map, nor markers.
					//var zoom = 14;
					//var url = "https://www.google.co.uk/maps/@" + e.latlng.lat.toFixed(7) + "," + e.latlng.lng.toFixed(7) + "," + zoom + "z";
					console.log(url);
					window.open(url, "_blank");
				}
			}
		];
	}
	function getMapEventHandlers() {
		return {
			click: function(e) { console.log("Map clicked" + e.latlng); }
		};
	}
	function onPointAdd(data/*, envelope*/) {
		var pt = data.point;
		var latlng = [pt.lat, pt.lng];	// Understood by Leaflet.
		// options properties are the options avaiable for Leaflet.awesome-markers.
		// See https://github.com/lvoogdt/Leaflet.awesome-markers

		var eventHandlers = {};
		/*
		// Test interaction between click event handlers and bound Popups:
		var eventHandlers = {click: function(e) {
			console.log("click");
			console.log(e);
		}};
		*/

		pt.setUserData("mapView", view.addMarker(latlng, data.options, eventHandlers));
	}
	function onPointRemove(data/*, envelope*/) {
		data.point.getUserData("mapView").destroy();
	}
	function onInitiativeNew(data/*, envelope*/) {
		var initiative = data;
		var latlng = [initiative.lat, initiative.lng];
		var eventHandlers = {};
		var options = {hovertext: initiative.name};
		view.addMarker(latlng, options, eventHandlers);
	}

	function init() {
		// subscribe to events published by the model:
		eventbus.subscribe({topic: "Point.add", callback: onPointAdd});
		eventbus.subscribe({topic: "Point.remove", callback: onPointRemove});
		eventbus.subscribe({topic: "Initiative.new", callback: onInitiativeNew});
	}
	var pub = {
		registerView: registerView,
		getMapEventHandlers: getMapEventHandlers,
		getContextmenuItems: getContextmenuItems
	};
	init();
	return pub;
});

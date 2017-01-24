define(["app/eventbus"], function(eventbus) {
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
	function onInitiativeNew(data/*, envelope*/) {
		var initiative = data;
		var latlng = [initiative.lat, initiative.lng];
		var eventHandlers = {};
		var www = initiative.www;
		var popuptext = "<h4>" + initiative.name +  "</h4>" +
			"<a href=\"" + initiative.uri +"\" target=\"_blank\">Open</a> data in a new tab";
		var options = {popuptext: popuptext, hovertext: initiative.name, cluster: true};
		view.addMarker(latlng, options, eventHandlers);
	}
	function onInitiativeLoadComplete() {
		view.clearProtectingVeil();
	}
	function onInitiativeLoadMessage(data/*, envelope*/) {
		view.showProtectingVeil(data.message);
	}

	function init() {
		// subscribe to events published by the model:
		eventbus.subscribe({topic: "Initiative.new", callback: onInitiativeNew});
		eventbus.subscribe({topic: "Initiative.loadComplete", callback: onInitiativeLoadComplete});
		eventbus.subscribe({topic: "Initiative.loadStarted", callback: onInitiativeLoadMessage});
		eventbus.subscribe({topic: "Initiative.loadFailed", callback: onInitiativeLoadMessage});
	}
	var pub = {
		registerView: registerView,
		getMapEventHandlers: getMapEventHandlers,
		getContextmenuItems: getContextmenuItems
	};
	init();
	return pub;
});

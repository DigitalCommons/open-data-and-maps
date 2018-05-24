define(["leaflet", "leafletMarkerCluster", "leafletAwesomeMarkers"], function(leaflet, cluster, awesomeMarkers) {
	"use strict";

	var group = null;

	// Using font-awesome icons, the available choices can be seen here:
	// http://fortawesome.github.io/Font-Awesome/icons/
	var dfltOptions = {prefix: "fa"};	// "fa" selects the font-awesome icon set (we have no other)

	function init(map) {
		// This technique taken from https://github.com/lvoogdt/Leaflet.awesome-markers/issues/57
		// Hopefully this fixes https://github.com/SolidarityEconomyAssociation/open-data-and-maps/issues/24
		// TODO - tidy up the overloading of the variable: leaflet.
		var leaflet = require("leaflet");

		group = leaflet.markerClusterGroup();
		map.addLayer(group);
	}

	function Marker(map, latlng, options, eventHandlers) {

		var popuptext = options.popuptext || hovertext || "Sorry. Popup text missing!";
		var hovertext = options.hovertext || "Hover text goes here.";

		// options argument overrides our default options:
		var opts = Object.assign(dfltOptions, options);

		// This technique taken from https://github.com/lvoogdt/Leaflet.awesome-markers/issues/57
		// Hopefully this fixes https://github.com/SolidarityEconomyAssociation/open-data-and-maps/issues/24
		// TODO - tidy up the overloading of the variable: leaflet.
		var leaflet = require("leaflet");
		var AwesomeMarkers = require("leafletAwesomeMarkers");

		// Note that the dependency between AwesomeMarkers and leaflet is expressed as a 
		// requireJS shim config in our main requireJS configuration.
		var icon = leaflet.AwesomeMarkers.icon(opts);
		this.marker = leaflet.marker(latlng, {icon: icon, title: hovertext});
		// maxWidth helps to accomodate big font, for presentation purpose, set up in CSS
		this.marker.bindPopup(popuptext, { maxWidth: 800 });

		// Add the event handlers that are defined in model/pointseq:
		Object.keys(eventHandlers).forEach(function(k) {
			this.marker.on(k, eventHandlers[k]);
		}, this);

		this.parent = options.cluster ? group : map;
		this.parent.addLayer(this.marker);
	}
	Marker.prototype.destroy = function() {
		this.parent.removeLayer(this.marker);
	};

	var pub = {
		init: init,
		Marker: Marker
	};
	return pub;
});


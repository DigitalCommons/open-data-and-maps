define(["leaflet", "leaflet.markercluster"], function(leaflet, cluster) {
	"use strict";

	var group = null;

	// Using font-awesome icons, the available choices can be seen here:
	// http://fortawesome.github.io/Font-Awesome/icons/
	var dfltOptions = {prefix: "fa"};	// "fa" selects the font-awesome icon set (we have no other)

	function init(map) {
		group = leaflet.markerClusterGroup();
		map.addLayer(group);
	}

	function Marker(map, latlng, options, eventHandlers) {

		var popuptext = options.popuptext || hovertext || "Sorry. Popup text missing!";
		var hovertext = options.hovertext || "Hover text goes here.";

		// options argument overrides our default options:
		var opts = Object.assign(dfltOptions, options);

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


define(["leaflet", "leafletMarkerCluster", "leafletAwesomeMarkers", "view/base", "presenter/map/marker"], function(leaflet, cluster, awesomeMarkers, viewBase, presenter) {
	"use strict";

	function MarkerView(){}
	// inherit from the standard view base object:
	var proto = Object.create(viewBase.base.prototype);

	// Using font-awesome icons, the available choices can be seen here:
	// http://fortawesome.github.io/Font-Awesome/icons/
	var dfltOptions = {prefix: "fa"};	// "fa" selects the font-awesome icon set (we have no other)

	proto.create = function(map, cluster, latlng, options, eventHandlers) {

		var popuptext = options.popuptext || hovertext || "Sorry. Popup text missing!";
		var hovertext = options.hovertext || "Hover text goes here.";

		// options argument overrides our default options:
		var opts = Object.assign(dfltOptions, options);

		// Note that the dependency between AwesomeMarkers and leaflet is expressed as a 
		// requireJS shim config in our main requireJS configuration.
		var icon = leaflet.AwesomeMarkers.icon(opts);
		this.marker = leaflet.marker(latlng, {icon: icon, title: hovertext});
		// maxWidth helps to accomodate big font, for presentation purpose, set up in CSS
		// maxWidth:800 is needed if the font-size is set to 200% in CSS:
		//this.marker.bindPopup(popuptext, { maxWidth: 800 });
		this.marker.bindPopup(popuptext);

		// Add the event handlers that are defined in model/pointseq:
		Object.keys(eventHandlers).forEach(function(k) {
			this.marker.on(k, eventHandlers[k]);
		}, this);

		//this.parent = options.cluster ? group : map;
		this.parent = cluster;
		this.parent.addLayer(this.marker);
	};
	proto.destroy = function() {
		this.parent.removeLayer(this.marker);
	};
	MarkerView.prototype = proto;

	function createMarker(map, cluster, latlng, options, eventHandlers) {
		const view = new MarkerView();
		view.setPresenter(presenter.createPresenter(view));
		view.create(map, cluster, latlng, options, eventHandlers);
		return view;
	}

	var pub = {
		createMarker: createMarker
	};
	return pub;
});


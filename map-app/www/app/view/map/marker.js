define(["leaflet", "leafletMarkerCluster", "leafletAwesomeMarkers", "view/base", "presenter/map/marker"], function(leaflet, cluster, awesomeMarkers, viewBase, presenter) {
	"use strict";

	// Keep a mapping between initiatives and their Markers:
	const markerForInitiative = {};
	let selectedCluster = null;
	let unselectedCluster = null;


	function MarkerView(){}
	// inherit from the standard view base object:
	var proto = Object.create(viewBase.base.prototype);

	// Using font-awesome icons, the available choices can be seen here:
	// http://fortawesome.github.io/Font-Awesome/icons/
	const dfltOptions = {prefix: "fa"};	// "fa" selects the font-awesome icon set (we have no other)

	proto.create = function(map, initiative) {

		const hovertext = this.presenter.getHoverText(initiative);

		// options argument overrides our default options:
		const opts = Object.assign(dfltOptions, {
			icon: this.presenter.getIcon(initiative),
			popuptext: this.presenter.getPopupText(initiative),
			hovertext: this.presenter.getHoverText(initiative),
			cluster: true,
			markerColor: this.presenter.getMarkerColor(initiative)
		});

		// Note that the dependency between AwesomeMarkers and leaflet is expressed as a 
		// requireJS shim config in our main requireJS configuration.
		const icon = leaflet.AwesomeMarkers.icon(opts);
		this.marker = leaflet.marker(this.presenter.getLatLng(initiative), {icon: icon, title: hovertext});
		// maxWidth helps to accomodate big font, for presentation purpose, set up in CSS
		// maxWidth:800 is needed if the font-size is set to 200% in CSS:
		//this.marker.bindPopup(popuptext, { maxWidth: 800 });
		this.marker.bindPopup(this.presenter.getPopupText(initiative));

		const eventHandlers = this.presenter.getEventHandlers(initiative);
		Object.keys(eventHandlers).forEach(function(k) {
			this.marker.on(k, eventHandlers[k]);
		}, this);

		this.cluster = unselectedCluster;
		this.cluster.addLayer(this.marker);
		markerForInitiative[initiative.uniqueId] = this;
	};
	proto.setSelected = function(initiative) {
		const icon = leaflet.AwesomeMarkers.icon({prefix: 'fa', markerColor: 'orange', iconColor: 'black', icon: 'certificate', cluster: false});
		this.marker.setIcon(icon);
		this.cluster.removeLayer(this.marker);
		this.cluster = selectedCluster;
		this.cluster.addLayer(this.marker);
	};

	function setSelected(initiative) {
		markerForInitiative[initiative.uniqueId].setSelected(initiative);
	}
	proto.destroy = function() {
		this.cluster.removeLayer(this.marker);
	};
	MarkerView.prototype = proto;

	function createMarker(map, initiative) {
		const view = new MarkerView();
		view.setPresenter(presenter.createPresenter(view));
		view.create(map, initiative);
		return view;
	}
	function setSelectedCluster(cluster) {
		selectedCluster = cluster;
	}
	function setUnselectedCluster(cluster) {
		unselectedCluster = cluster;
	}

	var pub = {
		createMarker: createMarker,
		setSelectedCluster: setSelectedCluster, 
		setUnselectedCluster: setUnselectedCluster, 
		setSelected: setSelected
	};
	return pub;
});


define(["leaflet", "leafletMarkerCluster", "leafletAwesomeMarkers", "view/base", "presenter/map/marker"], function(leaflet, cluster, awesomeMarkers, viewBase, presenter) {
	"use strict";

	// Keep a mapping between initiatives and their Markers:
	const markerForInitiative = {};
	// CAUTION: this may be either a ClusterGroup, or the map itself
	let selectedClusterGroup = null;
	let unselectedClusterGroup = null;

	// Note that the dependency between AwesomeMarkers and leaflet is expressed as a
	// requireJS shim config in our main requireJS configuration.
	// It seems that all of our leaflet Markers can share the same AwesomeMarker icon,
	// they don't need to have one each:
	const unselectedIcon = leaflet.AwesomeMarkers.icon({prefix: 'fa', markerColor: 'blue', iconColor: 'white', icon: 'certificate', cluster: false});
	const selectedIcon = leaflet.AwesomeMarkers.icon({prefix: 'fa', markerColor: 'orange', iconColor: 'black', icon: 'certificate', cluster: false});

	function MarkerView(){}
	// inherit from the standard view base object:
	var proto = Object.create(viewBase.base.prototype);

	// Using font-awesome icons, the available choices can be seen here:
	// http://fortawesome.github.io/Font-Awesome/icons/
	const dfltOptions = {prefix: "fa"};	// "fa" selects the font-awesome icon set (we have no other)

	proto.create = function(map, initiative) {
		this.initiative = initiative;

		const hovertext = this.presenter.getHoverText(initiative);

		// options argument overrides our default options:
		const opts = Object.assign(dfltOptions, {
			icon: this.presenter.getIcon(initiative),
			popuptext: this.presenter.getPopupText(initiative),
			hovertext: this.presenter.getHoverText(initiative),
			cluster: true,
			markerColor: this.presenter.getMarkerColor(initiative)
		});

		const icon = unselectedIcon;
		//this.marker = leaflet.marker(this.presenter.getLatLng(initiative), {icon: icon, title: hovertext});
		this.marker = leaflet.marker(this.presenter.getLatLng(initiative), {icon: icon});
		// maxWidth helps to accomodate big font, for presentation purpose, set up in CSS
		// maxWidth:800 is needed if the font-size is set to 200% in CSS:
		//this.marker.bindPopup(popuptext, { maxWidth: 800 });
		//this.marker.bindPopup(this.presenter.getPopupText(initiative));
		this.marker.bindTooltip(this.presenter.getHoverText(initiative));

		//const eventHandlers = this.presenter.getEventHandlers(initiative);
		//Object.keys(eventHandlers).forEach(function(k) {
			//this.marker.on(k, eventHandlers[k]);
		//}, this);
		const that = this;
		this.marker.on('click', function(e) {
			that.onClick(e);
		});
		this.marker.on('mouseover', function(e) {
			console.log('mouseover');
			console.log(that.initiative);
		});
		this.marker.on('mouseout', function(e) {
			console.log('mouseout');
			console.log(that.initiative);
		});

		this.cluster = unselectedClusterGroup;
		this.cluster.addLayer(this.marker);
		markerForInitiative[initiative.uniqueId] = this;
	};
	proto.onClick = function(e) {
		console.log("MarkerView.onclick");
		// Browser seems to consume the ctrl key: ctrl-click is like right-buttom-click (on Chrome)
		if (e.originalEvent.ctrlKey) { console.log("ctrl"); }
		if (e.originalEvent.altKey) { console.log("alt"); }
		if (e.originalEvent.metaKey) { console.log("meta"); }
		if (e.originalEvent.shiftKey) { console.log("shift"); }
		if (e.originalEvent.shiftKey) {
			this.presenter.notifySelectionToggled(this.initiative);
		}
		else {
			console.log(this.initiative);
			this.presenter.notifySelectionSet(this.initiative);
		}
	};
	proto.setUnselected = function(initiative) {
		this.marker.setIcon(unselectedIcon);
		this.cluster.removeLayer(this.marker);
		this.cluster = unselectedClusterGroup;
		this.cluster.addLayer(this.marker);
	};
	proto.setSelected = function(initiative) {
		this.marker.setIcon(selectedIcon);
		this.cluster.removeLayer(this.marker);
		// CAUTION: this may be either a ClusterGroup, or the map itself
		this.cluster = selectedClusterGroup;
		this.cluster.addLayer(this.marker);
	};
	proto.showTooltip = function(initiative) {
		// This variation zooms the map, and makes sure the marker can
		// be seen, spiderifying if needed.
		// But this auto-zooming maybe more than the user bargained for!
		// It might disrupt their flow.
		//this.cluster.zoomToShowLayer(this.marker);

		// This variation spiderfys the cluster to which the marker belongs.
		// This only works if selectedClusterGroup is actually a ClusterGroup!
		//const cluster = selectedClusterGroup.getVisibleParent(this.marker);
		//if (cluster && typeof cluster.spiderfy === 'function') {
			//cluster.spiderfy();
		//}
		this.marker.openTooltip();
		this.marker.setZIndexOffset(1000);
	};
	proto.hideTooltip = function(initiative) {
		this.marker.closeTooltip();
		this.marker.setZIndexOffset(0);
	};

	function setSelected(initiative) {
		markerForInitiative[initiative.uniqueId].setSelected(initiative);
	}
	function setUnselected(initiative) {
		markerForInitiative[initiative.uniqueId].setUnselected(initiative);
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
	function setSelectedClusterGroup(clusterGroup) {
		// CAUTION: this may be either a ClusterGroup, or the map itself
		selectedClusterGroup = clusterGroup;
	}
	function setUnselectedClusterGroup(clusterGroup) {
		unselectedClusterGroup = clusterGroup;
	}
	function showTooltip(initiative) {
		markerForInitiative[initiative.uniqueId].showTooltip(initiative);
	}
	function hideTooltip(initiative) {
		markerForInitiative[initiative.uniqueId].hideTooltip(initiative);
	}

	var pub = {
		createMarker: createMarker,
		setSelectedClusterGroup: setSelectedClusterGroup, 
		setUnselectedClusterGroup: setUnselectedClusterGroup, 
		setSelected: setSelected,
		setUnselected: setUnselected,
		showTooltip: showTooltip,
		hideTooltip: hideTooltip
	};
	return pub;
});


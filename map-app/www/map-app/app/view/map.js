define(
	["d3", "leaflet", "leaflet.contextmenu", "view/base", "presenter/map", "view/map/marker"],
	function(d3, leaflet, contextmenu, viewBase, presenter, markerView) {
		"use strict";

		const config = {
			putSelectedMarkersInClusterGroup: false
		};

		function MapView(){}
		// inherit from the standard view base object:
		var proto = Object.create(viewBase.base.prototype);
		proto.createMap = function() {
			const openCycleMapUrl = "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png";
			const osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
			const osmAttrib = "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>";
			var i, eventHandlers = this.presenter.getMapEventHandlers();
			var k = Object.keys(eventHandlers);
			// For the contextmenu docs, see https://github.com/aratcliffe/Leaflet.contextmenu.
			this.map = leaflet.map("map-app-leaflet-map", {
				// set to true to re-enable context menu.
				// See https://github.com/SolidarityEconomyAssociation/open-data-and-maps/issues/78
				contextmenu: false,
				contextmenuWidth: 140,
				contextmenuItems: this.presenter.getContextmenuItems()
			});
			this.map.zoomControl.setPosition('bottomright');
			// Lat/long box for Scotland, England and Wales
			// (part of a nation that was called the United Kingdom before it voted for Brexit, 
			// which led to Scotland becoming independent):
			this.map.fitBounds([[49.5, 9], [61, -2]]);

			for (i = 0; i < k.length; ++i) {
				this.map.on(k[i], eventHandlers[k[i]]);
			}

			leaflet.tileLayer(osmUrl, {attribution: osmAttrib, maxZoom: 18}).addTo(this.map);

			this.unselectedClusterGroup = leaflet.markerClusterGroup();
			this.map.addLayer(this.unselectedClusterGroup);
			if (config.putSelectedMarkersInClusterGroup) {
				this.selectedClusterGroup = leaflet.markerClusterGroup();
				this.map.addLayer(this.selectedClusterGroup);
			}
			else {
				// If we're here, then selectedClusterGroup is a BAD NAME for this property!
				this.selectedClusterGroup = this.map;
			}
			markerView.setSelectedClusterGroup(this.selectedClusterGroup);
			markerView.setUnselectedClusterGroup(this.unselectedClusterGroup);
		};
		proto.addMarker = function(initiative) {
			return markerView.createMarker(this.map, initiative);
		};
		proto.setSelected = function(initiative) {
			markerView.setSelected(initiative);
		};
		proto.setUnselected = function(initiative) {
			markerView.setUnselected(initiative);
		};
		proto.showTooltip = function(initiative) {
			markerView.showTooltip(initiative);
		};
		proto.hideTooltip = function(initiative) {
			markerView.hideTooltip(initiative);
		};
		/* The protecting veil is now obsolete. */
		//function clearProtectingVeil() {
			//d3.select("#protectingVeil").style("display", "none");
		//}
		//function showProtectingVeil(msg) {
			//d3.select("#protectingVeil").style("display", "inline");
			//d3.select("#protectingVeilMessage").text(msg);
		//}
		proto.fitBounds = function(latLngBounds) {
			this.map.fitBounds(latLngBounds);
		};
		proto.zoomAndPanTo = function(latLng) {
			console.log("zoomAndPanTo");
			this.map.setView(latLng, 16, {"animate": true});
		};
		//proto.makeSelectedIcon = function() {
			//// TODO: This should not be here (in view/map.js)
			////       Probably better in view/map/Marker.js.
			//return leaflet.AwesomeMarkers.icon({prefix: 'fa', markerColor: 'orange', iconColor: 'black', icon: 'certificate', cluster: false});
		//};
		MapView.prototype = proto;
		function init() {
			const view = new MapView();
			view.setPresenter(presenter.createPresenter(view));
			view.createMap();
			return view;
		}
		var pub = {
			init: init
		};
		return pub;
	});

define(
	["d3", "leaflet", "leaflet.contextmenu", "presenter/map", "view/map/marker"],
	function(d3, leaflet, contextmenu, presenter, markerView) {
		"use strict";

		var settings;
		var map;
		var priv = {
			init: function() {
				var openCycleMapUrl = "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png";
				var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
				var osmAttrib = "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>";
				var i, eventHandlers = presenter.getMapEventHandlers();
				var k = Object.keys(eventHandlers);
				// For the contextmenu docs, see https://github.com/aratcliffe/Leaflet.contextmenu.
				map = leaflet.map("map", {
					contextmenu: true,
					contextmenuWidth: 140,
					contextmenuItems: presenter.getContextmenuItems()
				});
				// Lat/long box for Scotland, England and Wales
				// (part of a nation that was called the United Kingdom before it voted for Brexit, 
				// which led to Scotland becoming independent):
				map.fitBounds([[49.5, 9], [61, -2]]);

				for (i = 0; i < k.length; ++i) {
					map.on(k[i], eventHandlers[k[i]]);
				}

				leaflet.tileLayer(osmUrl, {attribution: osmAttrib, maxZoom: 18}).addTo(map);

				markerView.init(map);
			}
		};
		function addMarker(latlng, options, eventHandlers) {
			return new markerView.Marker(map, latlng, options, eventHandlers);
		}
		function clearProtectingVeil() {
			d3.select("#protectingVeil").style("display", "none");
		}
		function showProtectingVeil(msg) {
			d3.select("#protectingVeil").style("display", "inline");
			d3.select("#protectingVeilMessage").text(msg);
		}
		var pub = {
			init: priv.init,
			clearProtectingVeil: clearProtectingVeil,
			showProtectingVeil: showProtectingVeil,
			addMarker: addMarker
		};
		settings = presenter.registerView(pub);
		return pub;
	});

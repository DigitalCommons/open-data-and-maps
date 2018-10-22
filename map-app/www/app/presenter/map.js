define(["app/eventbus", "presenter"], function(eventbus, presenter) {
	"use strict";

	function Presenter(){}

	var proto = Object.create(presenter.base.prototype);

	var serviceToDisplaySimilarCompanies = document.location.origin + document.location.pathname + 
		"services/" + "display_similar_companies/main.php";
	proto.getContextmenuItems = function() {
		// The context menu has been disabled (in www/app/view/map.js), in accordance with 
		// https://github.com/SolidarityEconomyAssociation/open-data-and-maps/issues/78
		// So, don't expect this to do anything!
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
	};
	proto.getMapEventHandlers = function() {
		return {
			click: function(e) { console.log("Map clicked" + e.latlng); }
		};
	};
	proto.onInitiativeNew = function(data/*, envelope*/) {
		var initiative = data;
		//var latlng = [initiative.lat, initiative.lng];
		//var eventHandlers = {
			//click: function(e) {
				//eventbus.publish({topic: "Initiative.clicked", data: {initiative: initiative, mouseEvent: e}});
			//}
		//};
//
		//// It's easier to find on the map initiatives with websites, andthose with links to Companies House
		//// if we set the colour of the marker accordingly:
		//// Available colours can be found in the docs: https://github.com/lvoogdt/Leaflet.awesome-markers
		//var hasWww = initiative.www && initiative.www.length > 0;
		//var hasReg = initiative.regorg && initiative.regorg.length > 0;
		//var hasWithin = initiative.within && initiative.within.length > 0;
		//var markerColor = (hasWww && hasReg) ? 'purple' : hasWww ? 'blue' : hasReg ? 'red' : 'green';
		//var serviceToDisplaySimilarCompaniesURL;
//
		//// For info about rel="noopener noreferrer",
		//// see https://www.thesitewizard.com/html-tutorial/open-links-in-new-window-or-tab.shtml
		//function link(uri, text) {
			//return "<a title=\"" + uri + "\" href=\"" + uri +"\" rel=\"noopener noreferrer\" target=\"_blank\">" + text + "</a>";
		//}
		//var popupRows = [];
		//popupRows.push("View " + link(initiative.uri, "details") + " in a new tab");
		//if (hasWithin) {
			//popupRows.push("View " + link(initiative.within, "geographic information") + " in a new tab");
		//}
		//if (hasWww) {
			//popupRows.push("View " + link(initiative.www, "website") + " in a new tab");
		//}
		//if (hasReg) {
			//popupRows.push("View " + link(initiative.regorg, "company registration") + " in a new tab");
			////console.log(document.location.origin + document.location.pathname + "services/" + "phpinfo.php");
			//serviceToDisplaySimilarCompaniesURL = serviceToDisplaySimilarCompanies + "?company=" + encodeURIComponent(initiative.regorg);
			////console.log(serviceToDisplaySimilarCompaniesURL);
			//popupRows.push("View " + link(serviceToDisplaySimilarCompaniesURL, "similar companies nearby") + " in a new tab");
		//}
//
		//var popuptext =
			//"<p>Dataset: " + initiative.dataset + "</p>" +
			//"<h4>" + initiative.name +  "</h4>" +
			//popupRows.join("<br>");
//
		//// See http://fontawesome.io/icons/ for a list of icon names (where we're using 'home'), below:
		//var hovertext = initiative.name + " (" + initiative.dataset + ")";
		//var icon = initiative.dataset == 'dotcoop' ? 'globe' : 'certificate';
		//var options = {icon: icon, popuptext: popuptext, hovertext: hovertext, cluster: true, markerColor: markerColor};
		////markerForInitiative[initiative.uniqueId] = this.view.addMarker(latlng, options, eventHandlers);
		this.view.addMarker(initiative);
	};
	proto.onInitiativeLoadComplete = function() {
		/* The protecting veil is now obsolete. */
		//view.clearProtectingVeil();
		// TODO - hook this up to a log?
	};
	proto.onInitiativeLoadMessage = function(data/*, envelope*/) {
		/* The protecting veil is now obsolete. */
		//view.showProtectingVeil(data.message);
		// TODO - hook this up to a log?
	};
	proto.onInitiativeSelected = function(data) {
		const initiative = data;
		console.log('onInitiativeSelected');
		console.log(initiative);
		this.view.setSelected(initiative);
		this.view.zoomAndPanTo({lon: initiative.lng, lat: initiative.lat});
	};

	Presenter.prototype = proto;

	function createPresenter(view) {
		var p = new Presenter();
		p.registerView(view);
		eventbus.subscribe({topic: "Initiative.new", callback: function(data) { p.onInitiativeNew(data); } });
		eventbus.subscribe({topic: "Initiative.loadComplete", callback: function(data) { p.onInitiativeLoadComplete(data); } });
		eventbus.subscribe({topic: "Initiative.loadStarted", callback: function(data) { p.onInitiativeLoadMessage(data); } });
		eventbus.subscribe({topic: "Initiative.loadFailed", callback: function(data) { p.onInitiativeLoadMessage(data); } });
		eventbus.subscribe({topic: "Initiative.selected", callback: function(data) { p.onInitiativeSelected(data); } });
		return p;
	}
	var pub = {
		createPresenter: createPresenter
	};
	return pub;
});

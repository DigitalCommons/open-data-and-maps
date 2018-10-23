define(["app/eventbus", "presenter"], function(eventbus, presenter) {
	"use strict";

	function Presenter(){}

	const proto = Object.create(presenter.base.prototype);

	proto.notifySelectionToggled = function(initiative) {
		eventbus.publish({topic: "Marker.SelectionToggled", data: initiative});
	};
	proto.notifySelectionSet = function(initiative) {
		eventbus.publish({topic: "Marker.SelectionSet", data: initiative});
	};

	// We're now leaving for the view to set up its own eventhandlers, 
	// so this is obsolete ... until we change our minds :-)
//	proto.getEventHandlers = function(initiative) {
//		return {
//			click: function(e) {
//				eventbus.publish({topic: "Initiative.clicked", data: {initiative: initiative, mouseEvent: e}});
//			}
//		};
//	}
	proto.getLatLng = function(initiative) {
		return [initiative.lat, initiative.lng];
	};
	proto.getHoverText = function(initiative) {
		return initiative.name + " (" + initiative.dataset + ")";
	};
	proto.getPopupText = function(initiative) {
		// TODO - make obsolete
		const hasWww = initiative.www && initiative.www.length > 0;
		const hasReg = initiative.regorg && initiative.regorg.length > 0;
		const hasWithin = initiative.within && initiative.within.length > 0;
		// For info about rel="noopener noreferrer",
		// see https://www.thesitewizard.com/html-tutorial/open-links-in-new-window-or-tab.shtml
		function link(uri, text) {
			return "<a title=\"" + uri + "\" href=\"" + uri +"\" rel=\"noopener noreferrer\" target=\"_blank\">" + text + "</a>";
		}
		const popupRows = [];
		popupRows.push("View " + link(initiative.uri, "details") + " in a new tab");
		if (hasWithin) {
			popupRows.push("View " + link(initiative.within, "geographic information") + " in a new tab");
		}
		if (hasWww) {
			popupRows.push("View " + link(initiative.www, "website") + " in a new tab");
		}
		if (hasReg) {
			popupRows.push("View " + link(initiative.regorg, "company registration") + " in a new tab");
			//console.log(document.location.origin + document.location.pathname + "services/" + "phpinfo.php");
			const serviceToDisplaySimilarCompaniesURL = serviceToDisplaySimilarCompanies + "?company=" + encodeURIComponent(initiative.regorg);
			//console.log(serviceToDisplaySimilarCompaniesURL);
			popupRows.push("View " + link(serviceToDisplaySimilarCompaniesURL, "similar companies nearby") + " in a new tab");
		}

		const popuptext =
			"<p>Dataset: " + initiative.dataset + "</p>" +
			"<h4>" + initiative.name +  "</h4>" +
			popupRows.join("<br>");

		return popuptext;
	};
	proto.getMarkerColor = function(initiative) {
		const hasWww = initiative.www && initiative.www.length > 0;
		const hasReg = initiative.regorg && initiative.regorg.length > 0;
		const markerColor = (hasWww && hasReg) ? 'purple' : hasWww ? 'blue' : hasReg ? 'red' : 'green';
		return markerColor;
	};
	proto.getIconOptions = function(initiative) {
		const icon = initiative.dataset == 'dotcoop' ? 'globe' : 'certificate';
		return {icon: icon, popuptext: popuptext, hovertext: hovertext, cluster: true, markerColor: markerColor};

	};
	proto.getIcon = function(initiative) {
		return initiative.dataset == 'dotcoop' ? 'globe' : 'certificate';
	};

	Presenter.prototype = proto;

	function createPresenter(view) {
		const p = new Presenter();
		p.registerView(view);
		return p;
	}
	var pub = {
		createPresenter: createPresenter
	};
	return pub;
});

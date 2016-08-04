define(["model/sse_initiative", "app/console", "app/view", "app/debug"], function(sseInitiative, myconsole, view, debugging){
	"use strict";

	function init() {
		console.log("TODO - Check the use of console here. Is this the mechanism by which app/copnsole gets used by the rest of the app?");
		console.log("TODO - Check why is app/debug being loaded here - probably a leftover from clone origin.");
		console.log("header, footer and left column have been reduce to zero in style.css.");

		// The code for each view is loaded by www/app/view.js
		// Initialize the views:
		view.init();
		// Each view will ensure that the code for its presenter is loaded.

		// This is a hack.
		// The desired functionality is that the map has finished displaying by the time
		// the event is published.
		// A timeout may be the way to get back to the event loop (so the map can be shown),
		// but the choice of 1000ms is an arbitrary hack.
		// TODO: investigate leaflet.Map.load event. Is this what we want?
		setTimeout(function() {
			sseInitiative.loadFromWebService();
		}, 1000);
	}
	var pub = {
		init: init
	};
	return pub;
});


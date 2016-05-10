define(["app/eventbus"], function(eventbus) {
	"use strict";

	var eventPrefix = "Seaarch";
	var view;
	function registerView(v) {
		view = v;
		return { };	// return settings
	}

	function onNew(/*data, envelope*/) {
		console.log("presenter/search: onNew");
	}
	function init() {
		// subscribe to events published by the model:
		eventbus.subscribe({topic: eventPrefix + ".new", callback: onNew});
	}
	var pub = {
		registerView: registerView
	};
	init();
	return pub;
});


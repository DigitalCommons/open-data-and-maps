define(["app/eventbus", "model/postcodearea"], function(eventbus, postcodeareaModel) {
	"use strict";

	var eventPrefix = "PostCodeArea";
	var view;
	function registerView(v) {
		view = v;
		return { };	// return settings
	}
	function convertForView(area) {
		return {
			modelObject: area,
			title: area.name,
			name: area.name
		};
	}

	function onNew(/*data, envelope*/) {
		//console.log("presenter/postcodearea: onNew");
		view.refresh(postcodeareaModel.getAll().map(convertForView));
	}
	function onStateChange(data/*, envelope*/) {
		//console.log("presenter/postcodearea:  onStateChange");
		view.showState(convertForView(data.modelObject), data.state);
	}

	function init() {
		// subscribe to events published by the model:
		eventbus.subscribe({topic: eventPrefix + ".new", callback: onNew});
		eventbus.subscribe({topic: eventPrefix + ".stateChange", callback: onStateChange});
	}
	var pub = {
		registerView: registerView
	};
	init();
	return pub;
});

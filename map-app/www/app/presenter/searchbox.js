define(["app/eventbus", "model/config", "model/sse_initiative", "presenter"], function(eventbus, config, sseInitiative, presenter) {
	"use strict";

	function Presenter(){}

	var proto = Object.create(presenter.base.prototype);
	proto.performSearch = function(text) {
		console.log("Search submitted: [" + text + "]");
		// We need to make sure that the search sidebar is loaded
		if (text.length > 0) {
			eventbus.publish({topic: "Sidebar.showInitiatives"});
			var results = sseInitiative.search(text);
			console.log(results);
			eventbus.publish({topic: "Search.initiativeResults", data: {text: text, results: results}});
		}
	};
	Presenter.prototype = proto;

	function createPresenter(view) {
		var p = new Presenter();
		p.registerView(view);
		return p;
	}
	var pub = {
		createPresenter: createPresenter
	};
	return pub;
});

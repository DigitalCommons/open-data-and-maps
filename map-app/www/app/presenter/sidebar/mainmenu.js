define(["app/eventbus", "model/config", "presenter"], function(eventbus, config, presenter) {
	"use strict";

	function Presenter(){}

	var proto = Object.create(presenter.base.prototype);
	Presenter.prototype = proto;

	// @todo 
	// Create a bunch of buttons that raise events when they are clicked.
	// We can then plumb the events into other presenters, e.g. the presenter fo the search results.
	// That way, we have looser coupling :-)
	
	function createPresenter(view) {
		var p = new Presenter;
		p.registerView(view);
		return p;
	}
	var pub = {
		createPresenter: createPresenter
	};
	return pub;
});

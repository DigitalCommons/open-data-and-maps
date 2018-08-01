define(["app/eventbus", "model/config", "presenter"], function(eventbus, config, presenter) {
	"use strict";

	// This is the presenter for the view/sidebar object.
	// Don't confuse this with the base object for all sidebar objects, which is in presenter/sidebar/base.

	function Presenter(){}

	var proto = Object.create(presenter.base.prototype);
	Presenter.prototype = proto;

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

define(["app/eventbus", "model/config", "model/sse_initiative", "presenter"], function(eventbus, config, sseInitiative, presenter) {
	"use strict";

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

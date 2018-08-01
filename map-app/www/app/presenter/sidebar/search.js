define(["app/eventbus", "model/config", "model/sse_initiative", "presenter/sidebar/base"], function(eventbus, config, sseInitiative, sidebarPresenter) {
	"use strict";

	function Presenter(){}

	var proto = Object.create(sidebarPresenter.base.prototype);
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

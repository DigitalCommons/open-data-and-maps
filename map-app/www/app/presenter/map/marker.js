define(["app/eventbus", "presenter"], function(eventbus, presenter) {
	"use strict";

	function Presenter(){}

	var proto = Object.create(presenter.base.prototype);

	Presenter.prototype = proto;

	function createPresenter(view) {
		var p = new Presenter();
		p.registerView(view);
		//eventbus.subscribe({topic: "Initiative.new", callback: function(data) { p.onInitiativeNew(data); } });
		return p;
	}
	var pub = {
		createPresenter: createPresenter
	};
	return pub;
});

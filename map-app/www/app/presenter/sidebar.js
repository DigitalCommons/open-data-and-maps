define(["app/eventbus", "model/config", "presenter"], function(eventbus, config, presenter) {
	"use strict";

	// This is the presenter for the view/sidebar object.
	// Don't confuse this with the base object for all sidebar objects, which is in presenter/sidebar/base.

	function Presenter(){}

	var proto = Object.create(presenter.base.prototype);
	proto.changeSidebar = function(name) {
		console.log("presenter/sidebar/changeSidebar");
		this.view.changeSidebar(name);
	};
	Presenter.prototype = proto;

	function createPresenter(view) {
		var p = new Presenter;
		p.registerView(view);
		eventbus.subscribe({topic: "Sidebar.loadSearch", callback: function() { p.changeSidebar('search'); }});
		eventbus.subscribe({topic: "Sidebar.loadMainMenu", callback: function() { p.changeSidebar('mainMenu'); }});
		return p;
	}
	var pub = {
		createPresenter: createPresenter
	};
	return pub;
});

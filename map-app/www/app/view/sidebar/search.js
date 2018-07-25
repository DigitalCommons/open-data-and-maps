// The view aspects of the Main Menu sidebar
define(["app/eventbus", "presenter/sidebar/search"], function(eventbus, presenter) {
	"use strict";

	// Our local Sidebar object:
	function Sidebar(){}

	function init(sidebar) {
		// Our local Sidebar inherits from sidebar:
		var proto = Object.create(sidebar.prototype);

		// And adds some overrides and new properties of it's own:
		proto.title = "Search";

		Sidebar.prototype = proto;
	}
	function createSidebar() {
		var sb = new Sidebar;
		sb.setPresenter(presenter.createPresenter(sb));
		return sb;
	}
	var pub = {
		init: init,
		createSidebar: createSidebar
	};
	return pub;
});

// The view aspects of the Main Menu sidebar
define(["app/eventbus", "presenter/sidebar/mainmenu", "view/sidebar/base"], function(eventbus, presenter, sidebarView) {
	"use strict";

	// Our local Sidebar object:
	function Sidebar(){}

	// Our local Sidebar inherits from sidebar:
	var proto = Object.create(sidebarView.base.prototype);

	// And adds some overrides and new properties of it's own:
	proto.title = "Main menu";

	proto.getScrollableHtml = function() {
		return '<button id="about-btn" class="w3-bar-item w3-button w3-mobile">About</button>';
	};
	Sidebar.prototype = proto;

	function createSidebar() {
		var sb = new Sidebar;
		sb.setPresenter(presenter.createPresenter(sb));
		return sb;
	}
	var pub = {
		createSidebar: createSidebar
	};
	return pub;
});

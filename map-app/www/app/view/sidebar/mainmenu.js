// The view aspects of the Main Menu sidebar
define(["app/eventbus", "presenter/sidebar/mainmenu", "view/sidebar/base"], function(eventbus, presenter, sidebarView) {
	"use strict";

	// Our local Sidebar object:
	function Sidebar(){}

	// Our local Sidebar inherits from sidebar:
	var proto = Object.create(sidebarView.base.prototype);

	// And adds some overrides and new properties of it's own:
	proto.title = "Main menu";
	proto.hasHistoryNavigation = false;

	proto.populateScrollableSelection = function(selection) {
		this.presenter.getButtons().forEach(function(button) {
			selection.append('button')
			.attr("class", "w3-bar-item w3-button w3-mobile")
			.attr("title", button.hovertext)
			.on('click', button.onClick)
			.text(button.label);
		});
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

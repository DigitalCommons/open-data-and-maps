// Set up the various sidebars
define(["d3", "view/base", "presenter/sidebar", "view/sidebar/mainmenu", "view/sidebar/search"], function(d3, view, presenter, mainMenu, search) {
	"use strict";

	// This deals with the view object that controls the sidebar
	// It is not itself a sidebar/view object, but contains objects of that type
	
	function SidebarView(){}
	// inherit from the standard view base object:
	var proto = Object.create(view.base.prototype);

	proto.createSidebars = function() {
		this.searchSidebar = search.createSidebar();
		this.mainMenuSidebar = mainMenu.createSidebar();
	};
	SidebarView.prototype = proto;
	var view;

	function init() {
		view = new SidebarView;
		view.setPresenter(presenter.createPresenter(view));
		view.createSidebars();
		view.mainMenuSidebar.reload();
		console.log(view.mainMenuSidebar);
		console.log(view.mainMenuSidebar.title);
	}
	var pub = {
		init: init
	};
	return pub;
});

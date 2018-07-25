// Set up the various sidebars
define(["d3", "view/sidebar/mainmenu", "view/sidebar/search"], function(d3, mainMenu, search) {
	"use strict";

	var mainMenuSidebar;
	var searchSidebar;

	// sidebar is the "base class" of all sidebars:
	function sidebar(){}
	//sidebar.prototype = {
		//title: "Untitled"
	//};

	function init(viewBase) {
		// sidebars inherit from viewBase:
		var proto = Object.create(viewBase.prototype);

		// add properties to sidebar:
		proto.title = "Untitled";
		proto.loadHtml = function() {
			document.getElementById('sidebar-title').innerHTML = this.title;
		};
		sidebar.prototype = proto;
		

		// set up other sidebars to 'subclass' from sidebar:
		mainMenu.init(sidebar);
		search.init(sidebar);

		searchSidebar = search.createSidebar();

		mainMenuSidebar = mainMenu.createSidebar();
		mainMenuSidebar.loadHtml();
		console.log(mainMenuSidebar);
		console.log(mainMenuSidebar.title);
	}
	var pub = {
		init: init
	};
	return pub;
});

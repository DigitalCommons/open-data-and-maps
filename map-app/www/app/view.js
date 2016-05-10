// This is the place where the various views are pulled into the application.
define(["view/map", "view/menu", "view/tabs"], function(map, menu, tabs) {
	"use strict";

	function init() {
		map.init();
		menu.init();

		// Initialize the tabs controls, and the content of each tab:
		tabs.init();
	}
	var pub = {
		init: init
	};
	return pub;
});


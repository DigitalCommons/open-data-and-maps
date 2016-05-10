define( [], function() {
	"use strict";

	var view;

	function loadDataFromUri() {
		console.log("Load data from URI - not yet implemented");
	}

	function registerView(v) {
		view = v;
		return {
			menus: [
				{
					text: "File",
					items: [
						{ text: "Load data from URI", click: loadDataFromUri }
					]
				},
				{
					text: "View",
					items: []
				},
				{
					text: "Help",
					items: []
				}
			]
		};	// return settings
	}

	var pub = {
		registerView: registerView
	};
	return pub;
});

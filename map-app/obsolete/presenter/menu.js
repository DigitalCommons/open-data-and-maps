define( ["d3", "model/sse_initiative"], function(d3, initiativeModel) {
	"use strict";

	var view;

	function registerView(v) {
		view = v;
		return {
			menus: [
				{
					text: "File",
					items: [
						// TODO - remove this?
						//{ text: "Load data (obsolete?)", click: initiativeModel.loadFromWebService }
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

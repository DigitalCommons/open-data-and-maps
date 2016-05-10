define( ["d3", "presenter/search"], function(d3, presenter) {
	"use strict";

	// TODO - perhaps we can use exactly the same code for the list of files?
	//        configured by the array of columns, provided in settings?
	var settings;
	function init(tabId) {
		d3.select("#" + tabId).append("p").text("Search... not yet implemented.");
	}
	var pub = {
		init: init
	};
	settings = presenter.registerView(pub);
	return pub;
});


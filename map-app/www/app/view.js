// This is the place where the various views are pulled into the application.
define(["d3", "view/map"], function(d3, map) {
	"use strict";

	function init() {
		d3.select("#about-btn")
		.attr("title", "See information about this app in new tab")
		.on("click", function() { window.open("https://github.com/p6data-coop/ise-linked-open-data/blob/master/map-app/README.md", "_blank");});

		d3.select("#search-form")
		.on("submit", function() {
			// By default, submitting the form will cause a page reload!
			d3.event.preventDefault();

			//d3.event.stopPropagation();
			var searchText = d3.select("#search-box").property("value");
			console.log("Search submitted: [" + searchText + "]");
			//console.log(d3.event);
			//console.log(d3.select("#search-box").property("value"));
		});

		map.init();
	}
	var pub = {
		init: init
	};
	return pub;
});


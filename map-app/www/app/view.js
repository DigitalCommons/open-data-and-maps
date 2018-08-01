// This is the place where the various views are pulled into the application.
define(["d3", "view/map", "view/sidebar"], function(d3, map, sidebar) {
	"use strict";

	function init() {
		// @todo - make obsolete
		d3.select("#about-btn")
		.attr("title", "See information about this app in new tab")
		.on("click", function() { window.open("https://github.com/p6data-coop/ise-linked-open-data/blob/master/map-app/README.md", "_blank");});

		// @todo - make obsolete. Search results will be diaplyed in a sidebar, e.g. by view/sidebar/search.js
		d3.select("#search-form")
		.on("submit", function() {
			// By default, submitting the form will cause a page reload!
			d3.event.preventDefault();

			//d3.event.stopPropagation();
			var searchText = d3.select("#search-box").property("value");
			console.log("Search submitted: [" + searchText + "]");
			document.getElementById('search-results').innerHTML = "<p>You searched for: " + searchText + "</p>" +
				"<p><i class=\"w3-round w3-xxlarge fa fa-exclamation-triangle\"></i>" +
				"Sorry, searching is not yet available, but coming soon</p>";
			document.getElementById('search-results-container').style.display='block';
			//console.log(d3.event);
			//console.log(d3.select("#search-box").property("value"));
		});

		map.init();
		sidebar.init();
	}
	var pub = {
		init: init
	};
	return pub;
});

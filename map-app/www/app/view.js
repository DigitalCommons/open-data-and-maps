// This is the place where the various views are pulled into the application.
define(["model/config", "d3", "view/map", "view/sidebar", "view/searchbox"], function(config, d3, map, sidebar, searchbox) {
	"use strict";

	function init() {
		if (config.htmlTitle()) {
			d3.select("html").select("head").select("title").text(config.htmlTitle());
		}
		// @todo - make obsolete
		d3.select("#about-btn")
		.attr("title", "See information about this app in new tab")
		.on("click", function() { window.open("https://github.com/p6data-coop/ise-linked-open-data/blob/master/map-app/README.md", "_blank"); });

		map.init();
		searchbox.init();
		sidebar.init();
	}
	var pub = {
		init: init
	};
	return pub;
});

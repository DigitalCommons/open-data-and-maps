define( ["d3", "presenter/tabs", "view/postcodearea", "view/search"], function(d3, presenter, postcodeareasView, searchView) {
	"use strict";

	var settings;

	var tabControls = [
		{view: searchView, text: "Search", contentId: "search", selected: true},
		{view: postcodeareasView, text: "Areas", contentId: "postcodeareas"}
	];
	function matchKey(d) { return d.contentId; }

	// selectTab will be passed one element of the tabControls array.
	function selectTab(tabControl) {
		console.log("selectTab");
		d3.select("#tabs-control").select("ul").selectAll("li")
			.data(tabControls, matchKey)
			.classed("selected", function(d) { return matchKey(d) === matchKey(tabControl); })
			;
		d3.select("#tabs-content").selectAll("div")
			.data(tabControls, matchKey)
			.classed("selected", function(d) { return matchKey(d) === matchKey(tabControl); })
			;
	}
	var priv = {
		init: function() {
			// Set up the tab controllers (the tabs you click on)
			var ul = d3.select("#tabs-control").append("ul").classed("tabrow", true);

			ul.selectAll("li")
				.data(tabControls, matchKey)
				.enter()
				.append("li")
				.classed({"tab-selector": true, selected: function(d) { return d.selected; }})
				.attr("href", "#")
				.text(function(d) { return d.text; })
				.on("click", selectTab )
				;

			// Set up the content of each tab.
			d3.select("#tabs-content").selectAll("div")
				.data(tabControls, matchKey)
				.enter()
				.append("div")
				.attr("id", function(d) { return d.contentId; })
				.classed({"tab-content": true, selected: function(d) { return d.selected; }})
				;

			// Initialise the view (content) for each tab:
			tabControls.forEach(function(e) {
				e.view.init(e.contentId);
			});
		}
	};
	var pub = {
		init: priv.init
	};
	settings = presenter.registerView(pub);
	return pub;
});


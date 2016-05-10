define( ["d3", "presenter/postcodearea"], function(d3, presenter) {
	"use strict";

	// TODO - perhaps we can use exactly the same code for the list of files?
	//        configured by the array of columns, provided in settings?
	var settings;
	var tbody;
	var columns = ["area"];
	function init(tabId) {
		tbody = d3.select("#" + tabId).append("table").append("tbody");
	}
	function matchKey(d) { return d.area; }
	function refresh(areas) {
		console.log("postcodeareas.refresh");
		console.log(areas);

		// TODO - make this function update the values for rows that already exist in the table.
		//        Currently, it does only the enter() processing, for missing rows.
		var rows = tbody.selectAll("tr")
			.data(areas, matchKey)
			.enter()
			.append("tr")
			.attr("title", function(d) { return d.title; });

		rows.on("click", function(d) {
			// D3 passes the datum as first param, i.e. the pointSeq provided by the presenter.
			// This gives us access to the model's PointSeq via the modelObject property.
			// This means that we have the view talking directly to the model, which
			// is not supposed to happen! Hey ho.
			d.modelObject.setSelected(true);
		})
		.on("mouseover", function(d) {
			d.modelObject.setHovered(true);
		})
		.on("mouseout", function(d) {
			d.modelObject.setHovered(false);
		});

		// Populate the columns of each row:
		rows.selectAll("td")
			.data(function(row) {
				return columns.map(function(c) {
					//console.log(c + row[c]);
					return {column: c, value: row[c]};
				});
			})
			.enter()
			.append("td")
			.html(function(d) { return d.value; })
			;
	}
	function showState(area, state) {
		// Here we run a D3 update on the single item of data in the array [area]
		tbody.selectAll("tr")
			.data([area], matchKey)
			.classed(state)
			;
	}
	var pub = {
		init: init,
		refresh: refresh,
		showState: showState
	};
	settings = presenter.registerView(pub);
	return pub;
});

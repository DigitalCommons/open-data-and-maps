define( ["d3", "presenter/menu"], function(d3, presenter) {
	"use strict";

	var settings;

	var priv = {
		init: function() {
			var i, j, selection;
			for (i = 0; i < settings.menus.length; ++i) {
				// The elements created here are based on
				// http://www.w3schools.com/howto/howto_css_dropdown.asp.
				selection = d3.select("#menubar")
				.append("div").classed({dropdown: true})
				.append("button").text(settings.menus[i].text).classed({dropbtn: true})
				.append("div").classed({"dropdown-content": true});
				// Create the individual menu items:
				for (j = 0; j < settings.menus[i].items.length; ++j) {
					selection.append("a").text(settings.menus[i].items[j].text)
					.on("click", settings.menus[i].items[j].click);
				}
			}
		}
	};
	var pub = {
		init: priv.init
	};
	settings = presenter.registerView(pub);
	return pub;
});

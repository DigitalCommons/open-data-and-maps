define(["d3"], function(d3) {
	"use strict";

	// 'Base class' for all views:
	// @todo use this base for the older view objects - they were created originally before this base existed.
	var base = function(){
	};
	base.prototype = {
		presenter: null,
		setPresenter: function(p) { this.presenter = p; }
	};
	base.prototype.d3selectAndClear = function(selector) {
		// adds a log for failed selectors
		// Clears the innerHtml, ready for re-populating using .append()
		var selection = d3.select(selector);
		if (selection.empty()) {
			console.log("Unexpectedly cannot find match for selector: " + selector);
		}
		else {
			selection.html("");
		}
		return selection;
	};

	var pub = {
		base: base
	};
	return pub;
});

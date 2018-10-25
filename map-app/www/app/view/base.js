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
	base.prototype.htmlToOpenLinkInNewTab = function(url, text, options) {
		const title = options && options.title || "Click to open in a new tab";
		return "<a title=\"" + title + "\" href=\"" + url +"\" rel=\"noopener noreferrer\" target=\"_blank\">" + text + "</a>";
	};
	base.prototype.openInNewTabOrWindow = function(url) {
		// BTW - you can open links from vim with gx :-)
		// There's a discussion about this at https://stackoverflow.com/a/11384018/685715
		// TODO - do we need to check for popup-blockers? 
		//        See https://stackoverflow.com/questions/2914/how-can-i-detect-if-a-browser-is-blocking-a-popup
		const win = window.open(url, '_blank');
		win.focus();
	};


	var pub = {
		base: base
	};
	return pub;
});

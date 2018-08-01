// Set up the various sidebars
define(["d3", "view/base"], function(d3, view) {
	"use strict";

	// base is the "base class" of all sidebars:
	function base(){}

	// sidebars inherit from view.base:
	var proto = Object.create(view.base.prototype);

	// add properties to sidebar:
	proto.title = "Untitled";
	proto.getFixedHtml = function() {
		// override this default in derived view objects:
		return "";
	};
	proto.getScrollableHtml = function() {
		// override this default in derived view objects:
		return "";
	};

	proto.loadHeader = function() {
		console.log("view/sidebar/loadHeader");
		document.getElementById('sidebar-title').innerHTML = this.title;
	};
	proto.loadFixedSection = function() {
		console.log("view/sidebar/loadFixedSection");
	};
	proto.loadScrollableSection = function() {
		console.log("view/sidebar/loadScrollableSection");
		document.getElementById('sidebar-scrollable-section').innerHTML = this.getScrollableHtml();
	};
	proto.reload = function() {
		this.loadHeader();
		this.loadFixedSection();
		this.loadScrollableSection();
	};
	base.prototype = proto;

	var pub = {
		base: base
	};
	return pub;
});

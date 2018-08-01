// Set up the various sidebars
define(["d3", "view/base"], function(d3, view) {
	"use strict";

	// base is the "base class" of all sidebars:
	function base(){}

	// sidebars inherit from view.base:
	var proto = Object.create(view.base.prototype);

	// add properties to sidebar:
	proto.title = "Untitled";
	proto.hasHistoryNavigation = true;	// by default - change this in derived sidebar view objects if necessary.

	proto.populateScrollableSelection = function(selection) {
		// override this default in derived view objects:
	};
	proto.populateFixedSelection = function(selection) {
		// override this default in derived view objects:
	};

	proto.loadHeader = function() {
		var selection = this.d3selectAndClear('#sidebar-title');
		selection.text(this.title);
	};
	proto.loadFixedSection = function() {
		this.populateFixedSelection(this.d3selectAndClear('#sidebar-fixed-section'));
	};
	proto.loadScrollableSection = function() {
		this.populateScrollableSelection(this.d3selectAndClear('#sidebar-scrollable-section'));
	};
	proto.loadHistoryNavigation = function() {
		// Fwd/back navigation for moving around the contentStack of a particular sidebar
		// (e.g. moving between different search results)
		var buttons = this.presenter.historyNavigation();
		var buttonClasses = 'w3-teal w3-cell w3-btn w3-border-0';
		var selection = this.d3selectAndClear('#sidebar-history-navigation');
		if (this.hasHistoryNavigation) {
			selection.attr('class', 'w3-cell-row').append('button').
				// Minor issue: if we add the class w3-mobile to these buttons, then each takes up a whole line
				// on an iPhone, instad of being next to each other on the same line.
				attr('class', buttonClasses).
				on('click', buttons.back.onClick).
				append('i').
				attr('class', 'w3-small fa fa-arrow-left');

			selection.append('button').
				attr('class', buttonClasses).
				on('click', buttons.forward.onClick).
				append('i').
				attr('class', 'w3-small fa fa-arrow-right');
		}
	};
	proto.reload = function() {
		this.loadHeader();
		this.loadFixedSection();
		this.loadHistoryNavigation();	// back and forward buttons
		this.loadScrollableSection();
	};
	proto.refresh = function() {
		// Only refreshes things that may change in a sidebar
		this.loadFixedSection();
		this.loadHistoryNavigation();	// back and forward buttons
		this.loadScrollableSection();
	};
	base.prototype = proto;

	var pub = {
		base: base
	};
	return pub;
});

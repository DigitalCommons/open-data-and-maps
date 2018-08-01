define([], function() {
	"use strict";

	// 'Base class' for all views:
	// @todo use this base for the older view objects - they were created originally before this base existed.
	var base = function(){
	};
	base.prototype = {
		presenter: null,
		setPresenter: function(p) { this.presenter = p; }
	};

	var pub = {
		base: base
	};
	return pub;
});

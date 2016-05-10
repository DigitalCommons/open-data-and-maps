define( [], function() {
	"use strict";

	var view;

	function registerView(v) {
		view = v;
		return {};
	}

	var pub = {
		registerView: registerView
	};
	return pub;
});

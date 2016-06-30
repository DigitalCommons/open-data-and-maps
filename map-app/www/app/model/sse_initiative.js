// Model for SSE Initiatives.
define(["app/eventbus"], function(eventbus) {
	"use strict";

	var objects = [];

	function Initiative(name, uri, lat, lng, www) {
		Object.defineProperties(this, {
			name: { value: name, enumerable: true },
			uri: { value: uri, enumerable: true },
			lat: { value: lat, enumerable: true },
			lng: { value: lng, enumerable: true },
			www: { value: www, enumerable: true }
		});
		objects.push(this);
		eventbus.publish({topic: "Initiative.new", data: this});
	}
	function add(json) {
		json.forEach(function(e) {
			new Initiative(e.name, e.uri, e.lat, e.lng, e.www);
		});
	}
	var pub = {
		add: add
	};
	return pub;
});

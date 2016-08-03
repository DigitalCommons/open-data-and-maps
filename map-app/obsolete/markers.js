define( ["model/point", "app/eventbus"], function(point, eventbus) {
	"use strict";

	var store = {
	};
	function setMarker(lat, lng, markerName, markerOptions) {
		// TODO - check why the following line was there. Should we be using opts, not markerOptions below?
		// var opts = Object.assign({cluster: false}, markerOptions);
		if (store[markerName]) {
			eventbus.publish({topic: "Point.remove", data: {point: store[markerName]}});
		}
		store[markerName] = new point.Point(lat, lng);
		eventbus.publish({topic: "Point.add", data: {point: store[markerName], options: markerOptions}});
	}

	var pub = {
		setMarker: setMarker
	};
	return pub;
});


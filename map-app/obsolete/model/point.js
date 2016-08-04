define( ["model/userdata"], function(userdata) {
	"use strict";

	// Point is a location on the Earth in latitude and longitude, and includes (optionally) an elevation.
	// Other optional properties:
	//
	// 	userdata		To enable the client code to stor information with the Point (e.g. References to objects in the View).
	//
	function Point(lat, lng, ele, opts) {
		opts = opts || {};
		Object.defineProperties(this, {
			lat: { value: lat, enumerable: true },
			lng: { value: lng, enumerable: true },
			ele: { value: ele, enumerable: true }
			// userdata: property created if setUserData is called.
		});
		//console.log(this);
	}
	Point.prototype.dump = function() {
		return "lat: " + this.lat + ", lng: " + this.lng + ", ele: " + this.ele;
	};
	// We don't define userdata as a property of Point, because we want it to be created on demand,
	// so it does not take up unnecessary space in this highly numerous object.
	Point.prototype.setUserData = userdata.setUserData;
	Point.prototype.getUserData = userdata.getUserData;

	var TORADIANS = Math.PI / 180;
	Point.prototype.distanceTo = function(p) {
		// Uses Haversine - more accurate over short distances.
		var R = 6371000; // metres
		var thisLatRad = this.lat * TORADIANS;
		var pLatRad = p.lat * TORADIANS;
		var latDiffRad = (p.lat - this.lat) * TORADIANS;
		var lngDiffRad = (p.lng - this.lng) * TORADIANS;

		var a = Math.sin(latDiffRad / 2) * Math.sin(latDiffRad / 2) +
			Math.cos(thisLatRad) * Math.cos(pLatRad) *
			Math.sin(lngDiffRad / 2) * Math.sin(lngDiffRad / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		//console.log("Point.distanceTo: " + R * c + " metres");
		return R * c;
	};

	var pub = {
		Point: Point
	};
	return pub;
});


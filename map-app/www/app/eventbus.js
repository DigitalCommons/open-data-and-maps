// Using the postal.js publish/subscribe event bus.
// See https://github.com/postaljs/postal.js
//
define(["postal"], function(postal) {
	"use strict";

	// TODO - If we need to configure postal for our use, do it here.

	// For now, we expose all of postal as the interface to our eventbus
	return postal;
});



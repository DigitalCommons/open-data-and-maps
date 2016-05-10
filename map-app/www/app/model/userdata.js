define( [], function() {
	"use strict";

	function setUserData(prop, val) {
		if (this.userdata === undefined) {
			this.userdata = {};
		}
		this.userdata[prop] = val;
	}
	function getUserData(prop) {
		return this.userdata && this.userdata[prop];
	}

	var pub = {
		setUserData: setUserData,
		getUserData: getUserData
	};
	return pub;
});



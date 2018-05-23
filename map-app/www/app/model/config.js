define(["json!configuration/config"], function(config_json) {
	"use strict";

	// The purpose of this module is to insulate the rest of the application from
	// changes made to the format of the config_json.
	function namedDatasets() {
		//console.log("namedDatasets()")
		//console.log(config_json);
		return config_json.namedDatasets;
	}
	var pub = {
		namedDatasets: namedDatasets
	};
	return pub;
});


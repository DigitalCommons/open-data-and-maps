define(["json!configuration/config", "json!configuration/version.json"], function(config_json, version_json) {
	"use strict";

	console.log(version_json);
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


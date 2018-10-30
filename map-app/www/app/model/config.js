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
	function htmlTitle() {
		return config_json.htmlTitle;
	}
	function getSoftwareVariant() {
		return version_json.variant;
	}
	function getSoftwareTimestamp() {
		return version_json.timestamp;
	}
	function getSoftwareGitCommit() {
		return version_json.gitcommit;
	}
	var pub = {
		getSoftwareTimestamp: getSoftwareTimestamp,
		getSoftwareVariant: getSoftwareVariant,
		getSoftwareGitCommit: getSoftwareGitCommit,
		namedDatasets: namedDatasets,
		htmlTitle: htmlTitle
	};
	return pub;
});


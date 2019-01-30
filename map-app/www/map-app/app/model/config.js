define(["json!configuration/config", "json!configuration/version.json", "text!configuration/about.html!strip", "d3"], function(config_json, version_json, about_html, d3) {
	"use strict";

	var html = {};
	console.log(version_json);
	//console.log(about_html);
	html.about = about_html;
	/*
	d3.text("configuration/about.html").then(function(aboutHtml) {
		// TODO - error handling
		// TODO - can we use d3.html to parse the about.html?
		//        We'd then need to extract one <div class="about">
		//        from the parsed htnl. How?
		console.log(aboutHtml);
		html.about = aboutHtml;
	});
	*/
	function aboutHtml() {
		return html.about;
	}
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
	function getServicesPath() {
		return "map-app/services/";
	}
	function showDatasetInHoverText() {
	   return config_json.showDatasetInHoverText;
	}
	var pub = {
		getSoftwareTimestamp: getSoftwareTimestamp,
		getSoftwareVariant: getSoftwareVariant,
		getSoftwareGitCommit: getSoftwareGitCommit,
		getServicesPath: getServicesPath,
		namedDatasets: namedDatasets,
		htmlTitle: htmlTitle,
		aboutHtml: aboutHtml,
		showDatasetInHoverText: showDatasetInHoverText
	};
	return pub;
});


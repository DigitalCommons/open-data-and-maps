define([
  "json!configuration/config",
  "json!configuration/version.json",
  "text!configuration/about.html!strip",
], function(config_json, version_json, about_html) {
  "use strict";

  var html = {};
  console.log(version_json);
  console.log(about_html);
  html.about = about_html;
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
    return "services/";
  }
  function getNongeoLatLng() {
    return config_json.defaultNongeoLatLng
      ? config_json.defaultNongeoLatLng
      : { lat: undefined, lng: undefined };
  }
  function getInitialBounds() {
    // It's ok if this returns undefined – Leaflet will set the bounds automatically
    return config_json.initialBounds;
  }
  function getFilterableFields() {
    return config_json.filterableFields;
  }
  function doesDirectoryHaveColours() {
    return config_json.doesDirectoryHaveColours;
  }
  function getDisableClusteringAtZoom() {
    return config_json.disableClusteringAtZoom;
  }
  var pub = {
    getSoftwareTimestamp: getSoftwareTimestamp,
    getSoftwareVariant: getSoftwareVariant,
    getSoftwareGitCommit: getSoftwareGitCommit,
    getServicesPath: getServicesPath,
    namedDatasets: namedDatasets,
    htmlTitle: htmlTitle,
    aboutHtml: aboutHtml,
    getNongeoLatLng: getNongeoLatLng,
    getInitialBounds: getInitialBounds,
    getFilterableFields: getFilterableFields,
    doesDirectoryHaveColours: doesDirectoryHaveColours,
    getDisableClusteringAtZoom: getDisableClusteringAtZoom
  };
  return pub;
});

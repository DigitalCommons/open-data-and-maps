// The view aspects of the Main Menu sidebar
define([
  "d3",
  "app/eventbus",
  "presenter/sidebar/directory",
  "view/sidebar/base",
  "model/config"
], function(d3, eventbus, presenter, sidebarView, config) {
  "use strict";

  // Our local Sidebar object:
  function Sidebar() {}

  // Our local Sidebar inherits from sidebar:
  var proto = Object.create(sidebarView.base.prototype);

  // And adds some overrides and new properties of it's own:
  proto.title = "Directory";

  proto.populateFixedSelection = function(selection) {
    let sidebarTitle = proto.title;
    selection
      .append("div")
      .attr("class", "w3-container")
      .append("h1")
      .text(sidebarTitle);
  };

  proto.populateScrollableSelection = function(selection) {
    let that = this;
    let registeredActivities = this.presenter.getRegisteredActivities();
    let list = selection.append("ul").classed("sea-directory-list", true);
    let activityList = this.presenter.getActivityList();
    Object.keys(registeredActivities)
      .sort(function(a, b) {
        return parseInt(a.replace("AM", "")) - parseInt(b.replace("AM", ""));
      })
      .forEach(function(key) {
        list
          .append("li")
          .text(activityList[key])
          .on("click", function() {
            that.listInitiatives(key);
            d3.select(".sea-activity-active").classed(
              "sea-activity-active",
              false
            );
            d3.select(this).classed("sea-activity-active", true);
          });
      });
  };

  proto.listInitiatives = function(activityKey) {
    // Get the list of initiatives from the presenter
    let initiatives = this.presenter.getInitiativesForActivityKey(activityKey);
    let sidebar = d3.select("#map-app-sidebar");
    let sidebarButton = document.getElementById("map-app-sidebar-button");
    let initiativeSidebar = document.getElementById("sea-initative-sidebar");
    let selection = this.d3selectAndClear("#sea-initiative-sidebar-content");
    // Move sidebar button into initiatives panel so it animates with it
    // (if we add a way to close this sidebar we'll need to move it back)
    initiativeSidebar.insertBefore(sidebarButton, selection.node());
    let list = selection.append("ul").classed("sea-initiative-list", true);
    for (let value of initiatives) {
      list
        .append("li")
        .text(value.name)
        .on("click", function() {
          console.log("that.showInitiative(value.uniqueId)", value.uniqueId);
        });
    }
    sidebar.classed("sea-sidebar-list-initiatives", true);
  };

  Sidebar.prototype = proto;

  function createSidebar() {
    var view = new Sidebar();
    view.setPresenter(presenter.createPresenter(view));
    return view;
  }
  var pub = {
    createSidebar: createSidebar
  };
  return pub;
});

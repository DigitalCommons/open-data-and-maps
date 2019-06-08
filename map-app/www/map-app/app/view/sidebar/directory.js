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
    let textContent = "Directory";
    selection
      .append("div")
      .attr("class", "w3-container")
      .append("h1")
      .text(textContent);
  };

  proto.populateScrollableSelection = function(selection) {
    let registeredActivities = this.presenter.getRegisteredActivities();
    let list = selection.append("ul").classed("sea-directory-list", true);
    let activityList = this.presenter.getActivityList();
    const orderedActivities = {};
    Object.keys(registeredActivities)
      .sort(function(a, b) {
        return parseInt(a.replace("AM", "")) - parseInt(b.replace("AM", ""));
      })
      .forEach(function(key) {
        orderedActivities[key] = registeredActivities[key];
      });
    for (let val in orderedActivities) {
      list.append("li").text(activityList[val]);
    }
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

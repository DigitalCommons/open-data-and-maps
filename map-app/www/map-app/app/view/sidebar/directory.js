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
  proto.hasHistoryNavigation = false;

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
    let activities = this.presenter.getActivities();

    Object.keys(registeredActivities)
      .sort(function(a, b) {
        return parseInt(a.replace("AM", "")) - parseInt(b.replace("AM", ""));
      })
      .forEach(function(key) {
        list
          .append("li")
          .text(activities[key])
          .classed("sea-activity-" + key.toLowerCase(), true)
          .on("click", function() {
            that.listInitiativesForActivity(key);
            d3.select(".sea-activity-active").classed(
              "sea-activity-active",
              false
            );
            d3.select(this).classed("sea-activity-active", true);
          });
      });
  };

  proto.listInitiativesForActivity = function(activityKey) {
    let that = this;
    let initiatives = this.presenter.getInitiativesForActivityKey(activityKey);
    let sidebar = d3.select("#map-app-sidebar");
    let sidebarButton = document.getElementById("map-app-sidebar-button");
    let initiativeListSidebar = document.getElementById(
      "sea-initiatives-list-sidebar"
    );
    let selection = this.d3selectAndClear(
      "#sea-initiatives-list-sidebar-content"
    );
    let activities = this.presenter.getActivities();
    let list;
    initiativeListSidebar.insertBefore(sidebarButton, selection.node());
    initiativeListSidebar.className = initiativeListSidebar.className.replace(
      /sea-activity-am\d\d\d?/,
      ""
    );
    initiativeListSidebar.classList.add(
      "sea-activity-" + activityKey.toLowerCase()
    );
    selection
      .append("h2")
      .classed("sea-activity", true)
      .text(activities[activityKey]);
    list = selection.append("ul").classed("sea-initiative-list", true);
    for (let initiative of initiatives) {
      list
        .append("li")
        .text(initiative.name)
        .attr("data-uid", initiative.uniqueId)
        .on("click", function() {
          that.presenter.initiativeClicked(
            initiative,
            sidebarView.sidebarWidth
          );
          // eventbus.publish({
          //   topic: "Directory.initiativeClicked",
          //   data: {
          //     initiative: initiative,
          //     sidebarWidth: sidebarView.sidebarWidth
          //   }
          // });
          // that.presenter.initiativeClicked(initiative);
          d3.select(".sea-initiative-active").classed(
            "sea-initiative-active",
            false
          );
          d3.select(this).classed("sea-initiative-active", true);
        });
    }
    sidebar
      .on("transitionend", function() {
        if (event.propertyName === "transform") {
          let boundingRect = initiativeListSidebar.getBoundingClientRect();
          // Need to use el.getBoundingClientRect() because some the item has been animated using transforms
          sidebarView.sidebarWidth = boundingRect.x + boundingRect.width;
        }
      })
      .classed("sea-sidebar-list-initiatives", true);
  };

  proto.populateInitiativeSidebar = function(initiative, initiativeContent) {
    let initiativeSidebar = d3.select("#sea-initiative-sidebar");
    let initiativeContentElement = d3.select("#sea-initiative-sidebar-content");
    initiativeContentElement.html(initiativeContent);
    initiativeSidebar.classed("sea-initiative-sidebar-open", true);
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

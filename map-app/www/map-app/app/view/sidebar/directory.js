// The view aspects of the Main Menu sidebar
define([
  "d3",
  "app/eventbus",
  "presenter/sidebar/directory",
  "view/sidebar/base"
], function(d3, eventbus, presenter, sidebarView) {
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
    let list = selection
      .append("ul")
      .classed("sea-directory-list", true)
      .classed("colours", this.presenter.doesDirectoryHaveColours());

    let registeredValues = this.presenter.getRegisteredValues();

    // Just run om the first property for now
    // TODO: Support user selectable fields
    for (let field in registeredValues) {
      let directoryField = field;
      let valuesByName = this.presenter.getAllValuesByName(directoryField);
      Object.keys(registeredValues[field])
        .sort(function(a, b) {
          // Check if we're working numerically or alpabetically
          if (parseInt(a.replace(/[^\d]/g, "")) === "NaN") {
            if (a.replace(/\d/gi, "") < b.replace(/d/gi, "")) {
              return -1;
            }
            if (a.replace(/\d/gi, "") > b.replace(/d/gi, "")) {
              return 1;
            }
            return 0;
          } else {
            return (
              parseInt(a.replace(/[^\d]/g, "")) -
              parseInt(b.replace(/[^\d]/g, ""))
            );
          }
        })
        .forEach(key => {
          list
            .append("li")
            .text(valuesByName[key])
            .classed("sea-field-" + key.toLowerCase(), true)
            .on("click", function() {
              that.listInitiativesForSelection(directoryField, key);
              d3.select(".sea-field-active").classed("sea-field-active", false);
              d3.select(this).classed("sea-field-active", true);
            });
        });
      break;
    }
  };

  proto.listInitiativesForSelection = function(directoryField, selectionKey) {
    let that = this;
    let initiatives = this.presenter.getInitiativesForFieldAndSelectionKey(
      directoryField,
      selectionKey
    );
    let sidebar = d3.select("#map-app-sidebar");
    let sidebarButton = document.getElementById("map-app-sidebar-button");
    d3.select(".w3-btn").attr("title", "Hide initiatives");
    let initiativeListSidebar = document.getElementById(
      "sea-initiatives-list-sidebar"
    );
    let selection = this.d3selectAndClear(
      "#sea-initiatives-list-sidebar-content"
    );
    let values = this.presenter.getAllValuesByName("Countries");
    let list;
    initiativeListSidebar.insertBefore(sidebarButton, selection.node());
    initiativeListSidebar.className = initiativeListSidebar.className.replace(
      /sea-field-[^\s]*/,
      ""
    );
    initiativeListSidebar.classList.add(
      "sea-field-" + selectionKey.toLowerCase()
    );
    selection
      .append("h2")
      .classed("sea-field", true)
      .text(values[selectionKey]);
    list = selection.append("ul").classed("sea-initiative-list", true);
    for (let initiative of initiatives) {
      let activeClass = "";
      if (
        this.presenter.contentStack.current() &&
        this.presenter.contentStack.current().initiatives[0] === initiative
      ) {
        activeClass = "sea-initiative-active";
      }
      list
        .append("li")
        .text(initiative.name)
        .attr("data-uid", initiative.uniqueId)
        .classed(activeClass, true)
        .on("click", function() {
          // that.presenter.initiativeClicked(initiative);
          eventbus.publish({
            topic: "Directory.InitiativeClicked",
            data: initiative
          });
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
    // Highlight the correct initiative in the directory
    d3.select(".sea-initiative-active").classed("sea-initiative-active", false);
    d3.select('[data-uid="' + initiative.uniqueId + '"]').classed(
      "sea-initiative-active",
      true
    );
    let initiativeSidebar = d3.select("#sea-initiative-sidebar");
    let initiativeContentElement = d3.select("#sea-initiative-sidebar-content");
    initiativeContentElement.html(initiativeContent);
    initiativeSidebar.classed("sea-initiative-sidebar-open", true);
    if (document.getElementById("map-app-leaflet-map").clientWidth < 800)
      eventbus.publish({
        topic: "Sidebar.showSidebar"
      });
  };

  proto.deselectInitiativeSidebar = function() {
    d3.select(".sea-initiative-active").classed("sea-initiative-active", false);
    let initiativeSidebar = d3.select("#sea-initiative-sidebar");
    // let initiativeContentElement = d3.select("#sea-initiative-sidebar-content");
    // initiativeContentElement.html(initiativeContent);
    initiativeSidebar.classed("sea-initiative-sidebar-open", false);
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

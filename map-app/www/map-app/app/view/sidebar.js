// Set up the various sidebars
define([
  "d3",
  "view/base",
  "presenter/sidebar",
  "view/sidebar/mainmenu",
  "view/sidebar/initiatives",
  "view/sidebar/about",
  "view/sidebar/directory"
], function(d3, viewBase, presenter, mainMenu, initiatives, about, directory) {
  "use strict";

  // This deals with the view object that controls the sidebar
  // It is not itself a sidebar/view object, but contains objects of that type

  function SidebarView() {}
  // inherit from the standard view base object:
  var proto = Object.create(viewBase.base.prototype);

  proto.createOpenButton = function() {
    // d3 selection redefines this, so hang onto it here:
    var that = this;
    var selection = this.d3selectAndClear("#map-app-sidebar-button")
      .append("button")
      .attr("class", "w3-btn")
      .attr("title", "Show sidebar")
      .on("click", function() {
        that.showSidebar();
      })
      .append("i")
      .attr("class", "fa fa-angle-right");
  };
  proto.createButtonRow = function() {
    // d3 selection redefines this, so hang onto it here:
    var that = this;
    var selection = this.d3selectAndClear("#map-app-sidebar-header");

    // Button for hiding the sidebar:
    // selection
    //   .append("button")
    //   .attr("class", "w3-teal w3-cell w3-button w3-border-0")
    //   .attr("title", "Hide sidebar")
    //   .on("click", function() {
    //     that.hideSidebar();
    //   })
    //   .append("i")
    //   .attr("class", "fa fa-angle-left");

    // This is where the navigation buttons will go.
    // These are recreated when the sidebar is changed, e.g. from MainMenu to initiatives.
    selection.append("i").attr("id", "map-app-sidebar-history-navigation");

    // The sidebar has a button that cuases the main menu to be dispayed
    selection
      .append("button")
      .attr("class", "w3-button w3-border-0 ml-auto")
      .attr("title", "Show directory")
      .on("click", function() {
        that.changeSidebar("directory");
      })
      .append("i")
      .attr("class", "fa fa-bars");

    selection = selection
      .append("button")
      .attr("class", "w3-button w3-border-0")
      .attr("title", "Show info")
      .on("click", function() {
        that.changeSidebar("about");
      })
      .append("i")
      .attr("class", "fa fa-info-circle");
  };
  proto.createSidebars = function() {
    this.sidebar = {
      about: about.createSidebar(),
      initiatives: initiatives.createSidebar(),
      mainMenu: mainMenu.createSidebar(),
      directory: directory.createSidebar()
    };
  };
  proto.changeSidebar = function(name) {
    this.sidebar[name].refresh();
  };
  proto.showSidebar = function() {
    var that = this;
    d3.select("#map-app-sidebar")
      .classed("sea-sidebar-open", true)
      .on("transitionend", function() {
        if (event.propertyName === "transform")
          d3.select("#map-app-sidebar-button").on("click", function() {
            that.hideSidebar();
          });
      });
    d3.select("#map-app-sidebar i").attr("class", "fa fa-angle-left");
  };
  proto.hideSidebarIfItTakesWholeScreen = function() {
    // @todo - improve this test -
    // it is not really testing the predicate suggested by the name iof the function.
    if (window.innerWidth <= 600) {
      d3.select("#map-app-sidebar").classed("sea-sidebar-open", false);
      d3.select("#map-app-sidebar i").attr("class", "fa fa-angle-right");
    }
  };
  proto.hideSidebar = function() {
    var that = this;
    d3.select("#map-app-sidebar")
      .classed("sea-sidebar-open", false)
      .on("transitionend", function() {
        if (event.propertyName === "transform")
          d3.select("#map-app-sidebar-button").on("click", function() {
            that.showSidebar();
          });
      });
    d3.select("#map-app-sidebar i").attr("class", "fa fa-angle-right");
  };
  SidebarView.prototype = proto;
  var view;

  function init() {
    view = new SidebarView();
    view.setPresenter(presenter.createPresenter(view));
    view.createOpenButton();
    view.createButtonRow();
    view.createSidebars();
    view.changeSidebar("directory");
  }
  var pub = {
    init: init
  };
  return pub;
});

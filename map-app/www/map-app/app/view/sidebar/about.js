// The view aspects of the About sidebar
define([
  "d3",
  "app/eventbus",
  "presenter/sidebar/about",
  "view/sidebar/base"
], function(d3, eventbus, presenter, sidebarView) {
  "use strict";

  // Our local Sidebar object:
  function Sidebar() {}

  // Our local Sidebar inherits from sidebar:
  var proto = Object.create(sidebarView.base.prototype);

  // And adds some overrides and new properties of it's own:
  proto.title = "about";
  proto.hasHistoryNavigation = false; // No forward/back buttons for this sidebar

  // TODO These same consts are here and in view/sidebar/initiative.
  //      Find a common place for them.
  const sectionHeadingClasses =
    "w3-bar-item w3-tiny w3-light-grey w3-padding-small";
  const hoverColour = " w3-hover-light-blue";
  const accordionClasses =
    "w3-bar-item w3-tiny w3-light-grey w3-padding-small" + hoverColour;
  const sectionClasses = "w3-bar-item w3-small w3-white w3-padding-small";

  proto.populateFixedSelection = function(selection) {
    let textContent = "About";
    selection
      .append("div")
      .attr("class", "w3-container")
      .append("h1")
      .text(textContent);
  };

  proto.populateScrollableSelection = function(selection) {
    const that = this;
    //selection.append('div').attr("class", "w3-container w3-center").append('p').text("Information about this map will be available here soon.");
    //selection.append('div').attr("class", "w3-container w3-center").html(that.presenter.aboutHtml());
    selection
      .append("div")
      .attr("class", "w3-container")
      .html(that.presenter.aboutHtml());
  };

  Sidebar.prototype = proto;

  proto.hasHistoryNavigation = false;

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

define(["app/eventbus", "model/config", "presenter/sidebar/base"], function(
  eventbus,
  config,
  sidebarPresenter
) {
  "use strict";

  function Presenter() {}

  var proto = Object.create(sidebarPresenter.base.prototype);

  proto.aboutButtonClicked = function() {
    console.log("aboutButtonClicked");
    eventbus.publish({ topic: "Sidebar.showAbout" });
  };
  proto.initiativesButtonClicked = function() {
    console.log("directoryButtonClicked");
    eventbus.publish({ topic: "Sidebar.showInitiatives" });
  };
  proto.getButtons = function() {
    return [
      {
        label: "About",
        disabled: false,
        hovertext: "Information about this map",
        onClick: this.aboutButtonClicked
      },
      {
        label: "Directory",
        disabled: false,
        hovertext: "Directory of initiatives",
        onClick: this.directoryButtonClicked
      }
    ];
  };
  Presenter.prototype = proto;

  // @todo
  // Create a bunch of buttons that raise events when they are clicked.
  // We can then plumb the events into other presenters, e.g. the presenter fo the search results.
  // That way, we have looser coupling :-)

  function createPresenter(view) {
    var p = new Presenter();
    p.registerView(view);
    return p;
  }
  var pub = {
    createPresenter: createPresenter
  };
  return pub;
});

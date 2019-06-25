define(["app/eventbus", "model/config", "presenter"], function(
  eventbus,
  config,
  presenter
) {
  "use strict";

  // This is the presenter for the view/sidebar object.
  // Don't confuse this with the base object for all sidebar objects, which is in presenter/sidebar/base.

  function Presenter() {}

  var proto = Object.create(presenter.base.prototype);
  proto.changeSidebar = function(name) {
    this.view.changeSidebar(name);
    this.view.showSidebar();
  };

  proto.showSidebar = function(name) {
    this.view.showSidebar();
  };

  Presenter.prototype = proto;

  function createPresenter(view) {
    var p = new Presenter();
    p.registerView(view);

    // eventbus.subscribe({
    //   topic: "Sidebar.showInitiatives",
    //   callback: function() {
    //     p.changeSidebar("initiatives");
    //   }
    // });

    eventbus.subscribe({
      topic: "Sidebar.showAbout",
      callback: function() {
        p.changeSidebar("about");
      }
    });

    eventbus.subscribe({
      topic: "Sidebar.showSidebar",
      callback: function() {
        p.showSidebar();
      }
    });

    // eventbus.subscribe({
    //   topic: "Initiative.selected",
    //   callback: function() {
    //     view.hideSidebarIfItTakesWholeScreen();
    //   }
    // });

    return p;
  }
  var pub = {
    createPresenter: createPresenter
  };
  return pub;
});

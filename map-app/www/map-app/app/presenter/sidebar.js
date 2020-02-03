define([
  "app/eventbus",
  "model/config",
  "presenter",
  "presenter/sidebar/base"
], function(eventbus, config, presenter, sidebarPresenter) {
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

  proto.hideSidebar = function(name) {
    this.view.hideSidebar();
  };

  proto.hideInitiativeSidebar = function(name) {
    this.view.hideInitiativeSidebar();
  };

  proto.hideInitiativeList = function(name) {
    this.view.hideInitiativeList();
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

    eventbus.subscribe({
      topic: "Sidebar.hideSidebar",
      callback: function() {
        p.hideSidebar();
      }
    });

    eventbus.subscribe({
      topic: "Sidebar.hideInitiativeSidebar",
      callback: function() {
        p.hideInitiativeSidebar();
      }
    });

    eventbus.subscribe({
      topic: "Sidebar.hideInitiativeList",
      callback: function() {
        p.hideInitiativeList();
      }
    });

    eventbus.subscribe({
      topic: "Sidebar.updateSidebarWidth",
      callback: function(data) {
        sidebarPresenter.updateSidebarWidth(data);
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

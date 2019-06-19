define([
  "app/eventbus",
  "model/config",
  "model/sse_initiative",
  "presenter/sidebar/base",
  "view/map/marker"
], function(eventbus, config, sseInitiative, sidebarPresenter, markerView) {
  "use strict";

  function StackItem(initiatives) {
    this.initiatives = initiatives;
  }
  StackItem.prototype.isSearchResults = function() {
    // TODO - surely there's a more direct way to decide if this is a SearchResults object?
    return this.hasOwnProperty("searchString");
  };

  // function SearchResults(initiatives, searchString) {
  // 	// isa StackItem
  // 	StackItem.call(this, initiatives);
  // 	this.searchString = searchString;
  // }
  // SearchResults.prototype = Object.create(StackItem.prototype);

  function Presenter() {}

  var proto = Object.create(sidebarPresenter.base.prototype);

  const activities = {
    AM00: "All Activities",
    AM10: "Arts, Media, Culture & Leisure",
    AM20: "Campaigning, Activism & Advocacy",
    AM30: "Community & Collective Spaces",
    AM40: "Education",
    AM50: "Energy",
    AM60: "Food",
    AM70: "Goods & Services",
    AM80: "Health, Social Care & Wellbeing",
    AM90: "Housing",
    AM100: "Money & Finance",
    AM110: "Nature, Conservation & Environment",
    AM120: "Reduce, Reuse, Repair & Recycle"
  };

  proto.currentItem = function() {
    return this.contentStack.current();
  };
  proto.currentItemExists = function() {
    // returns true only if the contentStack is empty
    return typeof this.contentStack.current() !== "undefined";
  };

  proto.getActivities = function() {
    return activities;
  };

  proto.getRegisteredActivities = function() {
    return sseInitiative.getRegisteredActivities();
  };

  proto.notifyViewToBuildDirectory = function() {
    this.view.refresh();
  };

  proto.getInitiativesForActivityKey = function(key) {
    return sseInitiative.getRegisteredActivities()[key];
  };

  proto.getInitiativeByUniqueId = function(uid) {
    return sseInitiative.getInitiativeByUniqueId(uid);
  };

  function arrayMax(array) {
    return array.reduce((a, b) => Math.max(a, b));
  }
  function arrayMin(array) {
    return array.reduce((a, b) => Math.min(a, b));
  }

  proto.notifyMapNeedsToNeedsToBeZoomedAndPanned = function(sidebarWidth) {
    const initiatives = this.contentStack.current().initiatives;
    sidebarWidth = sidebarWidth || 0;
    const lats = initiatives.map(x => x.lat);
    const lngs = initiatives.map(x => x.lng);

    if (initiatives.length > 0) {
      eventbus.publish({
        topic: "Map.needsToBeZoomedAndPanned",
        data: {
          bounds: [
            [arrayMin(lats), arrayMin(lngs)],
            [arrayMax(lats), arrayMax(lngs)]
          ],
          options: {
            paddingTopLeft: [sidebarWidth, window.innerHeight / 2],
            paddingBottomRight: [0, 0]
          }
        }
      });
    }
  };

  proto.initiativeClicked = function(initiative, sidebarWidth) {
    // console.log(initiative.name);
    const lastContent = this.contentStack.current();
    this.contentStack.append(new StackItem([initiative]));
    eventbus.publish({
      topic: "Markers.needToShowLatestSelection",
      data: {
        unselected: lastContent ? lastContent.initiatives : [],
        selected: this.contentStack.current().initiatives
      }
    });
    // let marker = this.notifyMarkersNeedToShowNewSelection(lastContent);
    // L.on("moveend", function() {
    //   L.openPopup(initiative.marker);
    // });
    this.notifyMapNeedsToNeedsToBeZoomedAndPanned(sidebarWidth);
    initiative.marker.marker.openPopup();
    this.view.populateInitiativeSidebar(
      initiative,
      markerView.getInitiativeContent(initiative)
    );
    // initiative.marker.setSelected();
    // Need to get display an overlay containing the initiative info
  };

  Presenter.prototype = proto;

  function createPresenter(view) {
    var p = new Presenter();
    p.registerView(view);
    // Populate the directory with the registered activities
    eventbus.subscribe({
      topic: "Initiative.datasetLoaded",
      callback: function(data) {
        p.notifyViewToBuildDirectory();
      }
    });
    // eventbus.subscribe({topic: "Marker.SelectionToggled", callback: function(data) { p.onMarkerSelectionToggled(data); } });
    // eventbus.subscribe({topic: "Marker.SelectionSet", callback: function(data) { p.onMarkerSelectionSet(data); } });

    return p;
  }
  var pub = {
    createPresenter: createPresenter
  };
  return pub;
});

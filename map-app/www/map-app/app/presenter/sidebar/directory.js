define([
  "app/eventbus",
  "model/config",
  "model/sse_initiative",
  "presenter/sidebar/base"
], function(eventbus, config, sseInitiative, sidebarPresenter) {
  "use strict";

  // function StackItem(initiatives) {
  // 	this.initiatives = initiatives;
  // }
  // StackItem.prototype.isSearchResults = function() {
  // 	// TODO - surely there's a more direct way to decide if this is a SearchResults object?
  // 	return this.hasOwnProperty('searchString');
  // }

  // function SearchResults(initiatives, searchString) {
  // 	// isa StackItem
  // 	StackItem.call(this, initiatives);
  // 	this.searchString = searchString;
  // }
  // SearchResults.prototype = Object.create(StackItem.prototype);

  function Presenter() {}

  var proto = Object.create(sidebarPresenter.base.prototype);

  const activityList = {
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

  proto.getActivityList = function() {
    return activityList;
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

  // proto.currentItem = function() {
  // 	return this.contentStack.current();
  // };
  // proto.currentItemExists = function() {
  // 	// returns true only if the contentStack is empty
  // 	return typeof this.contentStack.current() !== 'undefined';
  // };
  // proto.notifyMarkersNeedToShowNewSelection = function(lastContent) {
  // 	eventbus.publish({
  // 		topic: "Markers.needToShowLatestSelection",
  // 		data: {
  // 			unselected: lastContent ? lastContent.initiatives : [],
  // 			selected: this.contentStack.current().initiatives
  // 		}
  // 	});
  // }
  // function arrayMax(array) {
  // 	return array.reduce((a, b) => Math.max(a, b));
  // }
  // function arrayMin(array) {
  // 	return array.reduce((a, b) => Math.min(a, b));
  // }
  // proto.notifyMapNeedsToNeedsToBeZoomedAndPanned = function() {
  // 	const initiatives = this.contentStack.current().initiatives;
  // 	const lats = initiatives.map(x => x.lat);
  // 	const lngs = initiatives.map(x => x.lng);

  // 	if (initiatives.length > 0) {
  // 		eventbus.publish({
  // 			topic: "Map.needsToBeZoomedAndPanned",
  // 			data: [[arrayMin(lats), arrayMin(lngs)], [arrayMax(lats), arrayMax(lngs)]]
  // 		});
  // 	}
  // }
  // proto.notifyShowInitiativeTooltip = function(initiative) {
  // 	eventbus.publish({
  // 		topic: "Map.needToShowInitiativeTooltip",
  // 		data: initiative
  // 	});
  // };
  // proto.notifyHideInitiativeTooltip = function(initiative) {
  // 	eventbus.publish({
  // 		topic: "Map.needToHideInitiativeTooltip",
  // 		data: initiative
  // 	});
  // };
  // proto.notifySidebarNeedsToShowInitiatives = function() {
  // 	eventbus.publish({topic: "Sidebar.showInitiatives"});
  // };
  // proto.historyButtonsUsed = function(lastContent) {
  // 	//console.log("sidebar/initiatives historyButtonsUsed");
  // 	//console.log(lastContent);
  // 	this.notifyMarkersNeedToShowNewSelection(lastContent);
  // 	this.view.refresh();
  // };

  // proto.onInitiativeResults = function(data) {
  // 	// TODO - handle better when data.results is empty
  // 	//        Prob don't want to put them on the stack?
  // 	//        But still need to show the fact that there are no results.
  // 	const lastContent = this.contentStack.current();
  // 	this.contentStack.append(new SearchResults(data.results, data.text));
  // 	this.notifyMarkersNeedToShowNewSelection(lastContent);
  // 	this.notifyMapNeedsToNeedsToBeZoomedAndPanned();
  // 	this.notifySidebarNeedsToShowInitiatives();
  // 	this.view.refresh();
  // }
  // proto.onInitiativeClickedInSidebar = function(data) {
  // 	const initiative = data;
  // 	//console.log(initiative);
  // 	const lastContent = this.contentStack.current();
  // 	this.contentStack.append(new StackItem([initiative]));
  // 	this.notifyMarkersNeedToShowNewSelection(lastContent);
  // 	this.notifyMapNeedsToNeedsToBeZoomedAndPanned();
  // 	this.view.refresh();
  // };
  // proto.onInitiativeMouseoverInSidebar = function(initiative) {
  // 	this.notifyShowInitiativeTooltip(initiative);
  // };
  // proto.onInitiativeMouseoutInSidebar = function(initiative) {
  // 	this.notifyHideInitiativeTooltip(initiative);
  // };
  // proto.onMarkerSelectionSet = function(data) {
  // 	const initiative = data;
  // 	//console.log(initiative);
  // 	const lastContent = this.contentStack.current();
  // 	this.contentStack.append(new StackItem([initiative]));
  // 	this.notifyMarkersNeedToShowNewSelection(lastContent);
  // 	this.notifySidebarNeedsToShowInitiatives();
  // 	this.view.refresh();
  // }
  // proto.onMarkerSelectionToggled = function(data) {
  // 	const initiative = data;
  // 	const lastContent = this.contentStack.current();
  // 	// Make a clone of the current initiatives:
  // 	const initiatives = (typeof lastContent != 'undefined') ? lastContent.initiatives.slice(0) : [];
  // 	const index = initiatives.indexOf(initiative);
  // 	if (index == -1) {
  // 		initiatives.push(initiative);
  // 	}
  // 	else {
  // 		// remove elment form array (sigh - is this really the best array method for this?)
  // 		initiatives.splice(index, 1);
  // 	}
  // 	this.contentStack.append(new StackItem(initiatives));
  // 	this.notifyMarkersNeedToShowNewSelection(lastContent);
  // 	this.view.refresh();
  // }

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

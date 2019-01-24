define(["app/eventbus", "model/config", "model/sse_initiative", "presenter/sidebar/base"], function(eventbus, config, sseInitiative, sidebarPresenter) {
	"use strict";

	function StackItem(initiatives) {
		this.initiatives = initiatives;
	}
	StackItem.prototype.textOnEmpty = function() {
		// What text should be displayed in the list of initiatives if that list is empty
		return '';
	}
	StackItem.prototype.headingText = function() {
		if (this.initiatives.length === 1) {
			return this.initiatives[0].name;
		}
		return '';
	}
	StackItem.prototype.appendInitiative = function(initiative) {
		this.initiatives.push(initiative);
	}

	function SearchResults(initiatives, searchString) {
		// isa StackItem
		StackItem.call(this, initiatives);
		this.searchString = searchString;
	}
	SearchResults.prototype = Object.create(StackItem.prototype);
	SearchResults.prototype.textOnEmpty = function() {
		// What text should be displayed in the list of initiatives if that list is empty
		return 'Nothing matched the search';
	};
	SearchResults.prototype.headingText = function() {
		if (this.initiatives.length === 1) {
			return StackItem.call(this);
		}
		else {
			return "Search: " + this.searchString;
		}
	};

	function AllInitiatives() {
		// isa StackItem
		StackItem.call(this, []);
	}
	AllInitiatives.prototype = Object.create(StackItem.prototype);
	AllInitiatives.prototype.textOnEmpty = function() {
		// What text should be displayed in the list of initiatives if that list is empty
		return 'No initiatives';
	};
	AllInitiatives.prototype.headingText = function() {
		return "All initiatives";
	};

	// TODO - what are we going to do with this Initiative object?
	//        Do we want a place to hold UI state (e.g. selected)?
	//        Or should that be held only in the DOM?
	//        We should duplicate this state outside the DOM only if it is necessary for performance reasons.
	const all_initiatives = [];
	function Initiative(i) {
		Object.defineProperties(this, {
			model: { value: i, enumerable: true }
		});
		all_initiatives.push();
	}

	// This is the presenter object for this module:
	function Presenter(){
		// There is a single StackItem for displaying all initiatives.
		// However, this same StackItem can be placed at more than one
		// position in the history stack (as an optimization - to avoid duplication).
		this.allInitiativesItem = new AllInitiatives();
	}

	var proto = Object.create(sidebarPresenter.base.prototype);

	proto.currentItem = function() {
		return this.contentStack.current();
	};
	proto.currentItemExists = function() {
		// returns true only if the contentStack is empty
		return typeof this.contentStack.current() !== 'undefined';
	};
	proto.onInitiativeNew = function(data/*, envelope*/) {
		var initiative = data;
		// TODO - Is there really a reason for creating a new Initiative object?
		//        If not, then don't!
		//new Initiative(initiative);
		this.allInitiativesItem.appendInitiative(initiative);
	};
	proto.notifyMarkersNeedToShowNewSelection = function(lastContent) {
		eventbus.publish({
			topic: "Markers.needToShowLatestSelection",
			data: {
				unselected: lastContent ? lastContent.initiatives : [],
				selected: this.contentStack.current().initiatives
			}
		});
	}
	function arrayMax(array) {
		return array.reduce((a, b) => Math.max(a, b));
	}
	function arrayMin(array) {
		return array.reduce((a, b) => Math.min(a, b));
	}
	proto.notifyMapNeedsToNeedsToBeZoomedAndPanned = function() {
		const initiatives = this.contentStack.current().initiatives.filter(x => x.hasGeoLocation());
		const lats = initiatives.map(x => x.lat);
		const lngs = initiatives.map(x => x.lng);

		if (initiatives.length > 0) {
			eventbus.publish({
				topic: "Map.needsToBeZoomedAndPanned",
				data: [[arrayMin(lats), arrayMin(lngs)], [arrayMax(lats), arrayMax(lngs)]]
			});
		}
	}
	proto.notifyShowInitiativeTooltip = function(initiative) {
		eventbus.publish({
			topic: "Map.needToShowInitiativeTooltip",
			data: initiative
		});
	};
	proto.notifyHideInitiativeTooltip = function(initiative) {
		eventbus.publish({
			topic: "Map.needToHideInitiativeTooltip",
			data: initiative
		});
	};
	proto.notifySidebarNeedsToShowInitiatives = function() {
		eventbus.publish({topic: "Sidebar.showInitiatives"});
	};
	proto.historyButtonsUsed = function(lastContent) {
		//console.log("sidebar/initiatives historyButtonsUsed");
		//console.log(lastContent);
		this.notifyMarkersNeedToShowNewSelection(lastContent);
		this.view.refresh();
	};
	proto.listAll = function() {
		console.log("presenter/sidebar/initiatives: listAll");
		this.contentStack.append(this.allInitiativesItem);
		this.notifySidebarNeedsToShowInitiatives();
		this.view.refresh();
	};

	proto.onInitiativeResults = function(data) {
		// TODO - handle better when data.results is empty
		//        Prob don't want to put them on the stack?
		//        But still need to show the fact that there are no results.
		const lastContent = this.contentStack.current();
		this.contentStack.append(new SearchResults(data.results, data.text));
		this.notifyMarkersNeedToShowNewSelection(lastContent);
		this.notifyMapNeedsToNeedsToBeZoomedAndPanned();
		this.notifySidebarNeedsToShowInitiatives();
		this.view.refresh();
	}
	proto.onInitiativeClickedInSidebar = function(data) {
		const initiative = data;
		//console.log(initiative);
		const lastContent = this.contentStack.current();
		this.contentStack.append(new StackItem([initiative]));
		this.notifyMarkersNeedToShowNewSelection(lastContent);
		this.notifyMapNeedsToNeedsToBeZoomedAndPanned();
		this.view.refresh();
	};
	proto.onInitiativeMouseoverInSidebar = function(initiative) {
		this.notifyShowInitiativeTooltip(initiative);
	};
	proto.onInitiativeMouseoutInSidebar = function(initiative) {
		this.notifyHideInitiativeTooltip(initiative);
	};
	proto.onMarkerSelectionSet = function(data) {
		const initiative = data;
		//console.log(initiative);
		const lastContent = this.contentStack.current();
		this.contentStack.append(new StackItem([initiative]));
		this.notifyMarkersNeedToShowNewSelection(lastContent);
		this.notifySidebarNeedsToShowInitiatives();
		this.view.refresh();
	}
	proto.onMarkerSelectionToggled = function(data) {
		const initiative = data;
		const lastContent = this.contentStack.current();
		// Make a clone of the current initiatives:
		const initiatives = (typeof lastContent != 'undefined') ? lastContent.initiatives.slice(0) : [];
		const index = initiatives.indexOf(initiative);
		if (index == -1) {
			initiatives.push(initiative);
		}
		else {
			// remove elment form array (sigh - is this really the best array method for this?)
			initiatives.splice(index, 1);
		}
		this.contentStack.append(new StackItem(initiatives));
		this.notifyMarkersNeedToShowNewSelection(lastContent);
		this.view.refresh();
	}

	Presenter.prototype = proto;

	function createPresenter(view) {
		var p = new Presenter();
		p.registerView(view);
		eventbus.subscribe({topic: "Initiative.new", callback: function(data) { p.onInitiativeNew(data); } });
		eventbus.subscribe({topic: "Search.initiativeResults", callback: function(data) { p.onInitiativeResults(data); } });
		eventbus.subscribe({topic: "Marker.SelectionToggled", callback: function(data) { p.onMarkerSelectionToggled(data); } });
		eventbus.subscribe({topic: "Marker.SelectionSet", callback: function(data) { p.onMarkerSelectionSet(data); } });
		return p;
	}
	var pub = {
		createPresenter: createPresenter
	};
	return pub;
});

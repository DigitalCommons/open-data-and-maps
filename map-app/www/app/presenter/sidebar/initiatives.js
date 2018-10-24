define(["app/eventbus", "model/config", "model/sse_initiative", "presenter/sidebar/base"], function(eventbus, config, sseInitiative, sidebarPresenter) {
	"use strict";

	function StackItem(initiatives) {
		this.initiatives = initiatives;
	}
	function SearchResults(initiatives, searchString) {
		StackItem.call(this, initiatives);
		this.searchString = searchString;
	}
	SearchResults.prototype = Object.create(StackItem.prototype);

	function Presenter(){}

	var proto = Object.create(sidebarPresenter.base.prototype);


	proto.getSearchString = function() {
		var current = this.contentStack.current();
		if (typeof current !== 'undefined') {
			return current.searchString || "";
		}
		else {
			return "";
		}
	};
	function getInitiativesFromStackItem(item) {
		return (typeof item !== 'undefined') ? item.initiatives : [];
	}
	proto.getInitiatives = function() {
		var p = this;
		var current = this.contentStack.current();
		if (typeof current !== 'undefined') {
			return current.initiatives.map(function(e) {
				return {
					label: e.name,
					onClick: function() { p.onInitiativeClickedInSidebar(e); }
				};
			});
		}
		else {
			return [];
		}
	};
	proto.currentItem = function() {
	};
	proto.currentItemExists = function() {
		// returns true only if the contentStack is empty
		return typeof this.contentStack.current() !== 'undefined';
	};
	proto.notifyMarkersNeedToShowNewSelection = function(lastContent) {
		eventbus.publish({
			topic: "Markers.needToShowLatestSelection",
			data: {
				unselected: getInitiativesFromStackItem(lastContent),
				selected: getInitiativesFromStackItem(this.contentStack.current())
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
		const initiatives = getInitiativesFromStackItem(this.contentStack.current());
		const lats = initiatives.map(x => x.lat);
		const lngs = initiatives.map(x => x.lng);

		if (initiatives.length > 0) {
			eventbus.publish({
				topic: "Map.needsToBeZoomedAndPanned",
				data: [[arrayMin(lats), arrayMin(lngs)], [arrayMax(lats), arrayMax(lngs)]]
			});
		}
	}
	proto.historyButtonsUsed = function(lastContent) {
		console.log("sidebar/initiatives historyButtonsUsed");
		//TODO - de-select last content? select current content?
		console.log(lastContent);
		this.notifyMarkersNeedToShowNewSelection(lastContent);
		this.view.refresh();
	};

	proto.onInitiativeResults = function(data) {
		// TODO - handle better when data.results is empty
		//        Prob don't want to put them on the stack?
		//        But still need to show the fact that there are no results.
		const lastContent = this.contentStack.current();
		//TODO: de-select last content? select current content?
		this.contentStack.append({
			searchString: data.text,
			initiatives: data.results
		});
		this.notifyMarkersNeedToShowNewSelection(lastContent);
		this.notifyMapNeedsToNeedsToBeZoomedAndPanned();
		this.view.refresh();
	}
	proto.onInitiativeClickedInSidebar = function(data) {
		const initiative = data;
		//eventbus.publish({topic: "Initiative.selected", data: e});
		console.log(initiative);
		const lastContent = this.contentStack.current();
		this.contentStack.append({
			// TODO - need to distinguish between initiatives searched for an thos that come via selections.
			searchString: "selection",
			initiatives: [initiative]
		});
		this.notifyMarkersNeedToShowNewSelection(lastContent);
		this.notifyMapNeedsToNeedsToBeZoomedAndPanned();
		this.view.refresh();
	};
	proto.onMarkerSelectionSet = function(data) {
		const initiative = data;
		console.log(initiative);
		const lastContent = this.contentStack.current();
		this.contentStack.append({
			// TODO - need to distinguish between initiatives searched for an thos that come via selections.
			searchString: "selection",
			initiatives: [initiative]
		});
		this.notifyMarkersNeedToShowNewSelection(lastContent);
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
		this.contentStack.append({
			// TODO - need to distinguish between initiatives searched for an thos that come via selections.
			searchString: "selection",
			initiatives: initiatives
		});
		this.notifyMarkersNeedToShowNewSelection(lastContent);
		this.view.refresh();
	}

	Presenter.prototype = proto;

	function createPresenter(view) {
		var p = new Presenter();
		p.registerView(view);
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

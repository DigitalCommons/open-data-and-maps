define(["app/eventbus", "model/config", "model/sse_initiative", "presenter/sidebar/base"], function(eventbus, config, sseInitiative, sidebarPresenter) {
	"use strict";

	function Presenter(){}

	var proto = Object.create(sidebarPresenter.base.prototype);

	proto.getSearchString = function() {
		var current = this.contentStack.current();
		if (typeof current !== 'undefined') {
			return current.searchString;
		}
		else {
			return "";
		}
	};
	// TODO - shoud this (and others?) be a regular function (private to this module),
	//        rather than in the prototype?
	proto.showInitiative = function(e) {
		console.log(e);
		eventbus.publish({topic: "Initiative.selected", data: e});
	};
	proto.getMatches = function() {
		var p = this;
		var current = this.contentStack.current();
		if (typeof current !== 'undefined') {
			return current.matches.map(function(e) {
				return {
					label: e.name,
					onClick: function() { p.showInitiative(e); }
				};
			});
		}
		else {
			return [];
		}
	};
	proto.historyButtonsUsed = function(lastContent) {
		console.log("sidebar/initiatives historyButtonsUsed");
		//TODO - de-select last content? select current content?
		console.log(lastContent);
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
			matches: data.results
		});
		this.view.refresh();
	}
	proto.onMarkerSelectionSet = function(data) {
		const initiative = data;
		console.log(initiative);
		this.contentStack.append({
			// TODO - need to distinguish between initiatives searched for an thos that come via selections.
			searchString: "selection",
			matches: [initiative]
		});
		this.view.refresh();
	}
	proto.onMarkerSelectionToggled = function(data) {
		const initiative = data;
		const curr = this.contentStack.current();
		// Make a clone of the current matches:
		const initiatives = (typeof curr != 'undefined') ? curr.matches.slice(0) : [];
		const index = initiatives.indexOf(initiative);
		if (index == -1) {
			initiatives.push(initiative);
		}
		else {
			// remove elment form array (sigh)
			initiatives.splice(index, 1);
		}
		this.contentStack.append({
			// TODO - need to distinguish between initiatives searched for an thos that come via selections.
			searchString: "selection",
			matches: initiatives
		});
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

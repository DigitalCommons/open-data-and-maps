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
	proto.onInitiativeClicked = function(data) {
		const initiative = data.initiative;
		const mouseEvent = data.mouseEvent;
		const ctrlKey = data.mouseEvent.originalEvent.ctrlKey;
		console.log("Initiative clicked");
		console.log("ctrlKey: " + ctrlKey);
		console.log(mouseEvent);
		console.log(initiative);
		// TODO: deselect last content, add and select this content?
		const lastContent = this.contentStack.current();
		this.contentStack.append({
			// TODO - need to distinguish between initiatives searched for an thos that come via selections.
			searchString: "selection",
			matches: [initiative]
		});
		this.view.refresh();
	}

	Presenter.prototype = proto;

	function createPresenter(view) {
		var p = new Presenter();
		p.registerView(view);
		eventbus.subscribe({topic: "Search.initiativeResults", callback: function(data) { p.onInitiativeResults(data); } });
		eventbus.subscribe({topic: "Initiative.clicked", callback: function(data) { p.onInitiativeClicked(data); } });
		return p;
	}
	var pub = {
		createPresenter: createPresenter
	};
	return pub;
});

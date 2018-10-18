define(["app/eventbus", "model/config", "model/sse_initiative", "presenter/sidebar/base"], function(eventbus, config, sseInitiative, sidebarPresenter) {
	"use strict";

	function Presenter(){}

	var proto = Object.create(sidebarPresenter.base.prototype);
	/*
	proto.performSearch = function(text) {
		console.log("Search submitted: [" + text + "]");
		// We need to make sure that the search sidebar is loaded
		if (text.length > 0) {
			eventbus.publish({topic: "Sidebar.showSearch"});
			var results = sseInitiative.search(text);
			console.log(results);
			this.contentStack.append({
				searchString: text,
				matches: results
			});
			eventbus.publish({topic: "Search.resultsExist"});
			this.view.refresh();
		}
	};
   */
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

	proto.onInitiativeResults = function(data) {
		// TODO - handle better when data.results is empty
		//        Prob don't want to put them on the stack?
		//        But still need to show the fact that there are no results.
		this.contentStack.append({
			searchString: data.text,
			matches: data.results
		});
		eventbus.publish({topic: "Search.resultsExist"});
		this.view.refresh();
	}

	Presenter.prototype = proto;

	function createPresenter(view) {
		var p = new Presenter();
		p.registerView(view);
		eventbus.subscribe({topic: "Search.initiativeResults", callback: function(data) { p.onInitiativeResults(data); } });
		return p;
	}
	var pub = {
		createPresenter: createPresenter
	};
	return pub;
});

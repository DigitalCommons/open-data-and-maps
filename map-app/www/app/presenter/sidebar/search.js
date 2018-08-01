define(["app/eventbus", "model/config", "model/sse_initiative", "presenter/sidebar/base"], function(eventbus, config, sseInitiative, sidebarPresenter) {
	"use strict";

	function Presenter(){}

	var proto = Object.create(sidebarPresenter.base.prototype);
	proto.performSearch = function(text) {
		console.log("Search submitted: [" + text + "]");
		// We need to make sure that the search sidebar is loaded
		eventbus.publish({topic: "Sidebar.loadSearch"});
		if (text.length > 0) {
			var results = sseInitiative.search(text);
			console.log(results);
			if (results.length > 0) {
				this.contentStack.append({
					searchString: text,
					matches: results
				});
			}
			this.view.refresh();
		}
	};
	proto.getSearchString = function() {
		var current = this.contentStack.current();
		if (typeof current !== 'undefined') {
			return current.searchString;
		}
		else {
			return "";
		}
	};
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
					onClick: function() { p.showInitiative(e);}
				}
			});
		}
		else {
			return [];
		}
	};
	Presenter.prototype = proto;

	function createPresenter(view) {
		var p = new Presenter;
		p.registerView(view);
		return p;
	}
	var pub = {
		createPresenter: createPresenter
	};
	return pub;
});

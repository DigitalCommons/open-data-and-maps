define(["app/eventbus", "model/config", "presenter/sidebar/base"], function(eventbus, config, sidebarPresenter) {
	"use strict";

	function Presenter(){}

	var proto = Object.create(sidebarPresenter.base.prototype);

	// We wan't to disable the 'Search results' button if there are no search results:
	proto.searchResultsExist = false;

	proto.aboutButtonClicked = function() {
		console.log('aboutButtonClicked');
	};
	proto.searchButtonClicked = function() {
		console.log('searchButtonClicked');
		eventbus.publish({topic: "Sidebar.showSearch"});
	};
	proto.getButtons = function() {
		return [
			{
				label: 'About',
				disabled: false,
				hovertext: 'Information about this map',
				onClick: this.aboutButtonClicked
			},
			{
				label: 'Search results',
				disabled: !this.searchResultsExist,
				hovertext: 'Show search results',
				onClick: this.searchButtonClicked
			}
		];
	};
	Presenter.prototype = proto;

	// @todo 
	// Create a bunch of buttons that raise events when they are clicked.
	// We can then plumb the events into other presenters, e.g. the presenter fo the search results.
	// That way, we have looser coupling :-)
	
	function createPresenter(view) {
		var p = new Presenter();
		p.registerView(view);
		eventbus.subscribe({topic: "Search.resultsExist", callback: function() { p.searchResultsExist = true; }});
		return p;
	}
	var pub = {
		createPresenter: createPresenter
	};
	return pub;
});

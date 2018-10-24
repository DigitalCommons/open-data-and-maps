// The view aspects of the Main Menu sidebar
define(["d3", "app/eventbus", "presenter/sidebar/initiatives", "view/sidebar/base"], function(d3, eventbus, presenter, sidebarView) {
	"use strict";

	// Our local Sidebar object:
	function Sidebar(){}

	// Our local Sidebar inherits from sidebar:
	var proto = Object.create(sidebarView.base.prototype);

	// And adds some overrides and new properties of it's own:
	proto.title = "Initiatives";

	proto.populateFixedSelection = function(selection) {
		let textContent = "Initiatives";	// default content, if no initiatives to show
		if (this.presenter.currentItemExists()) {
			const item = this.presenter.currentItem();
		}
		selection.append("div").attr("class", "w3-container").append('p').text("Search: " + this.presenter.getSearchString());
	};
	proto.populateScrollableSelection = function(selection) {
		console.log(this.presenter.getInitiatives());
		var matches = this.presenter.getInitiatives();
		if (matches.length > 0) {
		matches.forEach(function(match) {
			selection.append('button')
			.attr("class", "w3-bar-item w3-button w3-mobile")
			.attr("title", match.hovertext)
			.on('click', match.onClick)
			.text(match.label);
		});
		}
		else {
			selection.append('div').attr("class", "w3-container w3-center").append('p').text("Nothing matched the search");
		}
	};

	Sidebar.prototype = proto;

	function createSidebar() {
		var view = new Sidebar;
		view.setPresenter(presenter.createPresenter(view));
		return view;
	}
	var pub = {
		createSidebar: createSidebar
	};
	return pub;
});

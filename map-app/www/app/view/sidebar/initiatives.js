// The view aspects of the Main Menu sidebar
define(["d3", "app/eventbus", "presenter/sidebar/initiatives", "view/sidebar/base"], function(d3, eventbus, presenter, sidebarView) {
	"use strict";

	// Our local Sidebar object:
	function Sidebar(){}

	// Our local Sidebar inherits from sidebar:
	var proto = Object.create(sidebarView.base.prototype);

	// And adds some overrides and new properties of it's own:
	proto.title = "Initiatives";

	/*
	proto.searchSubmitted = function() {
		// By default, submitting the form will cause a page reload!
		d3.event.preventDefault();
		//d3.event.stopPropagation();

		var searchText = d3.select("#search-box").property("value");
		this.presenter.performSearch(searchText);
		console.log("Search submitted: [" + searchText + "]");
	};
	*/
	proto.populateFixedSelection = function(selection) {
		var pres = this.presenter;
		selection.append("div").attr("class", "w3-container").append('p').text("Search: " + pres.getSearchString());
	};
	proto.populateScrollableSelection = function(selection) {
		console.log(this.presenter.getMatches());
		var matches = this.presenter.getMatches();
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

	/*
	proto.createSearchBox = function() {
		// d3 selection redefines this, so hang onto it here:
		var view = this;
		var selection = this.d3selectAndClear('#search-widget');
		selection = selection.append('form').
			attr('id', 'search-form').
			attr('class', 'w3-card-4 w3-light-grey w3-round w3-opacity w3-display-topright search-form').
			on('submit', function() { view.searchSubmitted(); }).
			append('div').
			attr('class', 'w3-row w3-border-0');
		selection.append('div').
			attr('class', 'w3-col').
			attr('title', "Click to search").
			style('width', '60px').
			append('button').
			attr('type', 'submit').
			attr('class', 'w3-btn w3-border-0').
			append('i').
			attr('class', 'w3-xlarge fa fa-search');
		selection.append('div').attr('class', 'w3-rest').
			append('input').
			attr('id', 'search-box').
			attr('class', 'w3-input w3-border-0 w3-round w3-mobile').
			attr('type', 'search').
			attr('placeholder', 'search');

	};
   */

	Sidebar.prototype = proto;

	function createSidebar() {
		var sb = new Sidebar;
		sb.setPresenter(presenter.createPresenter(sb));
		//sb.createSearchBox();
		return sb;
	}
	var pub = {
		createSidebar: createSidebar
	};
	return pub;
});

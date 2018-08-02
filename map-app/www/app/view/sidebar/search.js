// The view aspects of the Main Menu sidebar
define(["d3", "app/eventbus", "presenter/sidebar/search", "view/sidebar/base"], function(d3, eventbus, presenter, sidebarView) {
	"use strict";

	// Our local Sidebar object:
	function Sidebar(){}

	// Our local Sidebar inherits from sidebar:
	var proto = Object.create(sidebarView.base.prototype);

	// And adds some overrides and new properties of it's own:
	proto.title = "Search";

	proto.searchSubmitted = function() {
		// By default, submitting the form will cause a page reload!
		d3.event.preventDefault();
		//d3.event.stopPropagation();

		var searchText = d3.select("#search-box").property("value");
		this.presenter.performSearch(searchText);
		console.log("Search submitted: [" + searchText + "]");
		/*
		document.getElementById('search-results').innerHTML = "<p>You searched for: " + searchText + "</p>" +
			"<p><i class=\"w3-round w3-xxlarge fa fa-exclamation-triangle\"></i>" +
			"Sorry, searching is not yet available, but coming soon</p>";
		document.getElementById('search-results-container').style.display='block';
	   */
	};
	proto.populateFixedSelection = function(selection) {
		var pres = this.presenter;
		selection.append('p').text(pres.getSearchString());
	};
	proto.populateScrollableSelection = function(selection) {
		console.log(this.presenter.getMatches());
		return this.presenter.getMatches().forEach(function(button) {
			selection.append('button')
			.attr("class", "w3-bar-item w3-button w3-mobile")
			.attr("title", button.hovertext)
			.on('click', button.onClick)
			.text(button.label);
		});
	};

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
			style('width', '50px').
			append('button').
			attr('type', 'submit').
			attr('class', 'w3-border-0').
			append('i').
			attr('class', 'w3-xxlarge fa fa-search');
		selection.append('div').attr('class', 'w3-rest').
			append('input').
			attr('id', 'search-box').
			attr('class', 'w3-input w3-border-0 w3-round w3-mobile').
			attr('type', 'search').
			attr('placeholder', 'search');

	};

	Sidebar.prototype = proto;

	function createSidebar() {
		var sb = new Sidebar;
		sb.setPresenter(presenter.createPresenter(sb));
		sb.createSearchBox();
		return sb;
	}
	var pub = {
		createSidebar: createSidebar
	};
	return pub;
});

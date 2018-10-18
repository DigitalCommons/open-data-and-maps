// Set up the various sidebars
define(["d3", "view/base", "presenter/sidebar", "view/sidebar/mainmenu", "view/sidebar/initiatives"], function(d3, viewBase, presenter, mainMenu, initiatives) {
	"use strict";

	// This deals with the view object that controls the sidebar
	// It is not itself a sidebar/view object, but contains objects of that type

	function SidebarView(){}
	// inherit from the standard view base object:
	var proto = Object.create(viewBase.base.prototype);

	proto.createOpenButton = function() {
		// d3 selection redefines this, so hang onto it here:
		var that = this;
		var selection = this.d3selectAndClear('#sidebar-button').
			append('button').
			attr('class', 'w3-btn w3-teal w3-xlarge w3-opacity w3-display-topleft menu-button').
			attr('title', 'Show sidebar').
			on('click', function() { that.showSidebar(); }).
			append('i').
			attr('class', 'fa fa-angle-right');
	};
	proto.createButtonRow = function() {
		// d3 selection redefines this, so hang onto it here:
		var that = this;
		var selection = this.d3selectAndClear('#sidebar-header').attr('class', 'w3-cell-row');

		// Button for hiding the sidebar:
		selection.append('button').
			attr('class', 'w3-teal w3-cell w3-button w3-border-0').
			attr('title', 'Hide sidebar').
			on('click', function() { that.hideSidebar(); }).
			append('i').
			attr('class', 'fa fa-angle-left');

		// The sidebar has a button that cuases the main menu to be dispayed
		selection.append('button').
			attr('class', 'w3-teal w3-cell w3-button w3-border-0').
			attr('title', 'Show main menu').
			on('click', function() { console.log(this); that.changeSidebar('mainMenu'); }).
			append('i').
			attr('class', 'fa fa-bars');

		// This is where the navigation buttons will go.
		// These are recreated when the sidebar is changed, e.g. from MainMenu to initiatives.
		selection = selection.append("i").attr("id", "sidebar-history-navigation");

	};
	proto.createSidebars = function() {
		this.sidebar = {
			initiatives: initiatives.createSidebar(),
			mainMenu: mainMenu.createSidebar()
		};
	};
	proto.changeSidebar = function(name) {
		this.sidebar[name].refresh();
	};
	proto.showSidebar = function() {
		d3.select('#sidebar').style('display', 'flex');
	};
	proto.hideSidebarIfItTakesWholeScreen = function() {
		// @todo - improve this test - 
		// it is not really testing the predicate suggested by the name iof the function.
		if (window.innerWidth <= 600) {
			d3.select('#sidebar').style('display', 'none');
		}
	};
	proto.hideSidebar = function() {
		d3.select('#sidebar').style('display', 'none');
	};
	SidebarView.prototype = proto;
	var view;

	function init() {
		view = new SidebarView();
		view.setPresenter(presenter.createPresenter(view));
		view.createOpenButton();
		view.createButtonRow();
		view.createSidebars();
		view.changeSidebar('mainMenu');
	}
	var pub = {
		init: init
	};
	return pub;
});

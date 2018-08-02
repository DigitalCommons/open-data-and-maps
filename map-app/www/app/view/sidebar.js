// Set up the various sidebars
define(["d3", "view/base", "presenter/sidebar", "view/sidebar/mainmenu", "view/sidebar/search"], function(d3, viewBase, presenter, mainMenu, search) {
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
	proto.createHeader = function() {
		// d3 selection redefines this, so hang onto it here:
		var that = this;
		var selection = this.d3selectAndClear('#sidebar-header').attr('class', 'w3-cell-row');

		// The sidebar has a button that cuases the main menu to be dispayed
		selection.append('button').
			attr('class', 'w3-teal w3-cell w3-button w3-border-0').
			attr('title', 'Show main menu').
			on('click', function() { console.log(this); that.changeSidebar('mainMenu'); }).
			append('i').
			attr('class', 'fa fa-bars');

		// Where the sidebar title goes:
		selection.append('div').
			attr('class', 'w3-cell w3-center').
			append('p').attr('id', 'sidebar-title');

		// Button for clsing the sidebar:
		selection.append('button').
			attr('class', 'w3-teal w3-cell w3-right w3-button w3-border-0').
			attr('title', 'Hide sidebar').
			on('click', function() { that.hideSidebar(); }).
			text('X');
	};
	proto.createSidebars = function() {
		this.sidebar = {
			search: search.createSidebar(),
			mainMenu: mainMenu.createSidebar()
		};
	};
	proto.changeSidebar = function(name) {
		this.sidebar[name].reload();
	};
	proto.showSidebar = function() {
		d3.select('#sidebar').style('display', 'flex');
	};
	proto.hideSidebarIfItTakesWholeScreen = function() {
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
		view.createHeader();
		view.createSidebars();
		view.changeSidebar('mainMenu');
	}
	var pub = {
		init: init
	};
	return pub;
});

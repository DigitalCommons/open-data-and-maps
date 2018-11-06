// The view aspects of the About sidebar
define(["d3", "app/eventbus", "presenter/sidebar/about", "view/sidebar/base"], function(d3, eventbus, presenter, sidebarView) {
	"use strict";

	// Our local Sidebar object:
	function Sidebar(){}

	// Our local Sidebar inherits from sidebar:
	var proto = Object.create(sidebarView.base.prototype);

	// And adds some overrides and new properties of it's own:
	proto.title = "about";
	proto.hasHistoryNavigation = false;	// No forward/back buttons for this sidebar

	// TODO These same consts are here and in view/sidebar/initiative.
	//      Find a common place for them.
	const sectionHeadingClasses = "w3-bar-item w3-tiny w3-light-grey w3-padding-small";
	const hoverColour = " w3-hover-light-blue";
	const accordionClasses = "w3-bar-item w3-tiny w3-light-grey w3-padding-small" + hoverColour;
	const sectionClasses = "w3-bar-item w3-small w3-white w3-padding-small";

	proto.populateFixedSelection = function(selection) {
		let textContent = "About this map";
		selection.append("div").attr("class", "w3-container").append('p').text(textContent);
	};
	proto.geekZoneContentAtD3Selection = function(selection) {
		const that = this;
		const s = selection.append('div').attr('class', "w3-bar-block");
		s.append('div')
		.attr('class', sectionClasses)
		.text("Geek zone content TBD ")
		;

		const version = this.presenter.getSoftwareVersion();
		s.append('div').attr('class', sectionHeadingClasses).text("Map software");
		s.append('div')
		.attr('class', sectionClasses)
		.text("Variant: " + version.variant)
		;
		s.append('div')
		.attr('class', sectionClasses)
		.text("Timestamp: " + version.timestamp)
		;
		s.append('div')
		.attr('class', sectionClasses)
		.text("Git commit: " + version.gitcommit)
		;
	};
	proto.populateScrollableSelection = function(selection) {
		const that = this;
		//selection.append('div').attr("class", "w3-container w3-center").append('p').text("Information about this map will be available here soon.");
		//selection.append('div').attr("class", "w3-container w3-center").html(that.presenter.aboutHtml());
		selection.append('div').attr("class", "w3-container").html(that.presenter.aboutHtml());
		// Make an accordion for opening up the geek zone
		this.makeAccordionAtD3Selection({
			selection: selection,
			heading: "Geek zone",
			headingClasses: accordionClasses,
			makeContentAtD3Selection: function(contentD3Selection) {
				that.geekZoneContentAtD3Selection(contentD3Selection);
			},
			hideContent: true
		});
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

// The view aspects of the Main Menu sidebar
define(["d3", "app/eventbus", "presenter/sidebar/initiatives", "view/sidebar/base"], function(d3, eventbus, presenter, sidebarView) {
	"use strict";

	// Our local Sidebar object:
	function Sidebar(){}

	// Our local Sidebar inherits from sidebar:
	var proto = Object.create(sidebarView.base.prototype);

	// And adds some overrides and new properties of it's own:
	proto.title = "Initiatives";

	const sectionHeadingClasses = "w3-bar-item w3-tiny w3-light-grey w3-padding-small";
	const hoverColour = " w3-hover-light-blue";
	const accordionClasses = "w3-bar-item w3-tiny w3-light-grey w3-padding-small" + hoverColour;
	const sectionClasses = "w3-bar-item w3-small w3-white w3-padding-small";

	proto.populateFixedSelection = function(selection) {
		let textContent = "Initiatives";	// default content, if no initiatives to show
		if (this.presenter.currentItemExists()) {
			const item = this.presenter.currentItem();
			const initiatives = item.initiatives;
			if (initiatives.length === 1) {
				textContent = initiatives[0].name;
			}
			else if (item.isSearchResults()) {
				textContent = "Search: " + item.searchString;
			}
		}
		selection.append("div").attr("class", "w3-container").append('p').text(textContent);
		//selection.append("div").attr("class", "w3-container").append('p').text("Search: " + this.presenter.getSearchString());
	};
	proto.geekZoneContentAtD3Selection = function(selection, initiative) {
		const that = this;
		const s = selection.append('div').attr('class', "w3-bar-block");
		if (initiative.lat) {
			s.append('div')
			.attr('class', sectionClasses)
			.text("Latitude: " + initiative.lat)
			;
		}
		if (initiative.lng) {
			s.append('div')
			.attr('class', sectionClasses)
			.text("Longitude: " + initiative.lng)
			;
		}
		if (initiative.uri) {
			s.append('div')
			.attr('class', sectionClasses + hoverColour)
			.text("Detailed data for this initiative")
			.style('cursor', 'pointer')
			.on('click', function(e) { that.openInNewTabOrWindow(initiative.uri); })
			;
		}
		if (initiative.within) {
			s.append('div')
			.attr('class', sectionClasses + hoverColour)
			.text("Ordnance Survey postcode data")
			.style('cursor', 'pointer')
			.on('click', function(e) { that.openInNewTabOrWindow(initiative.within); })
			;
		}
		if (initiative.regorg) {
			const serviceToDisplaySimilarCompanies = document.location.origin + document.location.pathname + 
				"services/" + "display_similar_companies/main.php";
			const serviceToDisplaySimilarCompaniesURL = serviceToDisplaySimilarCompanies + "?company=" + encodeURIComponent(initiative.regorg);
			s.append('div')
			.attr('class', sectionClasses + hoverColour)
			.attr('title', "A tech demo of federated Linked Open Data queries!")
			.text("Display similar companies nearby using Companies House data")
			.style('cursor', 'pointer')
			.on('click', function(e) { that.openInNewTabOrWindow(serviceToDisplaySimilarCompaniesURL); })
			;
		}

		//selection.append('div').text("foo");
	};
	proto.populateSelectionWithOneInitiative = function(selection, initiative) {
		const s = selection.append('div').attr('class', "w3-bar-block");
		const that = this;
		if (initiative.www) {
			s.append('div').attr('class', sectionHeadingClasses).text("website");
			s.append('div')
			.attr('class', sectionClasses + hoverColour)
			.text(initiative.www)
			.style('cursor', 'pointer')
			.on('click', function(e) { that.openInNewTabOrWindow(initiative.www); })
			;
			//s.append('div').attr('class', sectionClasses).html(this.htmlToOpenLinkInNewTab(initiative.www, initiative.www, {title: "foo"}));
		}
		s.append('div').attr('class', sectionHeadingClasses).text("description");
		s.append('div')
		.attr('class', sectionClasses)
		.text("We're still working on putting the description of the initiative here. It should be available quite soon.")
		;
		// Make an accordion for opening up the geek zone
		that.makeAccordionAtD3Selection({
			selection: s,
			heading: "Geek zone",
			headingClasses: accordionClasses,
			makeContentAtD3Selection: function(contentD3Selection) {
				that.geekZoneContentAtD3Selection(contentD3Selection, initiative);
			},
			hideContent: true
		});
//		s.append('div').attr('class', "w3-bar-item w3-tiny w3-light-grey w3-padding-small").text("foo");
//		s.append('div').attr('class', "w3-bar-item w3-padding-small w3-small w3-light-blue").append('p').text("kakjsh kajsh ajhsf ksdh fhsd fhskd jhf ksd fkhsdkfh ksdjhf kjshdf kjshd fkhjsdkfh skdhf ldfkg hlsdhf ksdjhf kajhsdf kshdf kajsh fksjhdk fhsdkf");
//		s.append('div').attr('class', "w3-bar-item w3-small").text("bar");
	};
	proto.populateSelectionWithListOfInitiatives = function(selection, initiatives) {
		const pres = this.presenter;
		initiatives.forEach(function(initiative) {
			selection.append('button')
			.attr("class", "w3-bar-item w3-button w3-mobile")
			.attr("title", "Click to see details here and on map")
			.on('click', function(e) { pres.onInitiativeClickedInSidebar(initiative); } )
			.text(initiative.name);
		});
	};
	proto.populateScrollableSelection = function(selection) {
		if (this.presenter.currentItemExists()) {
			const item = this.presenter.currentItem();
			const initiatives = item.initiatives;
			switch (initiatives.length) {
				case 0:
					if (item.isSearchResults())
				{
					selection.append('div').attr("class", "w3-container w3-center").append('p').text("Nothing matched the search");
				}
				break;
				case 1:
					this.populateSelectionWithOneInitiative(selection, initiatives[0]);
				break;
				default:
					this.populateSelectionWithListOfInitiatives(selection, initiatives);
			}
		}
		else {
			selection.append('div').attr("class", "w3-container w3-center").append('p').text("When you search, or click on map markers, you'll see the results here");
		}
//		console.log(this.presenter.getInitiatives());
//		var matches = this.presenter.getInitiatives();
//		if (matches.length > 0) {
//		matches.forEach(function(match) {
//			selection.append('button')
//			.attr("class", "w3-bar-item w3-button w3-mobile")
//			.attr("title", match.hovertext)
//			.on('click', match.onClick)
//			.text(match.label);
//		});
//		}
//		else {
//			selection.append('div').attr("class", "w3-container w3-center").append('p').text("Nothing matched the search");
//		}
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

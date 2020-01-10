// The view aspects of the datasets sidebar
define([
  "d3",
  "app/eventbus",
  "presenter/sidebar/datasets",
  "view/sidebar/base"
], function(d3, eventbus, presenter, sidebarView) {
  "use strict";

  // Our local Sidebar object:
  function Sidebar() {}

  // Our local Sidebar inherits from sidebar:
  var proto = Object.create(sidebarView.base.prototype);

  // And adds some overrides and new properties of it's own:
  proto.title = "datasets";
  proto.hasHistoryNavigation = false; // No forward/back buttons for this sidebar

  // TODO These same consts are here and in view/sidebar/initiative.
  //      Find a common place for them.
  const sectionHeadingClasses =
    "w3-bar-item w3-tiny w3-light-grey w3-padding-small";
  const hoverColour = " w3-hover-light-blue";
  const accordionClasses =
    "w3-bar-item w3-tiny w3-light-grey w3-padding-small" + hoverColour;
  const sectionClasses = "w3-bar-item w3-small w3-white w3-padding-small";


  proto.populateFixedSelection = function(selection) {
    let textContent = "Datasets";
    selection
      .append("div")
      .attr("class", "w3-container")
      .append("h1")
      .text(textContent);
  };


  proto.populateScrollableSelection = function(selection) {
    const datasets = this.presenter.getDatasets();
    const defaultActive = this.presenter.getDefault();
    const defaultIdMixed = this.presenter.getMixedId();
    const that = this;

    //create new div for buttons
    const datasetBtns = selection.append("ul")
        .attr("class","sea-directory-list colours capitalized");

    const color_class = function(i) {
        return "sea-field-am"+Math.floor(((i+1) % 12) * 10);
    };
    datasets.forEach((dataset, i) => {
      let btn = datasetBtns
        .append("li")
        .attr("class", color_class(i))
        .attr("id",dataset+"-btn")
        .attr("title", "load " + dataset + " dataset")
        .text(dataset);
      btn.on("click",()=>{
          btn.classed("sea-field-active", true);
          that.presenter.changeDatasets(dataset,false);
          
        });
    });    
    //add mixed btn
    if(datasets.length > 1){
      let btn = datasetBtns
          .append("li")
          .attr("class", color_class(datasets.length))
          .attr("id",`${defaultIdMixed}-btn`)
          .attr("title", "load mixed dataset")
          .text("Mixed Sources");
      btn.on("click",()=>{
          btn.classed("sea-field-active", true);
          that.presenter.changeDatasets("",true);
      });
      }

      //set the default active button (currently loaded dataset)
      selection.select(`#${defaultActive}-btn`)
          .classed("sea-field-active", true);
  };



  Sidebar.prototype = proto;

  proto.hasHistoryNavigation = false;

  function createSidebar() {
    var view = new Sidebar();
    view.setPresenter(presenter.createPresenter(view));
    return view;
  }
  var pub = {
    createSidebar: createSidebar
  };
  return pub;
});

define([
    "app/eventbus",
    "model/config",
    "model/sse_initiative",
    "view/sidebar/base",
    "presenter/sidebar/base",
    "view/map/marker"
  ], function(
    eventbus,
    config,
    sseInitiative,
    sidebarView,
    sidebarPresenter,
    markerView
  ) {
    "use strict";
  
    function Presenter() {}
  
    var proto = Object.create(sidebarPresenter.base.prototype);
  
    Presenter.prototype = proto;

    let mixedId = "all";
    //test
    proto.getDatasets = () => {
      return sseInitiative.getAllDatasets();
    }
    
    proto.getDefault = () => {
      let val = sseInitiative.getCurrentDatasets();
      return val===true? "all" : val;
    }

    proto.getMixedId = () => {
      return mixedId;
    }

    //set default somewhere else where it loads the initiatives
    //remove initiatives from menu on the side
    //remove initiatives from map
    proto.changeDatasets = (dataset,getAll) => {
      eventbus.publish({
        topic: "Markers.needToShowLatestSelection",//fixme
        data: {
          unselected: [],
          selected: []
        }
      });
        //if the currently loaded dataset is requested
        if(dataset === sseInitiative.getCurrentDatasets()
        //or if all are requested and the currently loaded databases are all 
        // don't do anything
            || (getAll && sseInitiative.getCurrentDatasets()===true)) return;


        //get all or get specific one
        if(getAll)
          sseInitiative.reset()
        else sseInitiative.reset(dataset);          
    };
  
    function createPresenter(view) {
      var p = new Presenter();
      p.registerView(view);  
      return p;
    }
    var pub = {
      createPresenter: createPresenter
        };
    return pub;
  });
  
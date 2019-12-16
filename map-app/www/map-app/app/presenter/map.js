define([
  "app/eventbus",
  "model/sse_initiative",
  "presenter",
  "model/config"
], function(eventbus, sse_initiative, presenter, config) {
  "use strict";

  function Presenter() {}

  var proto = Object.create(presenter.base.prototype);

  let allMarkers = [];

  proto.getContextmenuItems = function() {
    // The context menu has been disabled (in www/app/view/map.js), in accordance with
    // https://github.com/SolidarityEconomyAssociation/open-data-and-maps/issues/78
    // So, don't expect this to do anything!
    return [
      {
        text: "Placehoder 1 - does nothing",
        callback: function(e) {
          console.log("Context menu item 1 selected.");
          console.log(e);
        }
      },
      {
        text: "Placehoder 2 - does nothing",
        callback: function(e) {
          console.log("Context menu item 2 selected.");
          console.log(e);
        }
      },
      {
        text: "Launch Google maps",
        callback: function(e) {
          // Documentation of Google maps URL parameters from here:
          // https://moz.com/ugc/everything-you-never-wanted-to-know-about-google-maps-parameters
          // Example:
          // https://www.google.co.uk/maps?q=loc:49.8764953,1.1566544&z=14&t=p

          var params = [
            // TODO - put a marker on Google maps at e.latlng.
            //"q=loc:" puts a marker on the map, BUT ignores the z and t parameters. Hmmm.
            //"q=loc:" + e.latlng.lat.toFixed(7) + "," + e.latlng.lng.toFixed(7),
            "ll=" + e.latlng.lat.toFixed(7) + "," + e.latlng.lng.toFixed(7),
            "z=14", // zoom. TODO: Consider matching with current view?
            "t=p" // for terrain map
          ];
          var url = "https://www.google.co.uk/maps?" + params.join("&");

          // This version of the URL also works (and is more modern?).
          // But I have not worked out how to specify a terrain map, nor markers.
          //var zoom = 14;
          //var url = "https://www.google.co.uk/maps/@" + e.latlng.lat.toFixed(7) + "," + e.latlng.lng.toFixed(7) + "," + zoom + "z";
          console.log(url);
          window.open(url, "_blank");
        }
      }
    ];
  };
  proto.getMapEventHandlers = function() {
    return {
      click: function(e) {
        // Deselect any selected markers
        // this.marker.on("popupclose", e => {
        // console.log("Unselecting");
        eventbus.publish({
          topic: "Directory.InitiativeClicked",
          data: ""
        });
        // });
      },
      load: function(e) {
        console.log("Map loaded");
      },
      resize: function(e) {
        console.log("Map resize", window.innerWidth);
      }
    };
  };
  proto.onInitiativeNew = function(data) {
    const initiative = data,
      marker = this.view.addMarker(initiative).marker;

    if (marker.hasPhysicalLocation) allMarkers.push(marker);
  };

  proto.onInitiativeReset = function(data) {
    
    this.view.removeAllMarkers();
    allMarkers = [];
    console.log("removing all");
    //rm markers 
    

  };

  proto.onInitiativeComplete = function() {
    // Load the markers into the clustergroup
    this.view.fitBounds(sse_initiative.latLngBounds());
    this.view.unselectedClusterGroup.addLayers(allMarkers);
    console.log("onInitiativeComplete");
    // eventbus.publish({
    //   topic: "Markers.completed",
    //   data: { markers: allMarkers }
    // });
    // eventbus.publish({
    //   topic: "Markers.",
    //   data: ""
    // });
  };
  proto.onInitiativeDatasetLoaded = function(data) {
    console.log("onInitiativeDatasetLoaded");
    //console.log(data);
    //console.log(data.latLngBounds());
    // this.view.fitBounds([[-45.87859, -162.60022], [76.47861, 176.84446]]);
  };
  proto.onInitiativeLoadComplete = function() {
    /* The protecting veil is now obsolete. */
    //view.clearProtectingVeil();
    // TODO - hook this up to a log?
  };
  proto.onInitiativeLoadMessage = function(data) {
    /* The protecting veil is now obsolete. */
    //view.showProtectingVeil(data.message);
    // TODO - hook this up to a log?
  };
  proto.onMarkersNeedToShowLatestSelection = function(data) {
    console.log("onMarkersNeedToShowLatestSelection");
    const that = this;

    data.unselected.forEach(function(e) {
      that.view.setUnselected(e);
    });
    data.selected.forEach(function(e) {
      that.view.setSelected(e);
    });
  };
  proto.onNeedToShowInitiativeTooltip = function(data) {
    this.view.showTooltip(data);
  };
  proto.onNeedToHideInitiativeTooltip = function(data) {
    this.view.hideTooltip(data);
  };
  //	proto.onInitiativeSelected = function(data) {
  //		const initiative = data;
  //		console.log('onInitiativeSelected');
  //		console.log(initiative);
  //		this.view.setSelected(initiative);
  //		this.view.zoomAndPanTo({lon: initiative.lng, lat: initiative.lat});
  //	};
  proto.onMapNeedsToBeZoomedAndPanned = function(data) {
    console.log("onMapNeedsToBeZoomedAndPanned ", data);
    const latLngBounds = data;
    this.view.flyToBounds(latLngBounds);
    // this.view.flyTo(data);
    // this.view.setView(data);
  };

  proto.onBoundsRequested = function(data) {
    this.view.fitBounds(data);
  };

  proto.setZoom = function(data) {
    console.log("Zooming to ", data);
    const zoom = data;
    this.view.setZoom(zoom);
  };

  proto.getInitialBounds = function() {
    return config.getInitialBounds();
  };

  proto.getInitialZoom = function() {};

  proto.setActiveArea = function(data) {
    this.view.setActiveArea(data);
  };

  proto.getDisableClusteringAtZoomFromConfig = function() {
    return config.getDisableClusteringAtZoom() || false;
  };

  Presenter.prototype = proto;

  function createPresenter(view) {
    var p = new Presenter();
    p.registerView(view);
    eventbus.subscribe({
      topic: "Initiative.datasetLoaded",
      callback: function(data) {
        p.onInitiativeDatasetLoaded(data);
      }
    });
    eventbus.subscribe({
      topic: "Initiative.new",
      callback: function(data) {
        p.onInitiativeNew(data);
      }
    });
    eventbus.subscribe({
      topic: "Initiative.reset",
      callback: function(data) {
        p.onInitiativeReset(data);
      }
    });
    eventbus.subscribe({
      topic: "Initiative.complete",
      callback: function() {
        p.onInitiativeComplete();
      }
    });

    //eventbus.subscribe({topic: "Initiative.loadComplete", callback: function(data) { p.onInitiativeLoadComplete(data); } });
    //eventbus.subscribe({topic: "Initiative.loadStarted", callback: function(data) { p.onInitiativeLoadMessage(data); } });
    //eventbus.subscribe({topic: "Initiative.loadFailed", callback: function(data) { p.onInitiativeLoadMessage(data); } });
    // TODO - strip out this mechanism from everywhere it appears:
    //eventbus.subscribe({topic: "Initiative.selected", callback: function(data) { p.onInitiativeSelected(data); } });
    eventbus.subscribe({
      topic: "Markers.needToShowLatestSelection",
      callback: function(data) {
        p.onMarkersNeedToShowLatestSelection(data);
      }
    });
    eventbus.subscribe({
      topic: "Map.needsToBeZoomedAndPanned",
      callback: function(data) {
        p.onMapNeedsToBeZoomedAndPanned(data);
      }
    });
    eventbus.subscribe({
      topic: "Map.needToShowInitiativeTooltip",
      callback: function(data) {
        p.onNeedToShowInitiativeTooltip(data);
      }
    });
    eventbus.subscribe({
      topic: "Map.needToHideInitiativeTooltip",
      callback: function(data) {
        p.onNeedToHideInitiativeTooltip(data);
      }
    });
    eventbus.subscribe({
      topic: "Map.setZoom",
      callback: function(data) {
        p.setZoom(data);
      }
    });

    eventbus.subscribe({
      topic: "Map.setActiveArea",
      callback: function(data) {
        p.setActiveArea(data);
      }
    });

    eventbus.subscribe({
      topic: "Map.fitBounds",
      callback: function(data) {
        p.onBoundsRequested(data);
      }
    });

    return p;
  }
  var pub = {
    createPresenter: createPresenter
  };
  return pub;
});

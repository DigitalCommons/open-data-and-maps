define([
  "d3",
  "leaflet",
  "leafletActiveArea",
  "leaflet.contextmenu",
  "view/base",
  "presenter/map",
  "view/map/marker"
], function(
  d3,
  leaflet,
  activeArea,
  contextmenu,
  viewBase,
  presenter,
  markerView
) {
  "use strict";

  const config = {
    putSelectedMarkersInClusterGroup: false
  };

  function MapView() {}
  // inherit from the standard view base object:
  var proto = Object.create(viewBase.base.prototype);
  proto.createMap = function() {
    const openCycleMapUrl =
      "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png";
    const osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const osmAttrib =
      'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
    var i,
      eventHandlers = this.presenter.getMapEventHandlers();
    var k = Object.keys(eventHandlers);
    // For the contextmenu docs, see https://github.com/aratcliffe/Leaflet.contextmenu.
    this.map = leaflet.map("map-app-leaflet-map", {
      // set to true to re-enable context menu.
      // See https://github.com/SolidarityEconomyAssociation/open-data-and-maps/issues/78
      contextmenu: false
      // contextmenuWidth: 140,
      // contextmenuItems: this.presenter.getContextmenuItems()
    });
    this.map.zoomControl.setPosition("bottomright");

    // Get the initial bounds from config
    let initialBounds = this.presenter.getInitialBounds();
    if (initialBounds) this.map.fitBounds(initialBounds);

    for (i = 0; i < k.length; ++i) {
      this.map.on(k[i], eventHandlers[k[i]]);
    }

    leaflet
      .tileLayer(osmUrl, { attribution: osmAttrib, maxZoom: 18 })
      .addTo(this.map);

    this.unselectedClusterGroup = leaflet.markerClusterGroup({
      disableClusteringAtZoom: 8,
      chunkedLoading: true
    });
    // Look at https://github.com/Leaflet/Leaflet.markercluster#bulk-adding-and-removing-markers for chunk loading
    this.map.addLayer(this.unselectedClusterGroup);
    if (config.putSelectedMarkersInClusterGroup) {
      this.selectedClusterGroup = leaflet.markerClusterGroup();
      this.map.addLayer(this.selectedClusterGroup);
    } else {
      // If we're here, then selectedClusterGroup is a BAD NAME for this property!
      this.selectedClusterGroup = this.map;
    }
    markerView.setSelectedClusterGroup(this.selectedClusterGroup);
    markerView.setUnselectedClusterGroup(this.unselectedClusterGroup);

    // var that = this;

    // this.map.on("zoomend", e => {
    //   console.log(this.map.selectedInitiative);
    //   if (this.map.selectedInitiative)
    //     markerView.setSelected(this.map.selectedInitiative);
    // });
  };
  proto.addMarker = function(initiative) {
    return markerView.createMarker(this.map, initiative);
  };
  proto.setSelected = function(initiative) {
    markerView.setSelected(initiative);
  };
  proto.setUnselected = function(initiative) {
    markerView.setUnselected(initiative);
  };
  proto.showTooltip = function(initiative) {
    markerView.showTooltip(initiative);
  };
  proto.hideTooltip = function(initiative) {
    markerView.hideTooltip(initiative);
  };
  proto.setZoom = function(zoom) {
    this.map.setZoom(zoom);
  };
  proto.fitBounds = function(data) {
    let bounds = data,
      options = {};
    if (!Array.isArray(data)) {
      bounds = data.bounds;
      options = data.options;
    }
    this.map.fitBounds(bounds, options);
  };

  proto.setView = function(data) {
    let latlng = data,
      zoom = this.map.getZoom(),
      options = {
        duration: 0.25
        // maxZoom: this.map.getZoom()
      };
    if (!Array.isArray(data)) {
      latlng = data.latlng;
      options = Object.assign(options, data.options);
    }
    // if (data.offset) {
    //   let targetPoint = this.map
    //     .project(data.latlng, zoom)
    //     .subtract([data.offset / 2, 0]);
    //   latlng = this.map.unproject(targetPoint, zoom);
    // }
    this.map.setView(latlng);
  };

  proto.flyTo = function(data) {
    let latlng = data,
      options = {
        duration: 0.25
        // maxZoom: this.map.getZoom()
      };
    if (!Array.isArray(data)) {
      latlng = data.latlng;
      options = Object.assign(options, data.options);
    }
    this.map.flyTo(latlng, this.map.getZoom(), options);
  };

  proto.flyToBounds = function(data) {
    let bounds = data,
      options = { duration: 0.25, maxZoom: this.map.getZoom() };
    if (!Array.isArray(data)) {
      bounds = data.bounds;
      options = Object.assign(options, data.options);
    }
    this.map.flyToBounds(bounds, options);
  };

  proto.zoomAndPanTo = function(latLng) {
    console.log("zoomAndPanTo");
    this.map.setView(latLng, 16, { animate: true });
  };

  proto.setActiveArea = function(data) {
    // let mapSize = this.map.getSize().subtract([sidebarWidth]);

    if (!data.target.id) return;

    const refocusMap = true,
      animateRefocus = true;

    this.map.setActiveArea(
      {
        position: "absolute",
        top: 0,
        left: data.sidebarWidth + "px",
        right: 0,
        bottom: 0
      },
      refocusMap,
      animateRefocus
    );
  };
  // proto.getMap = function() {
  //   return this.map;
  // };
  MapView.prototype = proto;
  function init() {
    const view = new MapView();
    view.setPresenter(presenter.createPresenter(view));
    view.createMap();
    return view;
  }
  var pub = {
    init: init
  };
  return pub;
});

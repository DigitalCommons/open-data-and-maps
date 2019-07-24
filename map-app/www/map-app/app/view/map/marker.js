define([
  "leaflet",
  "leafletMarkerCluster",
  "leafletAwesomeMarkers",
  "view/base",
  "presenter/map/marker",
  "app/eventbus"
], function(leaflet, cluster, awesomeMarkers, viewBase, presenter, eventbus) {
  "use strict";

  // Keep a mapping between initiatives and their Markers:
  const markerForInitiative = {};
  // CAUTION: this may be either a ClusterGroup, or the map itself
  let hiddenClusterGroup = null;
  let unselectedClusterGroup = null;

  function MarkerView() {}
  // inherit from the standard view base object:
  var proto = Object.create(viewBase.base.prototype);

  // Using font-awesome icons, the available choices can be seen here:
  // http://fortawesome.github.io/Font-Awesome/icons/
  const dfltOptions = { prefix: "fa" }; // "fa" selects the font-awesome icon set (we have no other)

  proto.create = function(map, initiative) {
    this.initiative = initiative;

    // options argument overrides our default options:
    const opts = Object.assign(dfltOptions, {
      // icon: this.presenter.getIcon(initiative),
      popuptext: this.presenter.getInitiativeContent(initiative)
      // hovertext: this.presenter.getHoverText(initiative),
      // cluster: true,
      // markerColor: this.presenter.getMarkerColor(initiative)
    });

    // For non-geo initiatives we don't need a marker but still want to get the initiativeContent
    // TODO: Content generation should live somewhere else.
    // const ukPostcode = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;
    if (!initiative.lat || !initiative.lng) {
      initiative.nongeo = 1;

      initiative.lat = initiative.nongeoLat;
      initiative.lng = initiative.nongeoLng;

      const icon = leaflet.AwesomeMarkers.icon({
        prefix: "fa",
        markerColor: "red",
        iconColor: "white",
        icon: "certificate",
        className: "awesome-marker sea-non-geo-marker",
        cluster: false
      });

      this.marker = leaflet.marker(this.presenter.getLatLng(initiative), {
        icon: icon,
        initiative: this.initiative
      });

      initiative.marker = this.marker;

      this.marker.bindPopup(opts.popuptext, {
        minWidth: "472",
        maxWidth: "472",
        closeButton: false,
        className: "sea-initiative-popup sea-non-geo-initiative"
      });

      this.cluster = hiddenClusterGroup;
      this.cluster.addLayer(this.marker);
    } else {
      const hovertext = this.presenter.getHoverText(initiative);

      const icon = leaflet.AwesomeMarkers.icon({
        prefix: "fa",
        markerColor: this.initiative.primaryActivity
          ? this.initiative.primaryActivity.toLowerCase()
          : "AM00",
        iconColor: "white",
        icon: "certificate",
        className: "awesome-marker sea-marker",
        cluster: false
      });

      //this.marker = leaflet.marker(this.presenter.getLatLng(initiative), {icon: icon, title: hovertext});
      this.marker = leaflet.marker(this.presenter.getLatLng(initiative), {
        icon: icon,
        initiative: this.initiative
      });

      initiative.marker = this.marker;

      // maxWidth helps to accomodate big font, for presentation purpose, set up in CSS
      // maxWidth:800 is needed if the font-size is set to 200% in CSS:
      this.marker.bindPopup(opts.popuptext, {
        minWidth: "472",
        maxWidth: "472",
        closeButton: false,
        className: "sea-initiative-popup"
      });
      this.marker.bindTooltip(this.presenter.getHoverText(initiative));
      const that = this;
      this.marker.on("click", function(e) {
        that.onClick(e);
      });
      this.cluster = unselectedClusterGroup;
      this.cluster.addLayer(this.marker);
    }
    // this.marker.on("popupclose", e => {
    //   eventbus.publish({
    //     topic: "Directory.InitiativeClicked",
    //     data: ""
    //   });
    // });

    markerForInitiative[initiative.uniqueId] = this;
  };
  proto.onClick = function(e) {
    // console.log("MarkerView.onclick");
    // Browser seems to consume the ctrl key: ctrl-click is like right-buttom-click (on Chrome)
    if (e.originalEvent.ctrlKey) {
      console.log("ctrl");
    }
    if (e.originalEvent.altKey) {
      console.log("alt");
    }
    if (e.originalEvent.metaKey) {
      console.log("meta");
    }
    if (e.originalEvent.shiftKey) {
      console.log("shift");
    }
    if (e.originalEvent.shiftKey) {
      this.presenter.notifySelectionToggled(this.initiative);
    } else {
      console.log(this.initiative);
      // this.presenter.notifySelectionSet(this.initiative);
      eventbus.publish({
        topic: "Directory.InitiativeClicked",
        data: this.initiative
      });
    }
  };
  proto.setUnselected = function(initiative) {
    if (!initiative.nongeo) {
      this.marker.setIcon(
        leaflet.AwesomeMarkers.icon({
          prefix: "fa",
          markerColor: this.initiative.primaryActivity
            ? this.initiative.primaryActivity.toLowerCase()
            : "AM00",
          iconColor: "white",
          icon: "certificate",
          className: "awesome-marker sea-marker",
          cluster: false
        })
      );
    }
  };
  proto.setSelected = function(initiative) {
    var that = this;
    if (!initiative.nongeo) {
      this.marker.setIcon(
        leaflet.AwesomeMarkers.icon({
          prefix: "fa",
          markerColor: this.initiative.primaryActivity
            ? this.initiative.primaryActivity.toLowerCase()
            : "AM00",
          iconColor: "white",
          icon: "certificate",
          className: "awesome-marker sea-marker sea-selected",
          cluster: false
        })
      );
    }
    if (initiative.nongeo) {
      initiative.marker.openPopup();
    } else if (unselectedClusterGroup._inZoomAnimation) {
      unselectedClusterGroup.on("animationend", e => {
        if (
          unselectedClusterGroup.getVisibleParent(initiative.marker) !==
          initiative.marker
        ) {
          initiative.marker.__parent.spiderfy();
        }
        initiative.marker.openPopup();
        unselectedClusterGroup.off("animationend");
      });
    } else {
      if (
        unselectedClusterGroup.getVisibleParent(initiative.marker) !==
        initiative.marker
      ) {
        initiative.marker.__parent.spiderfy();
      }
      initiative.marker.openPopup();
    }
  };
  proto.showTooltip = function(initiative) {
    // This variation zooms the map, and makes sure the marker can
    // be seen, spiderifying if needed.
    // But this auto-zooming maybe more than the user bargained for!
    // It might disrupt their flow.
    //this.cluster.zoomToShowLayer(this.marker);

    // This variation spiderfys the cluster to which the marker belongs.
    // This only works if selectedClusterGroup is actually a ClusterGroup!
    //const cluster = selectedClusterGroup.getVisibleParent(this.marker);
    //if (cluster && typeof cluster.spiderfy === 'function') {
    //cluster.spiderfy();
    //}
    this.marker.openTooltip();
    this.marker.setZIndexOffset(1000);
  };
  proto.hideTooltip = function(initiative) {
    this.marker.closeTooltip();
    this.marker.setZIndexOffset(0);
  };
  proto.getInitiativeContent = function(initiative) {
    return this.presenter.getInitiativeContent(initiative);
  };

  function setSelected(initiative) {
    markerForInitiative[initiative.uniqueId].setSelected(initiative);
  }
  function setUnselected(initiative) {
    markerForInitiative[initiative.uniqueId].setUnselected(initiative);
  }
  proto.destroy = function() {
    this.cluster.removeLayer(this.marker);
  };
  MarkerView.prototype = proto;

  function createMarker(map, initiative) {
    const view = new MarkerView();
    view.setPresenter(presenter.createPresenter(view));
    view.create(map, initiative);
    return view;
  }
  function setSelectedClusterGroup(clusterGroup) {
    // CAUTION: this may be either a ClusterGroup, or the map itself
    hiddenClusterGroup = clusterGroup;
  }
  function setUnselectedClusterGroup(clusterGroup) {
    unselectedClusterGroup = clusterGroup;
  }
  function showTooltip(initiative) {
    markerForInitiative[initiative.uniqueId].showTooltip(initiative);
  }
  function hideTooltip(initiative) {
    markerForInitiative[initiative.uniqueId].hideTooltip(initiative);
  }

  function getInitiativeContent(initiative) {
    // console.log(this.getInitiativeContent(initiative));
    return markerForInitiative[initiative.uniqueId].getInitiativeContent(
      initiative
    );
  }

  var pub = {
    createMarker: createMarker,
    setSelectedClusterGroup: setSelectedClusterGroup,
    setUnselectedClusterGroup: setUnselectedClusterGroup,
    setSelected: setSelected,
    setUnselected: setUnselected,
    showTooltip: showTooltip,
    hideTooltip: hideTooltip,
    getInitiativeContent: getInitiativeContent
  };
  return pub;
});

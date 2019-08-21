define(["app/eventbus", "presenter", "model/config"], function(
  eventbus,
  presenter,
  config
) {
  "use strict";

  function Presenter() {}

  const orgStructures = {
    OS10: "Community group (formal or informal)",
    OS20: "Not-for-profit organisation",
    OS30: "Social enterprise",
    OS40: "Charity",
    OS50: "Company (Other)",
    OS60: "Workers co-operative",
    OS70: "Housing co-operative",
    OS80: "Consumer co-operative",
    OS90: "Producer co-operative",
    OS100: "Multi-stakeholder co-operative",
    OS110: "Secondary co-operative",
    OS120: "Community Interest Company (CIC)",
    OS130: "Community Benefit Society / Industrial and Provident Society (IPS)",
    OS140: "Employee trust",
    OS150: "Self-employed",
    OS160: "Unincorporated"
  };

  const proto = Object.create(presenter.base.prototype);
  const serviceToDisplaySimilarCompanies =
    document.location.origin +
    document.location.pathname +
    config.getServicesPath() +
    "display_similar_companies/main.php";

  proto.notifySelectionToggled = function(initiative) {
    eventbus.publish({ topic: "Marker.SelectionToggled", data: initiative });
  };
  proto.notifySelectionSet = function(initiative) {
    eventbus.publish({ topic: "Marker.SelectionSet", data: initiative });
  };

  // We're now leaving for the view to set up its own eventhandlers,
  // so this is obsolete ... until we change our minds :-)
  // proto.getEventHandlers = function(initiative) {
  //   return {
  //     click: function(e) {
  //       // eventbus.publish({topic: "Initiative.clicked", data: {initiative: initiative, mouseEvent: e}});
  //       console.log("marker clicked");
  //     },
  //     clusterclick: function(e) {
  //       console.log("cluster clicked");
  //     }
  //   };
  // };
  proto.getLatLng = function(initiative) {
    return [initiative.lat, initiative.lng];
  };
  proto.getHoverText = function(initiative) {
    return initiative.name;
  };
  proto.prettyPhone = function(tel) {
    return tel.replace(/^(\d)(\d{4})\s*(\d{6})/, "$1$2 $3");
  };
  // proto.getAllOrgStructures = function() {
  //   return orgStructures;
  // };
  proto.getInitiativeContent = function(initiative) {
    let address = "",
      street,
      locality,
      postcode,
      popupHTML =
        '<div class="sea-initiative-details">' +
        '<h2 class="sea-initiative-name">{initiative.name}</h2>' +
        '<h4 class="sea-initiative-org-structure">{initiative.org-structure}</h4>' +
        "<p>{initiative.desc}</p>" +
        "</div>" +
        '<div class="sea-initiative-contact">' +
        "<h3>Contact</h3>" +
        "{initiative.address}" +
        "{initiative.tel}" +
        '<div class="sea-initiative-links">' +
        "{initiative.www}" +
        "{initiative.email}" +
        "</div>" +
        "</div>";
    // All initiatives should have a name
    popupHTML = popupHTML.replace("{initiative.name}", initiative.name);
    // TODO Add org type
    popupHTML = popupHTML.replace(
      "{initiative.org-structure}",
      initiative.orgStructure.map(OS => orgStructures[OS]).join(", ")
    );
    // All initiatives should have a description (this isn't true with dotcoop)
    popupHTML = popupHTML.replace("{initiative.desc}", initiative.desc || "");
    // We want to add the whole address into a single para
    // Not all orgs have an address
    if (initiative.street) {
      let streetArray = initiative.street.split(";");
      for (let partial of streetArray) {
        if (partial === initiative.name) continue;
        if (street) street += "<br/>";
        street = street ? (street += partial) : partial;
      }
      address += street;
    }
    if (initiative.locality) {
      address += (address.length ? "<br/>" : "") + initiative.locality;
    }
    if (initiative.region) {
      address += (address.length ? "<br/>" : "") + initiative.region;
    }
    if (initiative.postcode) {
      address += (address.length ? "<br/>" : "") + initiative.postcode;
    }
    if (initiative.country) {
      address += (address.length ? "<br/>" : "") + initiative.country;
    }
    if (address.length) {
      address = '<p class="sea-initiative-address">' + address + "</p>";
    }
    popupHTML = popupHTML.replace("{initiative.address}", address);

    // Not all orgs have an email
    if (initiative.email) {
      popupHTML = popupHTML.replace(
        "{initiative.email}",
        '<a class="fa fa-at" href="mailto:' + initiative.email + '"></a>'
      );
    } else popupHTML = popupHTML.replace("{initiative.email}", "");

    // Not all orgs have a phone number
    popupHTML = popupHTML.replace(
      "{initiative.tel}",
      initiative.tel
        ? '<p class="sea-initiative-tel">' +
            this.prettyPhone(initiative.tel) +
            "</p>"
        : ""
    );
    // Not all orgs have a website
    popupHTML = popupHTML.replace(
      "{initiative.www}",
      initiative.www
        ? '<a class="fa fa-link" target="_blank" href="' +
            initiative.www +
            '"></a>'
        : ""
    );

    return popupHTML;
  };

  proto.getMarkerColor = function(initiative) {
    const hasWww = initiative.www && initiative.www.length > 0;
    const hasReg = initiative.regorg && initiative.regorg.length > 0;
    const markerColor =
      hasWww && hasReg ? "purple" : hasWww ? "blue" : hasReg ? "red" : "green";
    return markerColor;
  };
  proto.getIconOptions = function(initiative) {
    const icon = initiative.dataset == "dotcoop" ? "globe" : "certificate";
    return {
      icon: icon,
      popuptext: popuptext,
      hovertext: hovertext,
      cluster: true,
      markerColor: markerColor
    };
  };
  proto.getIcon = function(initiative) {
    return initiative.dataset == "dotcoop" ? "globe" : "certificate";
  };

  Presenter.prototype = proto;

  function createPresenter(view) {
    const p = new Presenter();
    p.registerView(view);
    return p;
  }

  var pub = {
    createPresenter: createPresenter
  };
  return pub;
});

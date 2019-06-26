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
  //	proto.getEventHandlers = function(initiative) {
  //		return {
  //			click: function(e) {
  //				eventbus.publish({topic: "Initiative.clicked", data: {initiative: initiative, mouseEvent: e}});
  //			}
  //		};
  //	}
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
    // All initiatives should have a description
    popupHTML = popupHTML.replace("{initiative.desc}", initiative.desc);
    // We want to add the whole address into a single para
    // Not all orgs have an address
    if (initiative.street) {
      let streetArray = initiative.street.split(";");
      for (let partial of streetArray) {
        if (partial === initiative.name) continue;
        if (street) street += "<br/>";
        street = street ? (street += partial) : partial;
      }
    }
    if (initiative.locality) {
      locality = (street ? "<br/>" : "") + initiative.locality;
    }
    if (initiative.postcode) {
      const ukPostcode = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;
      if (initiative.postcode.match(ukPostcode))
        postcode = (street || locality ? "<br/>" : "") + initiative.postcode;
      else {
        street = locality = "";
        postcode = "No address";
      }
    } else {
      street = locality = "";
      postcode = "No address";
    }
    if (street || locality || postcode) {
      address =
        '<p class="sea-initiative-address">' +
        (street ? street : "") +
        (locality ? locality : "") +
        (postcode ? postcode : "") +
        "</p>";
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

  // TODO - make obsolete
  // const hasWww = initiative.www && initiative.www.length > 0;
  // const hasReg = initiative.regorg && initiative.regorg.length > 0;
  // const hasWithin = initiative.within && initiative.within.length > 0;
  // For info about rel="noopener noreferrer",
  // see https://www.thesitewizard.com/html-tutorial/open-links-in-new-window-or-tab.shtml
  // function link(uri, text) {
  //   return (
  //     '<a title="' +
  //     uri +
  //     '" href="' +
  //     uri +
  //     '" rel="noopener noreferrer" target="_blank">' +
  //     text +
  //     "</a>"
  //   );
  // }
  // const popupRows = [];
  // popupRows.push("View " + link(initiative.uri, "details") + " in a new tab");
  // if (hasWithin) {
  //   popupRows.push(
  //     "View " +
  //       link(initiative.within, "geographic information") +
  //       " in a new tab"
  //   );
  // }
  // if (hasWww) {
  //   popupRows.push(
  //     "View " + link(initiative.www, "website") + " in a new tab"
  //   );
  // }
  // if (hasReg) {
  //   popupRows.push(
  //     "View " +
  //       link(initiative.regorg, "company registration") +
  //       " in a new tab"
  //   );
  //   //console.log(document.location.origin + document.location.pathname + "services/" + "phpinfo.php");
  //   const serviceToDisplaySimilarCompaniesURL =
  //     serviceToDisplaySimilarCompanies +
  //     "?company=" +
  //     encodeURIComponent(initiative.regorg);
  //   //console.log(serviceToDisplaySimilarCompaniesURL);
  //   popupRows.push(
  //     "View " +
  //       link(
  //         serviceToDisplaySimilarCompaniesURL,
  //         "similar companies nearby"
  //       ) +
  //       " in a new tab"
  //   );
  //   }

  //   const popuptext =
  //     "<p>Dataset: " +
  //     initiative.dataset +
  //     "</p>" +
  //     "<h4>" +
  //     initiative.name +
  //     "</h4>" +
  //     popupRows.join("<br>");

  //   return popuptext;
  // };
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

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

  function StackItem(initiatives) {
    this.initiatives = initiatives;
  }
  StackItem.prototype.isSearchResults = function() {
    // TODO - surely there's a more direct way to decide if this is a SearchResults object?
    return this.hasOwnProperty("searchString");
  };

  // function SearchResults(initiatives, searchString) {
  // 	// isa StackItem
  // 	StackItem.call(this, initiatives);
  // 	this.searchString = searchString;
  // }
  // SearchResults.prototype = Object.create(StackItem.prototype);

  function Presenter() {}

  var proto = Object.create(sidebarPresenter.base.prototype);

  // TODO: We should get these values programatically or from the config
  const values = {
    Activities: {
      ALL: "All Activities",
      AM10: "Arts, Media, Culture & Leisure",
      AM20: "Campaigning, Activism & Advocacy",
      AM30: "Community & Collective Spaces",
      AM40: "Education",
      AM50: "Energy",
      AM60: "Food",
      AM70: "Goods & Services",
      AM80: "Health, Social Care & Wellbeing",
      AM90: "Housing",
      AM100: "Money & Finance",
      AM110: "Nature, Conservation & Environment",
      AM120: "Reduce, Reuse, Repair & Recycle"
    },

    Countries: {
      ALL: "All Countries",
      AF: "Afghanistan",
      AX: "Aland Islands",
      AL: "Albania",
      DZ: "Algeria",
      AS: "American Samoa",
      AD: "Andorra",
      AO: "Angola",
      AI: "Anguilla",
      AQ: "Antarctica",
      AG: "Antigua And Barbuda",
      AR: "Argentina",
      AM: "Armenia",
      AW: "Aruba",
      AU: "Australia",
      AT: "Austria",
      AZ: "Azerbaijan",
      BS: "Bahamas",
      BH: "Bahrain",
      BD: "Bangladesh",
      BB: "Barbados",
      BY: "Belarus",
      BE: "Belgium",
      BZ: "Belize",
      BJ: "Benin",
      BM: "Bermuda",
      BT: "Bhutan",
      BO: "Bolivia",
      BA: "Bosnia And Herzegovina",
      BW: "Botswana",
      BV: "Bouvet Island",
      BR: "Brazil",
      IO: "British Indian Ocean Territory",
      BN: "Brunei Darussalam",
      BG: "Bulgaria",
      BF: "Burkina Faso",
      BI: "Burundi",
      KH: "Cambodia",
      CM: "Cameroon",
      CA: "Canada",
      CV: "Cape Verde",
      KY: "Cayman Islands",
      CF: "Central African Republic",
      TD: "Chad",
      CL: "Chile",
      CN: "China",
      CX: "Christmas Island",
      CC: "Cocos (Keeling) Islands",
      CO: "Colombia",
      KM: "Comoros",
      CG: "Congo",
      CD: "Congo, Democratic Republic",
      CK: "Cook Islands",
      CR: "Costa Rica",
      CI: "Cote D'Ivoire",
      HR: "Croatia",
      CU: "Cuba",
      CY: "Cyprus",
      CZ: "Czech Republic",
      DK: "Denmark",
      DJ: "Djibouti",
      DM: "Dominica",
      DO: "Dominican Republic",
      EC: "Ecuador",
      EG: "Egypt",
      SV: "El Salvador",
      GQ: "Equatorial Guinea",
      ER: "Eritrea",
      EE: "Estonia",
      ET: "Ethiopia",
      FK: "Falkland Islands (Malvinas)",
      FO: "Faroe Islands",
      FJ: "Fiji",
      FI: "Finland",
      FR: "France",
      GF: "French Guiana",
      PF: "French Polynesia",
      TF: "French Southern Territories",
      GA: "Gabon",
      GM: "Gambia",
      GE: "Georgia",
      DE: "Germany",
      GH: "Ghana",
      GI: "Gibraltar",
      GR: "Greece",
      GL: "Greenland",
      GD: "Grenada",
      GP: "Guadeloupe",
      GU: "Guam",
      GT: "Guatemala",
      GG: "Guernsey",
      GN: "Guinea",
      GW: "Guinea-Bissau",
      GY: "Guyana",
      HT: "Haiti",
      HM: "Heard Island & Mcdonald Islands",
      VA: "Holy See (Vatican City State)",
      HN: "Honduras",
      HK: "Hong Kong",
      HU: "Hungary",
      IS: "Iceland",
      IN: "India",
      ID: "Indonesia",
      IR: "Iran, Islamic Republic Of",
      IQ: "Iraq",
      IE: "Ireland",
      IM: "Isle Of Man",
      IL: "Israel",
      IT: "Italy",
      JM: "Jamaica",
      JP: "Japan",
      JE: "Jersey",
      JO: "Jordan",
      KZ: "Kazakhstan",
      KE: "Kenya",
      KI: "Kiribati",
      KR: "Korea",
      KW: "Kuwait",
      KG: "Kyrgyzstan",
      LA: "Lao People's Democratic Republic",
      LV: "Latvia",
      LB: "Lebanon",
      LS: "Lesotho",
      LR: "Liberia",
      LY: "Libyan Arab Jamahiriya",
      LI: "Liechtenstein",
      LT: "Lithuania",
      LU: "Luxembourg",
      MO: "Macao",
      MK: "Macedonia",
      MG: "Madagascar",
      MW: "Malawi",
      MY: "Malaysia",
      MV: "Maldives",
      ML: "Mali",
      MT: "Malta",
      MH: "Marshall Islands",
      MQ: "Martinique",
      MR: "Mauritania",
      MU: "Mauritius",
      YT: "Mayotte",
      MX: "Mexico",
      FM: "Micronesia, Federated States Of",
      MD: "Moldova",
      MC: "Monaco",
      MN: "Mongolia",
      ME: "Montenegro",
      MS: "Montserrat",
      MA: "Morocco",
      MZ: "Mozambique",
      MM: "Myanmar",
      NA: "Namibia",
      NR: "Nauru",
      NP: "Nepal",
      NL: "Netherlands",
      AN: "Netherlands Antilles",
      NC: "New Caledonia",
      NZ: "New Zealand",
      NI: "Nicaragua",
      NE: "Niger",
      NG: "Nigeria",
      NU: "Niue",
      NF: "Norfolk Island",
      MP: "Northern Mariana Islands",
      NO: "Norway",
      OM: "Oman",
      PK: "Pakistan",
      PW: "Palau",
      PS: "Palestinian Territory, Occupied",
      PA: "Panama",
      PG: "Papua New Guinea",
      PY: "Paraguay",
      PE: "Peru",
      PH: "Philippines",
      PN: "Pitcairn",
      PL: "Poland",
      PT: "Portugal",
      PR: "Puerto Rico",
      QA: "Qatar",
      RE: "Reunion",
      RO: "Romania",
      RU: "Russian Federation",
      RW: "Rwanda",
      BL: "Saint Barthelemy",
      SH: "Saint Helena",
      KN: "Saint Kitts And Nevis",
      LC: "Saint Lucia",
      MF: "Saint Martin",
      PM: "Saint Pierre And Miquelon",
      VC: "Saint Vincent And Grenadines",
      WS: "Samoa",
      SM: "San Marino",
      ST: "Sao Tome And Principe",
      SA: "Saudi Arabia",
      SN: "Senegal",
      RS: "Serbia",
      SC: "Seychelles",
      SL: "Sierra Leone",
      SG: "Singapore",
      SK: "Slovakia",
      SI: "Slovenia",
      SB: "Solomon Islands",
      SO: "Somalia",
      ZA: "South Africa",
      GS: "South Georgia And Sandwich Isl.",
      ES: "Spain",
      LK: "Sri Lanka",
      SD: "Sudan",
      SR: "Suriname",
      SJ: "Svalbard And Jan Mayen",
      SZ: "Swaziland",
      SE: "Sweden",
      CH: "Switzerland",
      SY: "Syrian Arab Republic",
      TW: "Taiwan",
      TJ: "Tajikistan",
      TZ: "Tanzania",
      TH: "Thailand",
      TL: "Timor-Leste",
      TG: "Togo",
      TK: "Tokelau",
      TO: "Tonga",
      TT: "Trinidad And Tobago",
      TN: "Tunisia",
      TR: "Turkey",
      TM: "Turkmenistan",
      TC: "Turks And Caicos Islands",
      TV: "Tuvalu",
      UG: "Uganda",
      UA: "Ukraine",
      AE: "United Arab Emirates",
      GB: "United Kingdom",
      US: "United States",
      UM: "United States Outlying Islands",
      UY: "Uruguay",
      UZ: "Uzbekistan",
      VU: "Vanuatu",
      VE: "Venezuela",
      VN: "Viet Nam",
      VG: "Virgin Islands, British",
      VI: "Virgin Islands, U.S.",
      WF: "Wallis And Futuna",
      EH: "Western Sahara",
      YE: "Yemen",
      ZM: "Zambia",
      ZW: "Zimbabwe"
    }
  };

  proto.currentItem = function() {
    return this.contentStack.current();
  };
  proto.currentItemExists = function() {
    // returns true only if the contentStack is empty
    return typeof this.contentStack.current() !== "undefined";
  };

  proto.getAllValuesByName = function(name) {
    return values[name];
  };

  proto.getRegisteredValues = function() {
    return sseInitiative.getRegisteredValues();
  };

  proto.notifyViewToBuildDirectory = function() {
    this.view.refresh();
  };

  proto.getInitiativesForFieldAndSelectionKey = function(field, key) {
    return sseInitiative.getRegisteredValues()[field][key];
  };

  proto.getInitiativeByUniqueId = function(uid) {
    return sseInitiative.getInitiativeByUniqueId(uid);
  };

  function arrayMax(array) {
    return array.reduce((a, b) => Math.max(a, b));
  }
  function arrayMin(array) {
    return array.reduce((a, b) => Math.min(a, b));
  }

  proto.doesDirectoryHaveColours = function() {
    return config.doesDirectoryHaveColours();
  };

  proto.notifyMapNeedsToNeedsToBeZoomedAndPanned = function(initiative) {
    // const initiatives = this.contentStack.current().initiatives;
    const initiatives = [initiative];
    let sidebarWidth = sidebarView.sidebarWidth || 0;
    const lats = initiatives.map(x => x.lat);
    const lngs = initiatives.map(x => x.lng);

    if (initiatives.length > 0) {
      eventbus.publish({
        topic: "Map.needsToBeZoomedAndPanned",
        data: {
          bounds: [
            [arrayMin(lats), arrayMin(lngs)],
            [arrayMax(lats), arrayMax(lngs)]
          ],
          options: {
            paddingTopLeft: [sidebarWidth, window.innerHeight / 2],
            paddingBottomRight: [0, 0]
          }
        }
      });
    }
  };

  proto.initiativeClicked = function(initiative) {
    const lastContent = this.contentStack.current();
    if (initiative) {
      this.contentStack.append(new StackItem([initiative]));
      // Move the window to the right position first
      this.notifyMapNeedsToNeedsToBeZoomedAndPanned(initiative);
      // Update selection
      eventbus.publish({
        topic: "Markers.needToShowLatestSelection",
        data: {
          unselected: lastContent ? lastContent.initiatives : [],
          selected: this.contentStack.current().initiatives
        }
      });
      // Populate the sidebar and hoghlight the iitiative in the directory
      this.view.populateInitiativeSidebar(
        initiative,
        markerView.getInitiativeContent(initiative)
      );
    } else {
      // User has deselected
      // TODO: This probably shouldn\t be here
      eventbus.publish({
        topic: "Markers.needToShowLatestSelection",
        data: {
          unselected: lastContent ? lastContent.initiatives : [],
          selected: []
        }
      });
      // Deselect the sidebar and hoghlight the iitiative in the directory
      this.view.deselectInitiativeSidebar();
    }
  };

  Presenter.prototype = proto;

  function createPresenter(view) {
    var p = new Presenter();
    p.registerView(view);
    // Populate the directory with the registered activities
    eventbus.subscribe({
      topic: "Initiative.datasetLoaded",
      callback: function(data) {
        p.notifyViewToBuildDirectory();
      }
    });
    // eventbus.subscribe({topic: "Marker.SelectionToggled", callback: function(data) { p.onMarkerSelectionToggled(data); } });
    // eventbus.subscribe({topic: "Marker.SelectionSet", callback: function(data) { p.onMarkerSelectionSet(data); } });
    eventbus.subscribe({
      topic: "Directory.InitiativeClicked",
      callback: function(data) {
        p.initiativeClicked(data);
      }
    });

    return p;
  }
  var pub = {
    createPresenter: createPresenter
  };
  return pub;
});

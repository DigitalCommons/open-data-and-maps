"use strict";

/* Definitions for the Custom Element <map-app>
 */

(function() {
  let tmpl = document.createElement("template");
  tmpl.innerHTML = `
		<!-- Page Content -->
		<div class="w3-teal map-app-content">
			<!-- Sidebar -->
			<div class="sea-sidebar" style="flex-direction:column;" id="map-app-sidebar">
				<!--  Button to show sidebar -->
				<div id="map-app-sidebar-button" class="map-app-sidebar-button">
				</div>
        <div class="w3-bar-block sea-initiatives-list-sidebar" id="sea-initiatives-list-sidebar">
          <div class="sea-initiatives-list-sidebar-content" id="sea-initiatives-list-sidebar-content">
          </div>
				</div>
				<div class="w3-bar-block sea-main-sidebar">
					<div style="flex: 0 1 auto;">
						<div id="map-app-sidebar-header" class="map-app-sidebar-header">
						</div>
					</div>
					<!-- Fixed part of Sidebar that may change for different types of the sidebar (e.g. Search results) -->
					<!-- If this is not a separate flex div, then it doesn't quite render properly on iPhone:
							the bottom of the div slightly overlaps the scrollable section of the sidebar below -->
					<div style="flex: 0 1 auto;">
						<div id="map-app-sidebar-fixed-section" class="map-app-sidebar-fixed-section "></div>
					</div>
					<!-- scrollable part of sidebar -->
					<!-- occupies the remaining vertical space, with scrollbar added if needed. -->
					<div id="map-app-sidebar-scrollable-section" class="map-app-sidebar-scrollable-section">
					</div>
        </div>
        <div class="w3-bar-block sea-initiative-sidebar" id="sea-initiative-sidebar">
          <div class="sea-initiative-sidebar-content" id="sea-initiative-sidebar-content">
          </div>
        </div>
      </div>
			<div class="map-app-map-container" id="map-app-leaflet-map">
			</div>
			<div class="w3-display-container map-app-display-container">
				<!--  Search box -->
				<div id="map-app-search-widget">
				</div>
			</div>
    </div>`;

  /*!
   * Run event after the DOM is ready
   * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
   * @param  {Function} fn Callback function
   */
  var ready = function(fn) {
    // Sanity check
    if (typeof fn !== "function") return;

    // If document is already loaded, run method
    if (
      document.readyState === "interactive" ||
      document.readyState === "complete"
    ) {
      return fn();
    }

    // Otherwise, wait until document is loaded
    document.addEventListener("DOMContentLoaded", fn, false);
  };

  ready(function() {
    /* The map should be loaded only once, and only when <map-app> has no `deferload` attribute:
     */
    if (!this.map_initialized /* && !this.hasAttribute("deferload")*/) {
      this.map_initialized = true;
      //console.log("Initialilze map");

      const mapApp = document.getElementById("map-app");

      mapApp.appendChild(tmpl.content.cloneNode(true));

      // Get require.js to load the app:
      // <script data-main="app" src="lib/require.js"></script>
      const loader = document.createElement("script");
      const dataMain = document.createAttribute("data-main");
      dataMain.value = "map-app/app"; // i.e. app.js
      loader.setAttributeNode(dataMain);
      const src = document.createAttribute("src");
      // TODO: IT IS BAD that the path map-app is hard-coded. Sort it out!
      src.value = "map-app/lib/require.js";
      loader.setAttributeNode(src);
      mapApp.appendChild(loader);
    }
  });

  // Web components are not supported in IE/Edge
  // class MapApp extends HTMLElement {
  //   // If we want to monitor changes to <map-app> attributes, we say which ones here:
  //   static get observedAttributes() {
  //     return ["deferload"];
  //   }
  //   // and then handle the changes in attributeChangedCallback.

  //   constructor() {
  //     // establish prototype chain
  //     super();

  //     //console.log("MapApp constructor");

  //     // Guard against initializing the map more than once:
  //     this.map_initialized = false;

  //     // For proper encapsulation: USE THE SHADOW DOM:
  //     // (need more work to debug it - doesn't seem to load via require.js when we do this)
  //     //
  //     // attaches shadow tree and returns shadow root reference
  //     // https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
  //     //
  //     // this.mapAppHost = this.attachShadow({ mode: 'open' });

  //     // Workaround: DON'T USE THE SHADOW DOM:
  //     this.mapAppHost = this;

  //     // Perhaps, if we were using the shadow DOM, then we could append
  //     // the template contents here:
  //     //
  //     //   this.mapAppHost.appendChild(tmpl.content.cloneNode(true));
  //     //
  //     // But if we do this without using the shadow DOM, we get the following runtime error:
  //     //
  //     //   "Uncaught DOMException: Failed to construct 'CustomElement': The result must not have children"
  //   }
  //   connectedCallback() {
  //     //console.log("MapApp connectedCallback");

  //     /* As a workaround to issue https://github.com/SolidarityEconomyAssociation/open-data-and-maps/issues/129,
  // 		 * the map-app can be specified to have defered loading:

  // 			<map-app deferload></map-app>

  // 		 * This is necessary when the containing element is not initially displayed.
  // 		 * In this case, the map won't be loaded until the `deferload` attribute is removed -
  // 		 * this is handled by attributeChangedCallback()
  // 		 */
  //     this.loadMapUnlessDeferred();
  //   }
  //   attributeChangedCallback(name, oldValue, newValue) {
  //     //console.log("MapApp attributeChangedCallback");

  //     if (name === "deferload") {
  //       this.loadMapUnlessDeferred();
  //     }
  //   }
  //   loadMapUnlessDeferred() {
  //     /* The map should be loaded only once, and only when <map-app> has no `deferload` attribute:
  //      */
  //     if (!this.map_initialized && !this.hasAttribute("deferload")) {
  //       this.map_initialized = true;
  //       //console.log("Initialilze map");

  //       // See comments in constructor about why we're doing this here:
  //       this.mapAppHost.appendChild(tmpl.content.cloneNode(true));

  //       // Get require.js to load the app:
  //       // <script data-main="app" src="lib/require.js"></script>
  //       const loader = document.createElement("script");
  //       const dataMain = document.createAttribute("data-main");
  //       dataMain.value = "map-app/app"; // i.e. app.js
  //       loader.setAttributeNode(dataMain);
  //       const src = document.createAttribute("src");
  //       // TODO: IT IS BAD that the path map-app is hard-coded. Sort it out!
  //       src.value = "map-app/lib/require.js";
  //       loader.setAttributeNode(src);
  //       this.mapAppHost.appendChild(loader);
  //     }
  //   }
  // }
  // customElements.define("map-app", MapApp);
})();

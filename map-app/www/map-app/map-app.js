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
    if (!this.map_initialized) {
      this.map_initialized = true;

      const mapApp = document.getElementById("map-app");

      mapApp.appendChild(tmpl.content.cloneNode(true));

      // Get require.js to load the app:
      // <script data-main="app" src="lib/require.js"></script>
      const loader = document.createElement("script");
      const dataMain = document.createAttribute("data-main");
      dataMain.value = "map-app/app.js?v=1.0.0";
      loader.setAttributeNode(dataMain);
      const src = document.createAttribute("src");
      src.value = "map-app/lib/require.js";
      loader.setAttributeNode(src);
      mapApp.appendChild(loader);
    }
  });
})();

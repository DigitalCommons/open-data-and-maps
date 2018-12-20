'use strict';

(function(){
	let tmpl = document.createElement('template');
	tmpl.innerHTML = `
		<!-- Sidebar -->
		<div class="w3-sidebar w3-teal w3-bar-block w3-border-right w3-animate-left w3-mobile"
			style="display:none;flex-direction:column;" 
			id="sidebar">
			<div style="flex: 0 1 auto;">
				<div id="sidebar-header">
				</div>
			</div>
			<!-- Fixed part of Sidebar that may change for different types of the sidebar (e.g. Search results) -->
			<!-- If this is not a separate flex div, then it doesn't quite render properly on iPhone:
			     the bottom of the div slightly overlaps the scrollable section of the sidebar below -->
			<div style="flex: 0 1 auto;">
				<div id="sidebar-fixed-section"></div>
			</div>
			<!-- scrollable part of sidebar -->
			<!-- occupies the remaining vertical space, with scrollbar added if needed. -->
			<div id="sidebar-scrollable-section" class="w3-white" style="flex: 1 1 auto;overflow-y:auto;height:100%">
			</div>
		</div>
		<!-- Page Content -->
		<div class="w3-teal map-app-content">
			<div class="mapContainer" id="map">
			</div>
			<div class="w3-display-container display-container">
				<!--  Button to show sidebar -->
				<div id="sidebar-button">
				</div>
				<!--  Search box -->
				<div id="search-widget">
				</div>
			</div>
		</div>

	`;
	class MapApp extends HTMLElement {

		// If we want to monitor changes to <map-app> attributes, we say which ones here:
		//     static get observedAttributes() { return ['display']; };
		// and then handle the changes in attributeChangedCallback

		constructor() {
			// establish prototype chain
			super();

			console.log("MapApp constructor");


			// For proper encapsulation: USE THE SHADOW DOM:
			// (need more work to debug it - doesn't seem to load via require.js when we do this)
			//
			// attaches shadow tree and returns shadow root reference
			// https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
			//
			// this.mapAppHost = this.attachShadow({ mode: 'open' });

			// Workaround: DON'T USE THE SHADOW DOM:
			this.mapAppHost = this;

			// Perhaps, if we were using the shadow DOM, then we could append
			// the template contents here:
			//
			//   this.mapAppHost.appendChild(tmpl.content.cloneNode(true));
			//
			// But if we do this without using the shadow DOM, we get the following runtime error:
			//
			//   "Uncaught DOMException: Failed to construct 'CustomElement': The result must not have children"
		}
		connectedCallback() {
			console.log("MapApp connectedCallback");

			// @todo - do we need to put a guard here in case this callback
			//         is called more than once?

			// See comments in constructor about why we're doing this here:
			this.mapAppHost.appendChild(tmpl.content.cloneNode(true));

			// Get require.js to load the app:
			// <script data-main="app" src="lib/require.js"></script> 
			const loader = document.createElement('script');
			const dataMain = document.createAttribute('data-main');
			dataMain.value = 'app';	// i.e. app.js
			loader.setAttributeNode(dataMain);
			const src = document.createAttribute('src');
			src.value = 'lib/require.js';
			loader.setAttributeNode(src);
			this.mapAppHost.appendChild(loader);
		}
		attributeChangedCallback(name, oldValue, newValue) {
			console.log("MapApp attributeChangedCallback");

			// force the window to emit a resize event:
			// This hack was to workaround a problem, with leaflet's map not initializing correctly,
			// until it had handled a resize event.
			// But I think this is fixed by not having the map-box with `display: none`
			//window.dispatchEvent(new Event('resize'));
		}
	}
	customElements.define('map-app', MapApp);
})();

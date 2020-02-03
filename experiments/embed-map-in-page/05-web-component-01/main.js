'use strict';

(function() {
  class MapApp extends HTMLElement {
    constructor() {
      // establish prototype chain
      super();

      // attaches shadow tree and returns shadow root reference
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
      const shadow = this.attachShadow({ mode: 'open' });

      // creating a container for the web component
      const mapAppContainer = document.createElement('div');
	  mapAppContainer.style.width = "100%";
	  mapAppContainer.style.height = "100%";

	  mapAppContainer.innerHTML = `
					<style>
	  @import "https://www.w3schools.com/w3css/4/w3.css";
	  #map {
	  height: 100%;
	  width: 100%;
					}
					</style>
					<div class="w3-orange w3-display-container" id="map" >
						<div class="w3-display-middle">
							<p>The map goes here.<br>
								This paragraph should be <br>
								in the middle of the orange area.<br>
								There should be no scrollbars.
							</p>
						</div>
					</div>
	  `;
	  shadow.appendChild(mapAppContainer);
	}
  }
  customElements.define('map-app', MapApp);
})();


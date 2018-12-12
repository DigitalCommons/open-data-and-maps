'use strict';

(function() {
  class MyComponent extends HTMLElement {
    constructor() {
      // establish prototype chain
      super();

      // attaches shadow tree and returns shadow root reference
      const shadow = this.attachShadow({ mode: 'open' });
	  
      // creating a container for the web component
      const container = document.createElement('div');
	  container.style.width = "100%";
	  container.style.height = "100%";

	  // Is this use of <link> inside a <div> ok? 
	  // I think it becasme available in HTML5.2
	  // I can't find info on browser support for this
	  // Works for my testing on Chrome, Safari and Firefox but what about mobile devices?
	  container.innerHTML = `
			<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" type="text/css">
			<style type="text/css">
				#component { height: 100%; width: 100%; }
			</style>
			<div class="w3-orange w3-display-container" id="component" >
				<div class="w3-display-middle">
					Black text in the middle of an orange background
				</div>
			</div>
	  `;
	  shadow.appendChild(container);
	}
  }
  customElements.define('my-component', MyComponent);
})();

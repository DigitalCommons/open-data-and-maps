'use strict';

(function() {
	let tmpl = document.createElement('template');
	tmpl.innerHTML = `
		<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" type="text/css">
		<style type="text/css">
			#component { height: 100%; width: 100%; }
		</style>
		<div class="w3-orange w3-display-container" id="component" >
			<div class="w3-display-middle">
				Black text in the middle of an orange background
			</div>
		</div>
		<div class="w3-panel">
		<slot name="foo"></slot>
		</div>
	`;
  class MyComponent extends HTMLElement {
    constructor() {
      // establish prototype chain
      super();

      // attaches shadow tree and returns shadow root reference
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
      const shadow = this.attachShadow({ mode: 'open' });
	  shadow.appendChild(tmpl.content.cloneNode(true));
	}
  }
  customElements.define('my-component', MyComponent);
})();



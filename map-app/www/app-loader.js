'use strict';
(function() {
	// This function is responsible for asking require.js to load the application.
	// It does so by adding this to the <head>:
	//     <script data-main="app" src="lib/require.js"></script>
	// Clunky DOM API is used so as not to assume anything better is avaiable at this point in loading the application.
	//
	// Implications: The client must make the following available:
	//    app-loader.js (this file)
	//    app.js        (the application to be loaded by require.js)
	//    require.js    (to do the loading)
	//
	const target = document.getElementsByTagName('head')[0];
	const loader = document.createElement('script');
	const dataMain = document.createAttribute('data-main');
	dataMain.value = 'app';	// i.e. app.js
	loader.setAttributeNode(dataMain);
	const src = document.createAttribute('src');
	src.value = 'lib/require.js';
	loader.setAttributeNode(src);
	target.appendChild(loader);
})();

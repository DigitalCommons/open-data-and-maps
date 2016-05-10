// This module returns an object with a boolean property 'enabled' that is true iff debugging is on.

define([], function() {
	// Implementation: If we are running code that has not been build by r.js (e.g. from the source in directory 'www')
	// then the value of 'debug' is determined by the code below, IGNORING COMMENTS.
	// But if r.js has built the code (e.g. the source in directory 'www-built') then the special comments below
	// determine which code is executed.
	"use strict";
	var debug = false;
	// NB special comments //>> are interpretted by r.js.
	// See https://github.com/jrburke/r.js/blob/master/build/example.build.js for documentation.

	//>>includeStart("debugInclude", pragmas.debugInclude);
	// This code is executed if we are running code that has not been built by r.js (so //>>includeStart comment above is ignored).
	// This code is also executed if we are running code that has been build by r.js AND pragmas.debugInclude is true:
	// The value of pragmas.debugInclude is configured in ../../build.js.
	debug = true;
	//>>includeEnd("debugInclude")

	return {enabled: debug};
});


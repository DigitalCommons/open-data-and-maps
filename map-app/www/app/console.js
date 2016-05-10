define(["app/debug"], function(debugging) {
	"use strict";
	// This recipe for disabling console output was taken from
	// http://stackoverflow.com/a/1216743/685715
	if (!debugging.enabled){
		if (!window.console) {
			window.console = {};
		}
		var methods = ["log", "debug", "warn", "error", "info", "assert"];
		for(var i = 0; i < methods.length; i++){
			console[methods[i]] = function(){};	//eslint-disable-line no-loop-func
		}
	}
	// Should only output debug: true !
	console.log("debug: " + debugging.enabled);

});

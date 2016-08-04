define( ["model/userdata", "model/mouseStates", "app/eventbus"], function(userdata, mouseStates, eventbus) {
	"use strict";

	var eventPrefix = "PostCodeArea";

	var modelObjects = [];

	var PostCodeArea = function(area) {
		Object.defineProperties(this, {
			name: { value: area.name, enumerable: true}
		});
		// mouseStates defines some properties (currently, 1 property, "selected") for our modelObject:
		Object.defineProperties(this, mouseStates.objectProperties);
		//console.log(this);
		modelObjects.push(this);
		eventbus.publish({topic: eventPrefix + ".new", data: {modelObject: this}});
	};
	// define a userdata property for PostCodeArea if setUserData is called:
	PostCodeArea.prototype.setUserData = userdata.setUserData;
	PostCodeArea.prototype.getUserData = userdata.getUserData;

	// mouseStates will create functions for this module, which are configured
	// by parameters for use by this module:
	PostCodeArea.prototype.setSelected = mouseStates.setSelected(eventPrefix, modelObjects);
	PostCodeArea.prototype.clearSelections = mouseStates.clearSelections(modelObjects);
	PostCodeArea.prototype.setHovered = mouseStates.setHovered(eventPrefix);

	function getAll() {
		return modelObjects;
	}

	var pub = {
		PostCodeArea: PostCodeArea,
		getAll: getAll
	};
	return pub;
});


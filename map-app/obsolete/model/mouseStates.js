define( ["model/userdata", "app/eventbus"], function(userdata, eventbus) {
	"use strict";

	function objectProperties() {
		return { selected: { value: false, enumerable: true, writable: true }};
	}

	function setSelected(eventPrefix, modelObjects) {
		return function(isIt) {
			if (this.selected !== isIt) {
				if (isIt) {
					// This assumes at mose one object can be selected at a time:
					modelObjects.forEach(function(e) { e.setSelected(false); });
				}
				this.selected = isIt;
				eventbus.publish({
					topic: eventPrefix + ".stateChange",
					data: {
						modelObject: this,
						state: {selected: this.selected}
					}
				});
			}
		};
	}
	function setHovered(eventPrefix) {
		return function (isIt) {
			eventbus.publish({
				topic: eventPrefix + ".stateChange",
				data: {
					modelObject: this,
					state: {hovered: isIt, selected: this.selected}
				}
			});
		};
	}
	function clearSelections(modelObjects) {
		return function() {
			modelObjects.forEach(function(e) { e.setSelected(false); });
		};
	}


	var pub = {
		objectProperties: objectProperties,
		setSelected: setSelected,
		setHovered: setHovered,
		clearSelections: clearSelections
	};
	return pub;
});

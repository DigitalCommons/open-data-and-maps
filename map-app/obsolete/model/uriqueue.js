define( ["app/eventbus"], function(eventbus) {
	"use strict";

	// Manage a queue of URIs waiting to be fetched.
	// This is done in order to keep the UI alive while fetching thousands of the little buggers.

	function Queue(name) {
		this.queue = [];
		Object.defineProperties(this, {
			name: { value: name, enumberable: true},
			popEvent: { value: name + ".pop", enumberable: true},
		});
	}
	Queue.prototype.push = function(item) {
		console.log("Queue.push: " + item);
		this.queue.push(item);

		// temporarily, we pop as soon as we've pushed, without any queuing!
		this.pop();
	};
	Queue.prototype.pop = function() {
		var item = this.queue.pop();
		console.log("Queue.pop: " + item);
		eventbus.publish({topic: this.popEvent, data: {item: item}});
	};


	var pub = {
		Queue: Queue
	};
	return pub;
});

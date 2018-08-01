define(["app/eventbus", "model/config", "presenter"], function(eventbus, config, presenter) {
	"use strict";

	function Stack() {
		this.index = 0;
		this.storage = [];
	}
	Stack.prototype = {
		append: function(obj) {
		   this.storage[this.storage.length] = obj;
		   this.index = this.storage.length - 1;
		},
		current: function() {
			// returns undefined if the stack is empty
			return this.storage[this.index];
		},
		previous: function() {
			if (this.index > 0) {
				this.index--;
			}
			return this.current();
		},
		next: function() {
			if (this.index + 1 < this.storage.length - 1) {
				this.index++;
			}
			return this.current();
		},
		isAtStart: function() {
			return this.storage.length == 0 || this.index == 0;
		},
		isAtEnd: function() {
			return this.storage.length == 0 || this.index == this.storage.length - 1;
		}
	};

	// Set up the object from which all sidebar presenters are derived:
	function base(){}
	
	// All sidebar presenters are derived from the base presenter:
	var proto = Object.create(presenter.base.prototype);

	// Sidebars can manage a stack of content.
	// For example, a sidebar for Search Results may maintain a stack of search results,
	// allowing the possilility of going back/forward through previous/next search results.
	proto.contentStack = new Stack;

	proto.backButtonClicked = function() {
		console.log("backButtonClicked");
	};
	proto.forwardButtonClicked = function() {
		console.log("forwardButtonClicked");
	};

	proto.historyNavigation = function() {
		console.log("presenter/sidebar/base/historyNavigation");
		return {
			back: {
				enabled: !this.contentStack.isAtStart(),
				onClick: this.backButtonClicked
			},
			forward: {
				enabled: !this.contentStack.isAtEnd(),
				onClick: this.forwardButtonClicked
			}
		};
	};

	base.prototype = proto;

	var pub = {
		base: base
	};
	return pub;
});

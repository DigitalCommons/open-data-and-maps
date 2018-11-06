define(["app/eventbus", "model/config", "presenter/sidebar/base"], function(eventbus, config, sidebarPresenter) {
	"use strict";

	function Presenter(){}

	var proto = Object.create(sidebarPresenter.base.prototype);

	proto.getSoftwareVersion = function() {
		return {
			variant: config.getSoftwareVariant(),
			timestamp: config.getSoftwareTimestamp(),
			gitcommit: config.getSoftwareGitCommit()
		};
	};
	proto.aboutHtml = function() {
		return config.aboutHtml();
	};

	Presenter.prototype = proto;

	function createPresenter(view) {
		var p = new Presenter();
		p.registerView(view);
		return p;
	}
	var pub = {
		createPresenter: createPresenter
	};
	return pub;
});

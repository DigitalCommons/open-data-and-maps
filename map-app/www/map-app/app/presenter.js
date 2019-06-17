define([], function() {
  "use strict";

  // 'Base class' for all presenters:
  var base = function() {};
  base.prototype = {
    view: null,
    registerView: function(v) {
      this.view = v;
    }
  };
  var pub = {
    base: base
  };
  return pub;
});

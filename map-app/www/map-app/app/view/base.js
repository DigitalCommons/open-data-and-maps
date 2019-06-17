define(["d3"], function(d3) {
  "use strict";

  // 'Base class' for all views:
  // @todo use this base for the older view objects - they were created originally before this base existed.
  var base = function() {};
  base.prototype = {
    presenter: null,
    setPresenter: function(p) {
      this.presenter = p;
    }
  };
  base.prototype.d3selectAndClear = function(selector) {
    // adds a log for failed selectors
    // Clears the innerHtml, ready for re-populating using .append()
    var selection = d3.select(selector);
    if (selection.empty()) {
      console.log("Unexpectedly cannot find match for selector: " + selector);
    } else {
      selection.html("");
    }
    return selection;
  };
  base.prototype.htmlToOpenLinkInNewTab = function(url, text, options) {
    const title = (options && options.title) || "Click to open in a new tab";
    return (
      '<a title="' +
      title +
      '" href="' +
      url +
      '" rel="noopener noreferrer" target="_blank">' +
      text +
      "</a>"
    );
  };
  base.prototype.openInNewTabOrWindow = function(url) {
    // BTW - you can open links from vim with gx :-)
    // There's a discussion about this at https://stackoverflow.com/a/11384018/685715
    // TODO - do we need to check for popup-blockers?
    //        See https://stackoverflow.com/questions/2914/how-can-i-detect-if-a-browser-is-blocking-a-popup
    const win = window.open(url, "_blank");
    win.focus();
  };
  base.prototype.makeAccordionAtD3Selection = function(opts) {
    // See example: https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_accordion_sidebar
    const accordion = opts.selection
      .append("div")
      .attr("class", opts.headingClasses)
      .style("cursor", "pointer")
      .html(opts.heading + " " + '<i class="fa fa-caret-down"></i>');
    // The contentWrapper is a div around the content. It's where we control whether the content
    // is shown or hidden.
    const contentWrapper = opts.selection
      .append("div")
      .classed(opts.hideContent ? "w3-hide" : "w3-show", true);
    function setAccordionTitle(wrapper) {
      accordion.attr(
        "title",
        "Click to " +
          (wrapper.classed("w3-hide") ? "show" : "hide") +
          " " +
          opts.heading
      );
    }
    setAccordionTitle(contentWrapper);

    // Now put the content inside the contentWrapper:
    opts.makeContentAtD3Selection(contentWrapper);

    // Manipulate the visibility of the content via the contentWrapper, when the accorion is clicked:
    accordion.on("click", function(e) {
      //console.log("accordion clicked");
      //console.log(contentWrapper.attr('class'));
      if (contentWrapper.classed("w3-hide")) {
        contentWrapper.classed("w3-hide", false);
        contentWrapper.classed("w3-show", true);
      } else if (contentWrapper.classed("w3-show")) {
        contentWrapper.classed("w3-show", false);
        contentWrapper.classed("w3-hide", true);
      } else {
        console.log(
          "Unexpectedly found neither w3-hide nor w3-show classes in wrapper div for accordion contentWrapper"
        );
      }
      setAccordionTitle(contentWrapper);
    });
  };

  var pub = {
    base: base
  };
  return pub;
});

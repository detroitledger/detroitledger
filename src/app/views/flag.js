var fs = require("fs"),
  $ = require("jquery"),
  _ = require("lodash"),
  Backbone = require("backbone"),
  template = require("text-loader!../templates/flag.html");

/**
 * Render a "report problems" button that will, if olark is loaded,
 * open up the chat box, or if not, prompt user to just send an email.
 */

var PageView = Backbone.View.extend({
  el: "#flag",
  events: {
    "click .flag-toggle": "show",
  },
  template: template,

  initialize: function(options) {
    _.bindAll(this, "render", "show");
    this.render();
  },

  render: function() {
    this.$el.html(
      this.template({
        nid: this.nid,
      })
    );
  },

  show: function(event) {
    event.preventDefault();
    if (typeof olark === "function") {
      olark("api.box.expand");
    } else {
      $("#flag .panel-body").show();
    }
  },
});

module.exports = PageView;

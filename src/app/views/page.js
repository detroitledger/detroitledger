var fs = require("fs"),
  $ = require("jquery"),
  _ = require("lodash"),
  Backbone = require("backbone"),
  Pages = require("../models/pages"),
  template = require("text-loader!../templates/page.html"),
  title = require("text-loader!../templates/title.html");

var PageView = Backbone.View.extend({
  el: "#content",
  template: template,
  title: title,

  initialize: function(options) {
    console.log("Initialize page");
    _.bindAll(this, "render");

    // Get the organziations
    this.model = new Pages.Model({
      id: options.id,
    });
    this.model.fetch();
    this.model.on("change", this.render);
  },

  render: function() {
    console.log("Rendering page", this.model);
    $("#title").html(
      this.title({
        title: this.model.get("title"),
        options: {},
      })
    );

    $("title").text("The Detroit Ledger: " + this.model.get("title"));

    this.$el.html(
      this.template({
        page: this.model.toJSON(),
      })
    );
  },
});

module.exports = PageView;

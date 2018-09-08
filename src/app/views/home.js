var $ = require("jquery"),
  _ = require("lodash"),
  Backbone = require("backbone"),
  SearchView = require("./search"),
  Stats = require("../models/stats"),
  Organizaitons = require("../models/organizations"),
  template = require("text-loader!../templates/home.html"),
  list = require("text-loader!../templates/organizations/ol.html"),
  title = require("text-loader!../templates/title.html");

var HomeView = Backbone.View.extend({
  el: "#content",
  template: template,
  title: title,
  ol: list,

  initialize: function() {
    _.bindAll(this, "render", "showFunders", "showRecipients");

    this.model = new Stats.Model();
    this.model.fetch();
    this.model.on("change", this.render);
    this.render();
  },

  showFunders: function() {
    $("#funders").html(
      this.ol({
        organizations: this.funders.toJSON(),
        key: "org_grants_funded",
      })
    );
  },

  showRecipients: function() {
    $("#recipients").html(
      this.ol({
        organizations: this.recipients.toJSON(),
        key: "org_grants_received",
      })
    );
  },

  render: function() {
    this.$el.html(
      this.template({
        stats: this.model.toJSON(),
      })
    );

    $("#title").html(
      this.title({
        title: "The Detroit Ledger",
        options: {
          page: "home",
        },
      })
    );

    this.SearchView = new SearchView().render();

    this.funders = new Organizaitons.Collection();
    this.funders.comparator = undefined;
    this.funders.search({
      limit: 5,
      sort: {
        funded: "DESC",
      },
    });
    this.funders.on("reset", this.showFunders);
    this.recipients = new Organizaitons.Collection();
    this.recipients.comparator = undefined;
    this.recipients.search({
      limit: 5,
      sort: {
        received: "DESC",
      },
    });
    this.recipients.on("reset", this.showRecipients);
  },
});

module.exports = HomeView;

"use strict";

var $ = require("jquery"),
  _ = require("lodash"),
  Backbone = require("backbone"),
  GrantListView = require("./list"),
  template = require("text-loader!../../templates/grants/header.html"),
  filter_template = require("text-loader!../../templates/grants/filters.html");

var GrantContainerView = Backbone.View.extend({
  template: template,
  filterTemplate: filter_template,

  /**
   * Initialize the grant list
   * @param  {Object} options
   *                  options.direction: required. Specifies which grants to
   *                  list. Valid values: funded, recieved
   */
  initialize: function(options) {
    _.bindAll(this, "render", "setGrantTagsAndRenderFilters");

    this.direction = options.direction;

    this.collection.on("reset", this.render);
  },

  filters: {},
  rendered: false,

  getData: function() {
    return {
      name: $(this).attr("name"),
      value: $(this).val(),
    };
  },

  handleFilter: function() {
    var filter = this.$el.find(".org-search input").map(this.getData);
    _.each(
      filter,
      function(f) {
        this.filters[f.name] = f.value;
      }.bind(this)
    );
    this.filters["tag"] = this.$el.find("select.filterbytag").val();
    this.collection.filter(this.filters);
  },

  setUpFilter: function() {
    this.$el
      .find(".org-search input")
      .on("keyup", _.throttle(this.handleFilter.bind(this), 0));
    this.$el
      .find(".org-search select.filterbytag")
      .on("change", this.handleFilter.bind(this));
  },

  setGrantTagsAndRenderFilters: function(grant_tags) {
    // Only do it once.
    if (this.grant_tags) {
      return;
    }

    this.grant_tags = grant_tags;

    this.$filterContainer.html(
      this.filterTemplate({
        direction: this.direction,
        filters: this.filters,
        grant_tags: this.grant_tags,
      })
    );

    this.setUpFilter();
  },

  render: function() {
    // We only want to re-render this view once.
    if (this.rendered) {
      return;
    }

    this.$el.html(
      this.template({
        direction: this.direction,
      })
    );

    // Our filters are rendered when the grant tags are reported.
    this.$filterContainer = this.$el.find(".org-search th.filters");

    // Set up the actual list
    this.grantsFundedView = new GrantListView({
      $parent: this.$el.find("tbody"),
      collection: this.collection,
      direction: this.direction,
      reportGrantTags: this.setGrantTagsAndRenderFilters,
    }).render();

    this.rendered = true;
  },
});

module.exports = GrantContainerView;

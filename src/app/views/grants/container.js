'use strict';

var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    numeral = require('numeral'),
    Grants = require('../../models/grants'),
    GrantListView = require('./list'),
    template = require('../../templates/grants/header.html'),
    util = require('../../util');

var GrantDetailsView = Backbone.View.extend({

  template: template,

  /**
   * Initialize the grant list
   * @param  {Object} options
   *                  options.direction: required. Specifies which grants to
   *                  list. Valid values: funded, recieved
   */
  initialize: function(options) {
    _.bindAll(this, 'render', 'afterRender');

    this.direction = options.direction;

    // Get the organziations
    this.collection = new Grants.Collection({
      org: options.org,
      direction: options.direction,
      limit: options.limit
    });
    this.collection.on('reset', this.render);
  },

  filters: {},
  rendered: false,

  getData: function() {
    return {
      name: $(this).attr('name'),
      value: $(this).val()
    };
  },

  handleFilter: function() {
    var filter = this.$el.find('.org-search input').map(this.getData);
    _.each(filter, function(f) {
      this.filters[f.name] = f.value; 
    }.bind(this));
    this.collection.filter(this.filters);
  },

  setUpFilter: function() {
    this.$el.find('.org-search input').on('keyup', _.throttle(this.handleFilter.bind(this), 0));
  },

  afterRender: function() {
    this.setUpFilter();

    // Set up the actual list
    this.grantsFundedView = new GrantListView({
      $parent: this.$el.find('tbody'),
      collection: this.collection,
      direction: this.direction
    });

  },
  
  render: function() {
    // We only want to re-render this view once.
    if (this.rendered) {
      return;
    }

    this.$el.html(this.template({
      direction: this.direction,
      filters: this.filters
    }));

    this.rendered = true;

    this.afterRender();
  }
});

module.exports = GrantDetailsView;

'use strict';

var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  numeral = require('numeral'),
  template = require('../../templates/grants/list.html'),
  util = require('../../util');

var GrantListView = Backbone.View.extend({
  template: template,

  initialize: function(options) {
    _.bindAll(this, 'prep', 'render');

    this.direction = options.direction;
    this.$el = options.$parent || $(options.el);

    this.reportGrantTags = options.reportGrantTags || function() {};

    this.collection.on('reset', this.render);
  },

  preppedData: {},

  getData: function() {
    return {
      name: $(this).attr('name'),
      value: $(this).val(),
    };
  },

  prep: function() {
    return this.collection.prepForGrantList(this.direction);
  },

  render: function() {
    this.preppedData = this.prep();
    this.$el.html(
      this.template({
        organizations: this.preppedData.organizations,
      })
    );

    this.reportGrantTags(this.preppedData.grant_tags);

    return this;
  },
});

module.exports = GrantListView;

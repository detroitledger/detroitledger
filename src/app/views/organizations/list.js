var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    Organizations = require('../../models/organizations'),
    template = require('../../templates/organizations/list.html');

var OrganizationListView = Backbone.View.extend({

  el: '#content',
  template: template,

  initialize: function(options) {
    _.bindAll(this, 'render');
    this.collection.bind('reset', this.render);
  },

  render: function() {
    this.$el.html(this.template({
      organizations: this.collection.toJSON()
    }));
  }
});

module.exports = OrganizationListView;

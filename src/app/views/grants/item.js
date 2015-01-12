var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    Grants = require('../../models/grants'),
    GrantListView = require('./list'),
    template = require('../../templates/grants/item.html'),
    details = require('../../templates/grants/details.html');

var GrantView = Backbone.View.extend({

  el: '#content',
  template: template,
  details: details,

  initialize: function(options) {
    console.log("Initialize grant");
    _.bindAll(this, 'render', 'showRelated');

    // Get the organziations
    this.model = new Grants.Model({
      id: options.id
    });
    this.model.fetch();
    this.model.bind('change', this.render);
    this.model.bind('change', this.showRelated);
  },

  showRelated: function() {
    this.grantsReceivedView = new GrantListView({
      org: this.model.get('field_recipient').target_id,
      direction: 'received',
      el: '#grants-received',
      limit: 10
    });
    this.grantsFundedView = new GrantListView({
      org: this.model.get('field_funder').target_id,
      direction: 'funded',
      el: '#grants-funded',
      limit: 10
    });
  },

  render: function() {
    console.log(this.model.toJSON());

    $("#title").html(this.template({
      grant: this.model.toJSON()
    }));

    $('title').text('Grant from ' + this.model.get('field_funder').name + ' to ' + this.model.get('field_recipient').name);

    this.$el.html(this.details({
      grant: this.model.toJSON()
    }));
  }
});

module.exports = GrantView;

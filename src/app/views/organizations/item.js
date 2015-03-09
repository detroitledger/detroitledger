var $ = require('jquery'),
    _ = require('lodash'),
    Chartist = require('chartist'),
    Backbone = require('backbone'),
    Organizations = require('../../models/organizations'),
    GrantListView = require('../grants/list'),
    FlagView = require('../flag'),
    template = require('../../templates/organizations/item.html'),
    details = require('../../templates/organizations/details.html');

var OrganizationView = Backbone.View.extend({

  el: '#content',
  template: template,
  details: details,

  initialize: function(options) {
    console.log("Initialize organization");
    _.bindAll(this, 'render');

    // Get the organziations
    this.model = new Organizations.Model({
      id: options.id
    });
    this.model.fetch();
    this.model.on('change', this.render);

    this.$el.html(this.details());

    // Get all the grants
    this.grantsReceivedView = new GrantListView({
      org: options.id,
      direction: 'received',
      el: '#grants-received'
    });
    this.grantsFundedView = new GrantListView({
      org: options.id,
      direction: 'funded',
      el: '#grants-funded'
    });
  },

  render: function() {
    console.log("Rendering organization", this.model);

    $('title').text(this.model.get('title') + ' grant data' + ' - The Detroit Ledger');

    $("#title").html(this.template({
      o: this.model.toJSON()
    }));

    this.flagView = new FlagView({
      target_id: this.model.get('id')
    });
  }
});

module.exports = OrganizationView;

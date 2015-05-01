var $ = require('jquery'),
    _ = require('lodash'),
    Chartist = require('chartist'),
    Backbone = require('backbone'),
    Organizations = require('../../models/organizations'),
    GrantListView = require('../grants/list'),
    PeopleListView = require('../people/list'),
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

    this.options = options;

    // Get the organziations
    this.model = new Organizations.Model({
      id: options.id
    });
    this.model.fetch();
    this.model.on('change', this.render);


  },

  render: function() {
    console.log("Rendering organization", this.model.toJSON());

    $('title').text(this.model.get('title') + ' grant data' + ' - The Detroit Ledger');

    $("#title").html(this.template({
      o: this.model.toJSON()
    }));

    this.$el.html(this.details({
      o: this.model.toJSON()
    }));

    // Get all the grants
    this.grantsReceivedView = new GrantListView({
      org: this.options.id,
      direction: 'received',
      el: '#grants-received'
    });
    this.grantsFundedView = new GrantListView({
      org: this.options.id,
      direction: 'funded',
      el: '#grants-funded'
    });

    // Get related people
    this.peopleView = new PeopleListView({
      org: this.options.id,
      el: '#people'
    });

    this.flagView = new FlagView({
      target_id: this.model.get('id')
    });
  }
});

module.exports = OrganizationView;

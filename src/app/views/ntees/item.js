var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    Ntees = require('../../models/ntees'),
    Organizations = require('../../models/organizations'),
    OrganizationListView = require('../organizations/list'),
    FlagView = require('../flag'),
    template = require('../../templates/ntees/item.html'),
    details = require('../../templates/ntees/details.html');

var NteeView = Backbone.View.extend({

  el: '#content',
  template: template,
  details: details,

  initialize: function(options) {
    _.bindAll(this, 'render', 'showRelated');

    // Get the organziations
    this.model = new Ntees.Model({
      id: options.id
    });
    this.model.fetch();
    this.model.bind('change', this.render);
    this.model.bind('change', this.showRelated);
  },

  showRelated: function() {
  },

  render: function() {
    console.log(this.model.toJSON());

    $("#title").html(this.template({
      ntee: this.model.toJSON()
    }));

    $('title').text(this.model.get('name') + ' grant data' + ' - The Detroit Ledger');

    $("#content").html(this.details({}));

    var organizations = new Organizations.Collection({ orgs: this.model.get('orgs')}, {
      parse: true
    });
    this.listView = new OrganizationListView({
      el: "#ntee-organizations",
      collection: organizations
    }).render();

    this.flagView = new FlagView({
      target_id: 'ntee-' + this.model.get('id')
    });
  }
});

module.exports = NteeView;

'use strict';

var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    Grants = require('../../models/grants'),
    GrantListView = require('./list'),
    FlagView = require('../flag'),
    template = require('../../templates/grants/item.html'),
    details = require('../../templates/grants/details.html');

var GrantView = Backbone.View.extend({

  el: '#content',
  template: template,
  details: details,

  initialize: function(options) {
    console.log('Initialize grant');
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
    var relatedReceived = new Grants.Collection({    
      org: this.model.get('field_recipient').target_id,    
      direction: 'received',   
      limit: 10    
    });
    var relatedFunded = new Grants.Collection({    
      org: this.model.get('field_funder').target_id,    
      direction: 'funded',   
      limit: 10    
    });

    this.grantsReceivedView = new GrantListView({
      collection: relatedReceived,
      el: '#grants-received',
      direction: 'received'
    });
    this.grantsFundedView = new GrantListView({
      collection: relatedFunded,
      el: '#grants-funded',
      direction: 'funded'
    });
  },

  render: function() {
    console.log(this.model.toJSON());

    $('#title').html(this.template({
      grant: this.model.toJSON()
    }));

    $('title').text('Grant from ' + this.model.get('field_funder').name + ' to ' + this.model.get('field_recipient').name + ' - The Detroit Ledger');

    this.$el.html(this.details({
      grant: this.model.toJSON()
    }));

    this.flagView = new FlagView({
      target_id: this.model.get('id')
    });
  }
});

module.exports = GrantView;

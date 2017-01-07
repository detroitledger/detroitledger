'use strict';

var $ = require('jquery'),
    _ = require('lodash'),
    Chartist = require('chartist'),
    Backbone = require('backbone'),
    News = require('../../models/news'),
    Finances = require('../../models/finances'),
    Grants = require('../../models/grants'),
    Organizations = require('../../models/organizations'),
    FinancesListView = require('../finances/list'),
    GrantContainerView = require('../grants/container'),
    NewsListView = require('../news/list'),
    PeopleListView = require('../people/list'),
    FlagView = require('../flag'),
    template = require('../../templates/organizations/item.html'),
    details = require('../../templates/organizations/details.html');

var OrganizationView = Backbone.View.extend({

  el: '#content',
  template: template,
  details: details,

  initialize: function(options) {
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
    console.log('Rendering organization', this.model.toJSON());

    $('title').text(this.model.get('title') + ' grant data' + ' - The Detroit Ledger');

    $('#title').html(this.template({
      o: this.model.toJSON()
    }));

    this.$el.html(this.details({
      o: this.model.toJSON()
    }));

    // Get all the grants
    var grantsReceived = new Grants.Collection({
      org: this.options.id,
      direction: 'received'
    });
    var grantsFunded = new Grants.Collection({
      org: this.options.id,
      direction: 'funded'
    });

    this.grantsReceivedView = new GrantContainerView({
      collection: grantsReceived,
      direction: 'received',
      el: '#grants-received'
    });
    this.grantsFundedView = new GrantContainerView({
      collection: grantsFunded,
      direction: 'funded',
      el: '#grants-funded'
    });

    // Get related news
    if (this.model.has('news')) {
      var news = new News.Collection(this.model.get('news'), {
        parse: true
      });
      this.newsView = new NewsListView({
        collection: news,
        el: '#news'
      });
    } 

    // Get related finances
    if (this.model.has('field_ein')) {
      var finances = new Finances.Collection({
        ein: this.model.get('field_ein')
      });
      this.financesView = new FinancesListView({
        collection: finances,
        el: '#finances'
      });
    }

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

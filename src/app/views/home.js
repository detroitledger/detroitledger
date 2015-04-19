var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    SearchView = require('./search'),
    Stats = require('../models/stats'),
    Organizaitons = require('../models/organizations'),
    template = require('../templates/home.html'),
    title = require('../templates/title.html');

var HomeView = Backbone.View.extend({

  el: '#content',
  template: template,
  title: title,

  initialize: function() {
    _.bindAll(this, 'render');

    this.model = new Stats.Model();
    this.model.fetch();
    this.model.on('change', this.render);

    this.model.set({'title': 'The Detroit Ledger'});

    this.funders = new Organizaitons.Collection();
    this.funders.search({
      limit: 5,
      sort: {
        'org_grants_funded': 'DES'
      }
    });
    this.funders.fetch();


    this.render();
  },

  render: function() {
    this.$el.html(this.template({
      stats: this.model.toJSON()
    }));

    $('title').text(this.model.get('title') + ' - information about grants and nonprofits in Detroit');

    // $('#title').html(this.title({
    //   title: this.model.get('title'),
    //   options: {
    //     subtitle: 'A comprehensive dataset of grants made in Detroit',
    //     page: 'home'
    //   }
    // }));

    this.SearchView = new SearchView().render();
  }
});

module.exports = HomeView;

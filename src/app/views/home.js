var fs = require('fs'),
    $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    SearchView = require('./search'),
    Stats = require('../models/stats'),
    template = require('../templates/home.html'),
    title = require('../templates/title.html');

var HomeView = Backbone.View.extend({

  el: '#content',
  template: template,
  title: title,

  events: {
    'click #network': 'showNetwork'
  },

  initialize: function(options) {
    console.log("Initialize homepage");
    _.bindAll(this, 'render', 'showNetwork');

    this.model = new Stats.Model();
    this.model.fetch();
    this.model.on('change', this.render);

    this.model.set({'title': 'The Detroit Ledger'});

    this.render();
  },

  render: function() {
    console.log("Rendering the homepage view");
    this.$el.html(this.template({
      stats: this.model.toJSON()
    }));

    $('title').text(this.model.get('title'));

    $("#title").html(this.title({
      title: this.model.get('title'),
      options: {
        subtitle: 'A comprehensive dataset of grants made in Detroit',
        page: 'home'
      }
    }));

    this.SearchView = new SearchView().render();
  },

  showNetwork: function(event) {
    console.log(event);
    $('#network').animate({height:'1670px', cursor:'auto'});
  }
});

module.exports = HomeView;

var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    Organizations = require('../models/organizations'),
    OrganizationListView = require('./organizations/list'),
    template = fs.readFileSync('../templates/search.html');

var SearchView = Backbone.View.extend({

  el: '#search-container',
  template: _.template(template),

  events: {
    'keyup .search': 'search',
    'click input': 'search'
  },

  initialize: function(options) {
    console.log("Initialize organization list");
    _.bindAll(this, 'render', 'search', 'error');

    this.render();
  },

  render: function() {
    console.log("Rendering the search view");
    this.$el.html(this.template({}));

    this.organizations = new Organizations.Collection();
    this.organizations.on('error', function(error){
      // TODO:
      // This should work, but doesn't.
      console.log("Hey! What's wrong?", error);
    });

    this.listView = new OrganizationListView({
      el: "#results",
      collection: this.organizations
    });
  },

  error: function(error) {
    console.log(error);
  },

  search: function(event) {
    event.preventDefault();
    var val = $(event.target).val();
    window.ga('send', 'event', 'data', 'search', val);
    this.organizations.search({
      title: val
    });
  }
});

module.exports = SearchView;

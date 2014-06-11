/*jslint nomen: true */
/*globals define: true */

define([
  // Libraries
  'jquery',
  'lodash',
  'backbone',

  // Project files:
  // Models
  'models/organizations',

  // Views
  'views/organizations/list',

  // Templates
  'text!templates/search.html'
], function($, _, Backbone, Organizations, OrganizationListView, template){

  var SearchView = Backbone.View.extend({

    el: '#search-container',
    template: _.template(template),

    events: {
      'keyup .search': 'search'
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
      var val = $(event.target).val();
      window.ga('send', 'event', 'data', 'search', val);
      this.organizations.search({
        title: val
      });
    }
  });

  return SearchView;
});

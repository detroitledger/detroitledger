/*jslint nomen: true */
/*globals define: true */

define([
  // Libraries
  'jquery',
  'lodash',
  'backbone',

  // Project files
  // Models
  'models/organizations',

  // Templates
  'text!templates/organizations/list.html'

], function($, _, Backbone, Organizations, template){

  var OrganizationListView = Backbone.View.extend({

    el: '#content',
    template: _.template(template),

    initialize: function(options) {
      console.log("Initialize organization list view", options);
      _.bindAll(this, 'render');
      this.collection.bind('reset', this.render);
    },

    render: function() {
      console.log("Rendering these organizations: ", this.collection);
      this.$el.html(this.template({
        organizations: this.collection.toJSON()
      }));
    }
  });

  return OrganizationListView;
});

/*jslint nomen: true */
/*globals define: true */

define([
  // Libraries
  'jquery',
  'lodash',
  'backbone',

  // Project files
  // Models
  'models/grants',

  // Views
  'views/grants/list',

  // Templates
  'text!templates/grants/item.html',
  'text!templates/grants/details.html'
], function($, _, Backbone, Grants, GrantListView, template, details){

  var GrantView = Backbone.View.extend({

    el: '#content',
    template: _.template(template),
    details: _.template(details),

    initialize: function(options) {
      console.log("Initialize grant");
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
      this.grantsReceivedView = new GrantListView({
        org: this.model.get('field_recipient').target_id,
        direction: 'received',
        el: '#grants-received',
        limit: 10
      });
      this.grantsFundedView = new GrantListView({
        org: this.model.get('field_funder').target_id,
        direction: 'funded',
        el: '#grants-funded',
        limit: 10
      });
    },

    render: function() {
      console.log(this.model.toJSON());

      $("#title").html(this.template({
        grant: this.model.toJSON()
      }));

      this.$el.html(this.details({
        grant: this.model.toJSON()
      }));
    }
  });

  return GrantView;
});

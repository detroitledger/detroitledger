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
  'views/grants/list',
  'views/flag',

  // Templates
  'text!templates/organizations/item.html',
  'text!templates/organizations/details.html'

], function($, _,
            Backbone,
            Organizations,
            GrantListView,
            FlagView,
            template,
            details
) {

  var OrganizationView = Backbone.View.extend({

    el: '#content',
    template: _.template(template),
    details: _.template(details),

    initialize: function(options) {
      console.log("Initialize organization");
      _.bindAll(this, 'render');

      // Get the organziations
      this.model = new Organizations.Model({
        id: options.id
      });
      this.model.fetch();
      this.model.on('change', this.render);

      this.$el.html(this.details());

      // Get all the grants
      this.grantsReceivedView = new GrantListView({
        org: options.id,
        direction: 'received',
        el: '#grants-received'
      });
      this.grantsFundedView = new GrantListView({
        org: options.id,
        direction: 'funded',
        el: '#grants-funded'
      });
    },

    render: function() {
      console.log("Rendering organization", this.model);
      $("#title").html(this.template({
        o: this.model.toJSON()
      }));

      this.flagView = new FlagView({
        target_id: this.model.get('id')
      });
    }
  });

  return OrganizationView;
});

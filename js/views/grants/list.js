/*jslint nomen: true */
/*globals define: true */

define([
  // Libraries
  'jquery',
  'lodash',
  'backbone',
  'numeral',

  // Project files:
  // Models
  'models/grants',

  // Templates
  'text!templates/grants/list.html'
], function($, _, Backbone, numeral, Grants, template){

  var GrantListView = Backbone.View.extend({

    template: _.template(template),

    /**
     * Initialize the grant list
     * @param  {Object} options
     *                  options.direction: required. Specifies which grants to
     *                  list. Valid values: funded, recieved
     */
    initialize: function(options) {
      _.bindAll(this, 'prep', 'group', 'render');

      this.direction = options.direction;

      // Get the organziations
      this.grants = new Grants.Collection({
        org: options.org,
        direction: options.direction,
        limit: options.limit
      });
      this.grants.on('reset', this.render);
    },

    group: function(grant) {
      if(this.direction === 'received') {
         return grant.field_funder.name;
      }
      return grant.field_recipient.name;
    },

    // Group each of the grants by granter or grantee
    prep: function() {
      var grantsJSON = this.grants.toJSON();
      var byOrganization = _.groupBy(grantsJSON, this.group);

      // Add counts etc.
      var readyData = [];
      _.each(byOrganization, function(grants, organziation) {
        var sum = _.reduce(grants, function(memo, grant) {
          return memo + grant.field_funded_amount;
        }, 0);

        readyData.push({
          sum: sum,
          prettySum: numeral(sum).format('0,0[.]00'),
          name: organziation,
          grants: grants
        });
      });

      readyData = _.sortBy(readyData, function(organization) {
        return organization.sum;
      }).reverse();
      console.log("Ready", readyData);
      return readyData;
    },

    render: function() {
      this.$el.html(this.template({
        organizations: this.prep(),
        direction: this.direction
      }));
    }
  });

  return GrantListView;
});

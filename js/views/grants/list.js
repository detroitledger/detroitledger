/*jslint nomen: true */
/*globals define: true */

define([
  // Libraries
  'jquery',
  'lodash',
  'backbone',

  // Project files:
  // Models
  'models/grants',

  // Templates
  'text!templates/grants/list.html'
], function($, _, Backbone, Grants, template){

  var GrantListView = Backbone.View.extend({

    template: _.template(template),

    /**
     * Initialize the grant list
     * @param  {Object} options
     *                  options.direction: required. Specifies which grants to
     *                  list. Valid values: funded, recieved
     */
    initialize: function(options) {
      _.bindAll(this, 'render');

      this.direction = options.direction;

      // Get the organziations
      this.grants = new Grants.Collection({
        org: options.org,
        direction: options.direction,
        limit: options.limit
      });
      this.grants.on('reset', this.render);
    },

    render: function() {
      console.log("Rendering these grants: ", this.grants);

      this.$el.html(this.template({
        grants: this.grants.toJSON(),
        direction: this.direction
      }));
    }
  });

  return GrantListView;
});

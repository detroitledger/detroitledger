/*jslint nomen: true */
/*globals define: true */

define([
  // Libraries
  'jquery',
  'lodash',
  'backbone',

  // Project files:
  // Models
  'models/pages',

  // Templates
  'text!templates/page.html',
  'text!templates/title.html'

], function($, _, Backbone, Pages, template, title){

  var PageView = Backbone.View.extend({

    el: '#content',
    template: _.template(template),
    title: _.template(title),

    initialize: function(options) {
      console.log("Initialize page");
      _.bindAll(this, 'render');

      // Get the organziations
      this.model = new Pages.Model({
        id: options.id
      });
      this.model.fetch();
      this.model.on('change', this.render);
    },

    render: function() {
      console.log("Rendering page", this.model);
      $("#title").html(this.title({
        title: this.model.get('title'),
        options: {}
      }));
      this.$el.html(this.template({
        page: this.model.toJSON()
      }));
    }
  });

  return PageView;
});

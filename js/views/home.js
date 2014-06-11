/*jslint nomen: true */
/*globals define: true */

define([
  // Libraries
  'jquery',
  'lodash',
  'backbone',

  // Project files:
  // Views
  'views/search',

  // Models
  'models/stats',

  // Templates
  'text!templates/home.html',
  'text!templates/title.html'
], function($, _, Backbone, SearchView, Stats, template, title){

  var HomeView = Backbone.View.extend({

    el: '#content',
    template: _.template(template),
    title: _.template(title),

    events: {
      'click #network': 'showNetwork'
    },

    initialize: function(options) {
      console.log("Initialize homepage");
      _.bindAll(this, 'render', 'showNetwork');

      this.model = new Stats.Model();
      this.model.fetch();
      this.model.on('change', this.render);

      this.render();
    },

    render: function() {
      console.log("Rendering the homepage view");
      this.$el.html(this.template({
        stats: this.model.toJSON()
      }));

      $("#title").html(this.title({
        title: 'The Detroit Ledger',
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

  return HomeView;
});

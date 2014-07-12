/*jslint nomen: true */
/*globals define: true */

define([
  // Libraries
  'jquery',
  'lodash',
  'backbone',

  // Project files:
  // Models
  'models/flags',

  // Templates
  'text!templates/flag.html'
], function($, _, Backbone, Flags, template){

  var PageView = Backbone.View.extend({
    el: '#flag',
    events: {
      'click .flag-toggle': 'show',
      'click .submit': 'submit'
    },
    template: _.template(template),

    initialize: function(options) {
      console.log("Initialize flag");
      _.bindAll(this, 'render', 'show', 'submit');

      this.flag = new Flags.Model({
        target_id: options.target_id
      });
      this.render();
    },

    render: function() {
      console.log("Rendering flag", this.model);
      this.$el.html(this.template({
        nid: this.nid
      }));
    },

    handle: function(resp) {
      console.log("Ugh, failed", resp);
    },

    submit: function(event) {
      console.log('Submitting', event);
      event.preventDefault();
      var text = $('#flag textarea').val();
      console.log(text);
      this.flag.set('note', text);
      this.flag.save();

      this.flag.on('error', this.handle);
      this.flag.on('sync', this.handle);
    },

    show: function(event) {
      console.log('Showing flag', event);
      event.preventDefault();
      $('#flag .panel-body').show();
    }
  });

  return PageView;
});

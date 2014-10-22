var fs = require('fs'),
    $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    Flags = require('../models/flags'),
    template = require('../templates/flag.html');


  var PageView = Backbone.View.extend({
    el: '#flag',
    events: {
      'click .flag-toggle': 'show',
      'click .submit': 'submit'
    },
    template: template,

    initialize: function(options) {
      console.log("Initialize flag");
      _.bindAll(this, 'render', 'show', 'submit', 'error', 'success');

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

    error: function(error) {
      console.log("Unable to save response", error);
      this.$el.find('.error').fadeIn(400);
    },

    success: function(response) {
      console.log("Hey, it worked!", response);
      this.$el.find('.thanks').fadeIn(400);
    },

    submit: function(event) {
      console.log('Submitting', event);
      event.preventDefault();
      var text = $('#flag textarea').val();
      console.log(text);
      this.flag.set('note', text);
      this.flag.save();

      this.flag.on('error', this.error);
      this.flag.on('sync', this.success);
    },

    show: function(event) {
      console.log('Showing flag', event);
      event.preventDefault();
      $('#flag .panel-body').show();
    }
  });

module.exports = PageView;

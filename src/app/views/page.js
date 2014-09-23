var fs = require('fs'),
    $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    Pages = require('../models/pages'),
    template = fs.readFileSync('../templates/page.html'),
    title = fs.readFileSync('../templates/title.html');

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

module.exports = PageView;

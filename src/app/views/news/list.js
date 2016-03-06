var $ = require('jquery'),
    _ = require('lodash'),
    Chartist = require('chartist'),
    Backbone = require('backbone'),
    numeral = require('numeral'),
    News = require('../../models/news'),
    template = require('../../templates/news/list.html');

var NewsListView = Backbone.View.extend({

  template: template,

  /**
   * Initialize the news list
   * @param  {Object} options
   */
  initialize: function(options) {
    _.bindAll(this, 'render');
    this.render();
  },

  render: function() {
    if (this.collection.length > 0) {
      this.$el.html(this.template({
        news: this.collection.toJSON()
      }));
    }

    return this;
  }
});

module.exports = NewsListView;

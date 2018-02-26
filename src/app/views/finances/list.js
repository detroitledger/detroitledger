var $ = require('jquery'),
  _ = require('lodash'),
  Chartist = require('chartist'),
  Backbone = require('backbone'),
  numeral = require('numeral'),
  Finances = require('../../models/finances'),
  template = require('../../templates/finances/list.html');

var FinancesListView = Backbone.View.extend({
  template: template,

  /**
   * Initialize the news list
   * @param  {Object} options
   */
  initialize: function(options) {
    _.bindAll(this, 'render');
    this.collection.bind('reset', this.render);
  },

  render: function() {
    if (this.collection.length > 0) {
      this.$el.html(
        this.template({
          finances: this.collection.toJSON(),
        })
      );
    }

    return this;
  },
});

module.exports = FinancesListView;

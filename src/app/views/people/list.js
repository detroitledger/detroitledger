var $ = require('jquery'),
    _ = require('lodash'),
    Chartist = require('chartist'),
    Backbone = require('backbone'),
    numeral = require('numeral'),
    People = require('../../models/people'),
    template = require('../../templates/people/list.html');

var PeopleListView = Backbone.View.extend({

  template: template,

  /**
   * Initialize the people list
   * @param  {Object} options
   */
  initialize: function(options) {
    _.bindAll(this, 'render');

    // Get the organziations
    this.people = new People.Collection({
      org: options.org
    });
    this.people.on('reset', this.render);
  },

  render: function() {
    this.$el.html(this.template({
      people: this.people.toJSON()
    }));

    return this;
  }
});

module.exports = PeopleListView;

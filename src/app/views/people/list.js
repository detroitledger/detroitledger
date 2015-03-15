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
   * Initialize the grant list
   * @param  {Object} options
   *                  options.direction: required. Specifies which grants to
   *                  list. Valid values: funded, recieved
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
    console.log("Rendering people", this.people.toJSON());
    this.$el.html(this.template({
      people: this.people.toJSON()
    }));

    return this;
  }
});

module.exports = PeopleListView;

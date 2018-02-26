var $ = require('jquery'),
  Backbone = require('backbone'),
  _ = require('lodash'),
  numeral = require('numeral'),
  moment = require('moment'),
  settings = require('../settings');

var People = {};

People.Model = Backbone.Model.extend({
  parse: function(data) {
    // Format start and end dates
    // "Sun, 01 Jan 2012 05:00:00 -0500"
    // "ddd, DD MMM YYYY HH:mm:ss ZZ"
    if (data && data.term_start) {
      data.start_date = moment(data.term_start, 'YYYY-MM-DD HH:mm:ss').format(
        'MMM YYYY'
      );
    }
    if (data && data.term_end) {
      data.end_date = moment(data.term_end, 'YYYY-MM-DD HH:mm:ss').format(
        'MMM YYYY'
      );
    }
    return data;
  },
});

People.Collection = Backbone.Collection.extend({
  model: People.Model,

  initialize: function(options) {
    _.bindAll(this, 'parse', 'url', 'toJSON');
    this.org = options.org;
    this.fetch({ reset: true });
  },

  url: function() {
    var url =
      settings.api.baseurl +
      '/orgs/' +
      this.org +
      '/board_members.jsonp?callback=?';
    return url;
  },

  parse: function(response) {
    return response.board_members;
  },
});

module.exports = People;

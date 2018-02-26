var $ = require('jquery'),
  Backbone = require('backbone'),
  _ = require('lodash'),
  numeral = require('numeral'),
  moment = require('moment'),
  settings = require('../settings');

var News = {};

News.Model = Backbone.Model.extend({
  parse: function(data) {
    // Format dates
    // "Sun, 01 Jan 2012 05:00:00 -0500"
    // "ddd, DD MMM YYYY HH:mm:ss ZZ"
    if (data && data.field_news_date) {
      data.date = moment(data.field_news_date, settings.api.dateFormat).format(
        'MMM D, YYYY'
      );
    }

    return data;
  },
});

News.Collection = Backbone.Collection.extend({
  model: News.Model,
});

module.exports = News;

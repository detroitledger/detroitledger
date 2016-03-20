var $ = require('jquery'),
    Backbone = require('backbone'),
    _ = require('lodash'),
    numeral = require('numeral'),
    moment = require('moment'),
    settings = require('../settings'),
    util = require('../util');

var Ntee = {};

Ntee.Model = Backbone.Model.extend({
  url: function() {
    return settings.api.baseurl + '/ntees/' + this.id + '.jsonp/?callback=?';
  },


  parse: function(response) {
    var data = response.data;
    data.orgs = response.included;

    // Format dates
    // "Sun, 01 Jan 2012 05:00:00 -0500"
    // "ddd, DD MMM YYYY HH:mm:ss ZZ"
    // if (data && data.field_news_date) {
    //   data.date = moment(data.field_news_date, settings.api.dateFormat).format("MMM D, YYYY");
    // }

    // Format dollar amounts nicely
    data.totals.received_pretty = numeral(data.totals.received).format('0,0[.]00');
    data.totals.funded_pretty = numeral(data.totals.funded).format('0,0[.]00');

    data.slug = util.slugify(data.name);

    return data;
  }
});

Ntee.Collection = Backbone.Collection.extend({
  model: Ntee.Model
});

module.exports = Ntee;

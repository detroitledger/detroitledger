var $ = require('jquery'),
    Backbone = require('backbone'),
    _ = require('lodash'),
    numeral = require('numeral'),
    moment = require('moment'),
    settings = require('../settings');

var Grants = {};

Grants.Model = Backbone.Model.extend({

  url: function() {
    return settings.api.baseurl + '/grants/' + this.id + '.jsonp/?callback=?';
  },

  parse: function(data) {
    // Format dollar amounts nicely
    if (data && data.field_funded_amount) {
      data.amount = numeral(data.field_funded_amount).format('0,0[.]00');
    }

    // Format start and end dates
    // "Sun, 01 Jan 2012 05:00:00 -0500"
    // "ddd, DD MMM YYYY HH:mm:ss ZZ"
    if (data && data.field_start_date) {
      data.start_date = moment(data.field_start_date, settings.api.dateFormat).format("YYYY");
    }
    if (data && data.field_end_date) {
      data.end_date = moment(data.field_end_date, settings.api.dateFormat).format("YYYY");
    }

    data.created = moment.unix(data.created).format("YYYY");
    data.changed = moment.unix(data.changed).format("MMMM D YYYY");

    return data;
  }
});

Grants.Collection = Backbone.Collection.extend({
  model: Grants.Model,

  comparator: function(model) {
    return -model.get("start_date");
  },

  initialize: function(options) {
    _.bindAll(this, 'parse', 'url', 'toJSON');
    this.org = options.org;
    this.direction = options.direction;
    this.limit = options.limit ? options.limit : 10000;
    this.fetch({reset: true});
  },

  url: function() {
    var url = settings.api.baseurl + '/orgs/' + this.org + '/';
    if(this.direction === 'funded') {
      url += "grants_funded.jsonp/?";
    }
    else if (this.direction === 'received') {
      url += "grants_received.jsonp/?";
    }

    var opts = {
      limit: this.limit
    };

    url += $.param(opts);
    url += '&callback=?';
    return url;
  },

  parse: function(response) {
    return _.values(response)[0];
  }
});

module.exports = Grants;

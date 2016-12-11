var $ = require('jquery'),
    Backbone = require('backbone'),
    _ = require('lodash'),
    numeral = require('numeral'),
    moment = require('moment'),
    settings = require('../settings');

var months = [
  '',
  'Jan.',
  'Feb.',
  'March',
  'April',
  'May',
  'June',
  'July',
  'Aug.',
  'Sep.',
  'Oct.',
  'Nov.',
  'Dec.'  
];

var GroupFinances = {};

GroupFinances.Model = Backbone.Model.extend({

  // url: function() {
  //   return settings.api.baseurl + '/grants/' + this.id + '.jsonp/?callback=?';
  // },

  parseBMF: function(data) {
    data.total_assets_text = numeral(data.total_assets).format('0,0[.]00');
    data.total_expenses_text = numeral(data.total_expenses).format('0,0[.]00');
    data.total_revenue_text = numeral(data.total_revenue).format('0,0[.]00');
    data.total_liabilities_text = numeral(data.total_liabilities).format('0,0[.]00');

    if (data.grants_paid) {
      data.grants_paid_text = numeral(data.grants_paid).format('0,0[.]00');
    }

    data.year = Number(data.tax_period.substring(0, 4));
    data.month = Number(data.tax_period.substring(4));
    data.monthText = months[data.month];
    return data;
  },

  parse: function(org) {
    var i;
    for (i = 0; i < org.data.length; i++) {
      org.data[i] = this.parseBMF(org.data[i]);
    }

    return org;
  }
});

GroupFinances.Collection = Backbone.Collection.extend({
  model: GroupFinances.Model,

  initialize: function(options) {
    _.bindAll(this, 'parse', 'url', 'toJSON');
    console.log("Init group finances", options);
    this.eins = options.eins;
    this.fetch({
      reset: true
    });
  },

  url: function() {
    return settings.api.financeAPI + '/orgs?eins=' + this.eins.join(',');
  }

  // parse: function(response) {
  //   if (response.combined) {
  //     return response.combined;
  //   }
  //   return [];
  // }
});

module.exports = GroupFinances;

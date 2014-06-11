/*jslint nomen: true */
/*globals define: true */

define([
  // Libraries
  'jquery',
  'lodash',
  'backbone',
  'numeral',

  // Project files
  'settings'
],

function($, _, Backbone, numeral, settings) {
  'use strict';

  var Stats = {};

  Stats.Model = Backbone.Model.extend({
    url: function() {
      return settings.api.baseurl + '/stats.jsonp&callback=?';
    },

    parse: function(data) {
      console.log(data);
      data.num_grants = numeral(data.total_num_grants).format('0,0[.]00');
      data.num_orgs = numeral(data.total_num_orgs).format('0,0[.]00');
      data.dollars = numeral(data.total_grants_dollars).format('0,0[.]00');
      return data;
    }
  });

  return Stats;
});



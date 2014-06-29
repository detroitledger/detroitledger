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

  var Flags = {};

  Flags.Model = Backbone.Model.extend({
    url: function() {
      return settings.api.baseurl + '/flags/' + this.get('target_id') + '.jsonp?callback=';
    },

    parse: function(data) {
      console.log(data);
      return data;
    }
  });

  return Flags;
});



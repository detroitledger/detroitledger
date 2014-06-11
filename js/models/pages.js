/*jslint nomen: true */
/*globals define: true */

define([
  // Libraries
  'jquery',
  'lodash',
  'backbone',

  // Project files
  'settings'
],

function($, _, Backbone, settings) {
  'use strict';

  var Pages = {};

  Pages.Model = Backbone.Model.extend({
    url: function() {
      return settings.api.baseurl + '/pages.jsonp/?filters[path]=/' + this.id + '&callback=?';
    },

    parse: function(data){
      return data.pages[0];
    }
  });

  return Pages;
});



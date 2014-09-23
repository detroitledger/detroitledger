var Backbone = require('backbone'),
    _ = require('lodash'),
    settings = require('../settings');

var Pages = {};

Pages.Model = Backbone.Model.extend({
  url: function() {
    return settings.api.baseurl + '/pages.jsonp/?filters[path]=/' + this.id + '&callback=?';
  },

  parse: function(data){
    return data.pages[0];
  }
});

module.exports = Pages;

var Backbone = require('backbone'),
    numeral = require('numeral'),
    settings = require('../settings');

var Flags = {};

Flags.Model = Backbone.Model.extend({
  url: function() {
    return settings.api.baseurl + '/flags';
  },

  parse: function(data) {
    console.log(data);
    return data;
  }
});

module.exports = Flags;

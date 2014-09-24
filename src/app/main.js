/*jslint nomen: true */

var $ = require('jquery-browserify'),
    app = require('./app');

$(document).ready(function () {
  app.initialize();
});

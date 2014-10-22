/*jslint nomen: true */

var $ = require('jquery'),
    twbs = require('bootstrap'), // init bootstrap - this is dumb to do this way
    app = require('./app');

$(document).ready(function () {
  app.initialize();
});

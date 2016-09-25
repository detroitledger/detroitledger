/*jslint nomen: true */

var $ = require('jquery'),
    dotdotdot = require('dotdotdot'),
    twbs = require('bootstrap'), // init bootstrap - this is dumb to do this way
    chartist = require('chartist'),
    app = require('./app');

$(document).ready(function () {
  app.initialize();
});

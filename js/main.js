/*jslint nomen: true */
/*globals require: true */

require.config({
  paths: {
    backbone: 'lib/backbone',
    jquery: 'lib/jquery-1.10.0',
    "jquery.bootstrap": "lib/bootstrap.min",
    lodash: 'lib/lodash',
    moment: 'lib/moment.min',
    numeral: 'lib/numeral.min',
    text: 'lib/text',
    chartist: 'lib/chartist.min'
  },

  shim: {
    lodash: {
      exports: '_'
    },

    backbone: {
      deps: ['lodash', 'jquery'],
      exports: 'Backbone'
    },

    "jquery.bootstrap": {
        deps: ["jquery"]
    },

    chartist: {
      exports: 'chartist'
    }
  }
});

require(['jquery', 'lodash', 'backbone', 'app', 'jquery.bootstrap'], function ($, _, Backbone, app) {
  'use strict';
  $(document).ready(function () {
    app.initialize();
  });
});

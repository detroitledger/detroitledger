/*jslint nomen: true */
/*globals define: true */

define([
  'jquery',
  'lodash',
  'backbone',

  'router'
],

function($, _, Backbone, Router) {
  'use strict';

  // Here's the dashboard app:
  // So fancy!
  var Ledger = {
    initialize: function() {
      Router.initialize();
    }
  };

  return Ledger;
});


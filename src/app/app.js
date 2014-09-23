/*jslint nomen: true */

var Router = require('./router');

exports = function() {
  var Ledger = {
    initialize: function() {
      Router.initialize();
    }
  };

  return Ledger;
};


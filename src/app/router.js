/*globals ga: true */

var Backbone = require('backbone'),
    HomeView = require('./views/home'),
    SearchView = require('./views/search'),
    OrganizationListView = require('./views/organizations/list'),
    OrganizationItemView = require('./views/organizations/item'),
    NteeItemView = require('./views/ntees/item'),
    GrantItemView = require('./views/grants/item'),
    PageView = require('./views/page'),
    QualityView = require('./views/quality');

Backbone.$ = require('jquery');

var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'home',
    '!/quality': 'showQuality',

    '!/organizations/:id': 'showOrganization',
    '!/organizations(/)': 'showOrganizations',

    '!/grants/:id': 'showGrant',

    '!/ntees/:ntee': 'showNtee',

    '!/:id': 'showPage',

    // Default
    '!/*actions': 'defaultAction'
  }
});

module.exports.initialize = function() {
  var router = new AppRouter();

  router.on('route:home', function() {
    var homeView = new HomeView({});
  });

  router.on('route:showOrganization', function(id) {
    console.log("Show organzation", id);
    var itemView = new OrganizationItemView({
      id: id
    });
  });

  router.on('route:showOrganizations', function() {
    var listView = new OrganizationListView();
  });

  router.on('route:showGrant', function(id) {
    var itemView = new GrantItemView({
      id: id
    });
  });

  router.on('route:showNtee', function(id) {
    console.log("Show NTEE", id);
    var itemView = new NteeItemView({
      id: id
    });
  });

  router.on('route:showPage', function(id) {
    var pageView = new PageView({
      id: id
    });
  });

  router.on('route:showQuality', function(id) {
    var pageView = new QualityView({});
  });

  router.on('route:defaultAction', function(actions) {
    console.log('No route:', actions);
  });

  Backbone.history.on('route', this.trackPageview);
  Backbone.history.start();
};

module.exports.trackPageview = function() {
  var url = Backbone.history.root + Backbone.history.getFragment();
  if (typeof ga === 'function') {
    ga('send', 'pageview', url);
  }
};


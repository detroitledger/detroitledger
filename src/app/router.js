var Backbone = require('backbone'),
    HomeView = require('./views/home'),
    SearchView = require('./views/search'),
    OrganizationListView = require('./views/organizations/list'),
    OrganizationItemView = require('./views/organizations/item'),
    GrantItemView = require('./views/grants/item'),
    PageView = require('./views/page');

var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'home',

    'organizations/:id': 'showOrganization',
    'organizations(/)': 'showOrganizations',

    'grants/:id': 'showGrant',

    ':id': 'showPage',

    // Default
    '*actions': 'defaultAction'
  }
});

exports.initialize = function() {
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

  router.on('route:showPage', function(id) {
    var pageView = new PageView({
      id: id
    });
  });

  router.on('oute:defaultAction', function(actions) {
    console.log('No route:', actions);
  });

  Backbone.history.start();
};

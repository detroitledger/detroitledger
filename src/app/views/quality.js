var fs = require('fs'),
  $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  template = require('../templates/quality.html');

var OLD_AGE_DAYS = 270;

var HomeView = Backbone.View.extend({
  el: '#content',
  template: template,

  events: {
    'click #network': 'showNetwork',
  },

  initialize: function(options) {
    console.log('Libertay qualitay');
    _.bindAll(this, 'render', 'fetch', 'process');

    this.fetch({ type: 'orgs', offset: 0 }, [], this.process);
  },

  fetch: function(options, memo, done) {
    var url = 'https://data.detroitledger.org/api/1.0/';
    url += options.type + '.json?limit=100&offset=' + options.offset;

    $.get(
      url,
      function(body) {
        memo = memo.concat(body.orgs);
        if (body.orgs.length === 100) {
          options.offset += 100;
          this.fetch(options, memo, done);
        } else {
          done(memo);
        }
      }.bind(this)
    );
  },

  process: function(orgs) {
    console.log('Got these orgs', orgs);
    var counts = {
      totals: orgs,
      no_tags: [],
      no_description: [],
      no_ntee: [],
      no_ein: [],
      old: [],
    };

    _.each(orgs, function(org) {
      if (org.field_ein === 0) {
        counts.no_ein.push(org);
      }

      if (
        org.field_ntee === null &&
        org.field_org_tags &&
        (org.field_org_tags.tid === '713' || org.field_org_tags.tid === '715')
      ) {
        counts.no_ntee.push(org);
      }

      if (org.body === null) {
        counts.no_description.push(org);
      }

      if (org.field_org_tags === null) {
        counts.no_tags.push(org);
      }

      var d = new Date();
      d.setDate(d.getDate() - OLD_AGE_DAYS);
      var changed = new Date(org.changed * 1000);
      if (changed < d) {
        counts.old.push(org);
      }
    });

    _.each(counts, function(count, key) {
      counts[key] = _.shuffle(count);
    });

    this.render(counts);
  },

  render: function(counts) {
    console.log('Rendering counts', counts);

    this.$el.html(
      this.template({
        counts: counts,
      })
    );
  },
});

module.exports = HomeView;

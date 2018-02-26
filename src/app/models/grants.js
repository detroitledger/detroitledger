'use strict';

var $ = require('jquery'),
  Backbone = require('backbone'),
  _ = require('lodash'),
  numeral = require('numeral'),
  moment = require('moment'),
  settings = require('../settings'),
  util = require('../util');

var Grants = {};

Grants.Model = Backbone.Model.extend({
  url: function() {
    return settings.api.baseurl + '/grants/' + this.id + '.jsonp/?callback=?';
  },

  parse: function(data) {
    // Format dollar amounts nicely
    if (data && data.field_funded_amount) {
      data.amount = numeral(data.field_funded_amount).format('0,0[.]00');
    }

    // Format start and end dates
    // 'Sun, 01 Jan 2012 05:00:00 -0500'
    // 'ddd, DD MMM YYYY HH:mm:ss ZZ'
    if (data && data.field_start_date) {
      data.start_date = moment(
        data.field_start_date,
        settings.api.dateFormat
      ).format('YYYY');
    }
    if (data && data.field_end_date) {
      data.end_date = moment(
        data.field_end_date,
        settings.api.dateFormat
      ).format('YYYY');
    }

    data.field_funder.slug = util.slugify(data.field_funder.name);
    data.field_recipient.slug = util.slugify(data.field_recipient.name);

    data.created = moment.unix(data.created).format('YYYY');
    data.changed = moment.unix(data.changed).format('MMMM D YYYY');

    return data;
  },
});

Grants.Collection = Backbone.Collection.extend({
  model: Grants.Model,

  comparator: function(model) {
    return -model.get('start_date');
  },

  initialize: function(options) {
    _.bindAll(this, 'parse', 'url', 'toJSON', 'group', 'prepForGrantList');
    this.org = options.org;
    this.direction = options.direction;
    this.limit = options.limit ? options.limit : 10000;
    this.fetch({ reset: true });
  },

  filter: function(filters) {
    if (!this.original) {
      this.original = _.cloneDeep(this.models);
    } else {
      this.models = this.original;
    }

    var models = this.toJSON();
    var filtered = models.map(function(grant) {
      var value;
      var hasName = true;
      var hasDescription = true;
      var hasTag = true;

      if (filters.org_funded_name) {
        value = filters.org_funded_name.toLowerCase();
        hasName = _.includes(grant.field_recipient.name.toLowerCase(), value);
      }

      if (filters.org_funding_name) {
        value = filters.org_funding_name.toLowerCase();
        hasName = _.includes(grant.field_funder.name.toLowerCase(), value);
      }

      if (filters.grant_description) {
        hasDescription = false;
        if (grant.body) {
          value = filters.grant_description.toLowerCase();
          hasDescription = _.includes(
            grant.body.und[0].value.toLowerCase(),
            value
          );
        }
      }

      if (filters.tag) {
        hasTag = false;
        if (
          grant.field_grant_tags &&
          grant.field_grant_tags.hasOwnProperty('und')
        ) {
          hasTag =
            typeof grant.field_grant_tags.und[filters.tag] !== 'undefined';
        }
      }

      if (hasName && hasDescription && hasTag) {
        return grant;
      }
    });

    filtered = _.remove(filtered, undefined);

    this.reset(filtered);
  },

  group: function(grant) {
    if (this.direction === 'received') {
      return grant.field_funder.target_id;
    }
    return grant.field_recipient.target_id;
  },

  prepForGrantList: function(direction) {
    var grantsJSON = this.toJSON();
    var byOrganizationID = _.groupBy(
      grantsJSON,
      this.group.bind({ direction: direction })
    );
    var group_names_by_id = {};
    _.each(grantsJSON, function(g) {
      group_names_by_id[g.field_funder.target_id] = g.field_funder.name;
      group_names_by_id[g.field_recipient.target_id] = g.field_recipient.name;
    });

    // Add counts etc.
    var readyData = [];
    var yearly_sums = {};
    var grant_tags = {};
    _.each(byOrganizationID, function(grants, organziation_id) {
      var sum = _.reduce(
        grants,
        function(memo, grant) {
          // along the way, build our yearly sums & grant tags.
          var this_year = grant.field_year.value.slice(0, 4);
          if (yearly_sums[this_year] > 0) {
            yearly_sums[this_year] += grant.field_funded_amount;
          } else {
            yearly_sums[this_year] = grant.field_funded_amount;
          }
          if (
            grant.field_grant_tags &&
            grant.field_grant_tags.hasOwnProperty('und')
          ) {
            _.forEach(grant.field_grant_tags.und, function(grant_tag) {
              grant_tags[grant_tag.tid] = {
                name: grant_tag.name,
                id: grant_tag.tid,
                count: grant_tags[grant_tag.tid]
                  ? grant_tags[grant_tag.tid].count + 1
                  : 1,
              };
            });
          }
          return memo + grant.field_funded_amount;
        },
        0
      );

      readyData.push({
        sum: sum,
        prettySum: numeral(sum).format('0,0[.]00'),
        id: organziation_id,
        name: group_names_by_id[organziation_id],
        slug: util.slugify(group_names_by_id[organziation_id]),
        grants: grants,
      });
    });

    readyData = _.sortBy(readyData, function(organization) {
      return organization.sum;
    }).reverse();

    return {
      organizations: readyData,
      yearly_sums: yearly_sums,
      grant_tags: _.reverse(_.sortBy(_.values(grant_tags), 'count')),
    };
  },

  clear: function() {
    if (this.original) {
      this.reset(this.original);
    }
  },

  url: function() {
    var url = settings.api.baseurl + '/orgs/' + this.org + '/';
    if (this.direction === 'funded') {
      url += 'grants_funded.jsonp/?';
    } else if (this.direction === 'received') {
      url += 'grants_received.jsonp/?';
    }

    var opts = {
      limit: this.limit,
    };

    url += $.param(opts);
    url += '&callback=?';
    return url;
  },

  parse: function(response) {
    return _.values(response)[0];
  },
});

module.exports = Grants;

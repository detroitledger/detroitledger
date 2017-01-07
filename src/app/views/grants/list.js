'use strict';

var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    numeral = require('numeral'),
    template = require('../../templates/grants/list.html'),
    util = require('../../util');

var GrantListView = Backbone.View.extend({

  template: template,

  initialize: function(options) {
    _.bindAll(this, 'prep', 'group', 'render');

    this.direction = options.direction;
    this.$el = options.$parent || $(options.el);

    this.collection.on('reset', this.render);
  },

  preppedData: {},

  getData: function() {
    return {
      name: $(this).attr('name'),
      value: $(this).val()
    };
  },

  group: function(grant) {
    if(this.direction === 'received') {
      return grant.field_funder.target_id;
    }
    return grant.field_recipient.target_id;
  },

  //group_names[grant.field_recipient.target_id] = grant.field_recipient.name;
  // Group each of the grants by granter or grantee
  prep: function() {
    var grantsJSON = this.collection.toJSON();
    var byOrganizationID = _.groupBy(grantsJSON, this.group);
    var group_names_by_id = {};
    _.each(grantsJSON, function(g) {
      group_names_by_id[g.field_funder.target_id] = g.field_funder.name;
      group_names_by_id[g.field_recipient.target_id] = g.field_recipient.name;
    });

    // Add counts etc.
    var readyData = [];
    var yearly_sums = {};
    _.each(byOrganizationID, function(grants, organziation_id) {
      var sum = _.reduce(grants, function(memo, grant) {
        // along the way, build our yearly sums!
        var this_year = grant.field_year.value.slice(0,4);
        if (yearly_sums[this_year] > 0) {
          yearly_sums[this_year] += grant.field_funded_amount;
        } else {
          yearly_sums[this_year] = grant.field_funded_amount;
        }
        return memo + grant.field_funded_amount;
      }, 0);

      readyData.push({
        sum: sum,
        prettySum: numeral(sum).format('0,0[.]00'),
        id: organziation_id,
        name: group_names_by_id[organziation_id],
        slug: util.slugify(group_names_by_id[organziation_id]),
        grants: grants
      });
    });

    readyData = _.sortBy(readyData, function(organization) {
      return organization.sum;
    }).reverse();

    return {
      organizations: readyData,
      yearly_sums: yearly_sums
    };
  },

  render: function() {
    this.preppedData = this.prep();
    this.$el.html(this.template({
      organizations: this.preppedData.organizations
    }));

    return this;
  }
});

module.exports = GrantListView;

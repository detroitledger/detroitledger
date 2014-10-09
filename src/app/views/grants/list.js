var $ = require('jquery'),
    _ = require('lodash'),
    chartist = require('chartist'),
    Backbone = require('backbone'),
    numeral = require('numeral'),
    Grants = require('../../models/grants'),
    template = require('../../templates/grants/list.html');

var GrantListView = Backbone.View.extend({

  template: template,

  /**
   * Initialize the grant list
   * @param  {Object} options
   *                  options.direction: required. Specifies which grants to
   *                  list. Valid values: funded, recieved
   */
  initialize: function(options) {
    _.bindAll(this, 'prep', 'group', 'render');

    this.direction = options.direction;

    // Get the organziations
    this.grants = new Grants.Collection({
      org: options.org,
      direction: options.direction,
      limit: options.limit
    });
    this.grants.on('reset', this.render);
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
    var grantsJSON = this.grants.toJSON();
    var byOrganizationID = _.groupBy(grantsJSON, this.group);
    var group_names_by_id = [];
    _.map(grantsJSON, function(g) {
      this[g.field_funder.target_id] = g.field_funder.name;
      this[g.field_recipient.target_id] = g.field_recipient.name;
    }, group_names_by_id);

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
        grants: grants
      });
    });

    readyData = _.sortBy(readyData, function(organization) {
      return organization.sum;
    }).reverse();
    console.log("Ready", readyData);
    return {
      organizations: readyData,
      yearly_sums: yearly_sums
    };
  },

  render: function() {
    var prepped_data = this.prep();
    this.$el.html(this.template({
      organizations: prepped_data.organizations,
      yearly_sums: prepped_data.yearly_sums,
      direction: this.direction
    }));

    // chartist here!
    var data = {
      labels: prepped_data.organizations,
      series: prepped_data.yearly_sums
    };
    debugger;
    
    var options = {
      labelInterpolationFnc: function(value) {
        return value[0]
      }
    };

    var responsiveOptions = [
      ['screen and (min-width: 640px)', {
        chartPadding: 30,
        labelOffset: 100,
        labelDirection: 'explode',
        labelInterpolationFnc: function(value) {
          return value;
        }
      }],
      ['screen and (min-width: 1024px)', {
        labelOffset: 80,
        chartPadding: 20
      }]
    ];

Chartist.Pie('.ct-chart', data, options, responsiveOptions);

  }
});

module.exports = GrantListView;

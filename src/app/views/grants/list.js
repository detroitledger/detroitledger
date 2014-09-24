var $ = require('jquery-browserify'),
    _ = require('lodash'),
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
    _.each(byOrganizationID, function(grants, organziation_id) {
      var sum = _.reduce(grants, function(memo, grant) {
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
    return readyData;
  },

  render: function() {
    this.$el.html(this.template({
      organizations: this.prep(),
      direction: this.direction
    }));
  }
});

module.exports = GrantListView;

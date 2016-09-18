var $ = require('jquery'),
    _ = require('lodash'),
    Chartist = require('chartist'),
    Backbone = require('backbone'),
    numeral = require('numeral'),
    Grants = require('../../models/grants'),
    template = require('../../templates/grants/list.html'),
    util = require('../../util');

var GrantListView = Backbone.View.extend({

  template: template,

  /**console.log('Loading a web page');
var page = require('webpage').create();
var url = 'http://phantomjs.org/';
page.open(url, function (status) {
  //Page is loaded!
  phantom.exit();
});

   * Initialize the grant list
   * @param  {Object} options
   *                  options.direction: required. Specifies which grants to
   *                  list. Valid values: funded, recieved
   */
  initialize: function(options) {
    _.bindAll(this, 'prep', 'group', 'render', 'afterRender');

    var _this = this;

    this.render = _.wrap(this.render, function(render) {
      render();
      _this.afterRender();
      return _this;
    });

    this.direction = options.direction;

    // Get the organziations
    this.grants = new Grants.Collection({
      org: options.org,
      direction: options.direction,
      limit: options.limit
    });
    this.grants.on('reset', this.render);
  },

  preppedData: {},

  afterRender: function() {
    // chartist here!
    // @todo this is wrong: relies on original object order.
    // instead, prepare yearly_sums as array to begin with
    var years = [];
    var sums = _.sortBy(this.preppedData.yearly_sums, function(sum, year) {
      years.push(year);
      return year;
    });

    var data = {
      labels: years, //expects array of years
      series: [sums] //expects an array of array of amounts
    };

    if (data.labels.length > 0) {

      var options = {
        high: Math.max(_.values(data.series)),
        low: 0,
        axisY: {
          labelInterpolationFnc: function(value, index) {
            return index % _.values(data.series).length === 0 ? "$" + numeral(value).format('0a') : null;
          }
        },
        axisX: {
          labelInterpolationFnc: function(value, index) {
            return index % 1 === 0 ? value : null;
          }
        }
      };

      new Chartist.Bar(this.$el.find('.ct-chart')[0], data, options);
    }

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
      organizations: this.preppedData.organizations,
      yearly_sums: this.preppedData.yearly_sums,
      direction: this.direction
    }));

    return this;
  }
});

module.exports = GrantListView;

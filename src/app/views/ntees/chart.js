'use strict';

var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    Highcharts = require('highcharts'),
    moment = require('moment'),
    numeral = require('numeral'),
    tinycolor = require('tinycolor'),

    Organizations = require('../../models/organizations');
    // template = require('../../templates/organizations/list.html');


var NTEEChartView = Backbone.View.extend({
  //template: template,

  initialize: function() {
    _.bindAll(this, 'render');
    this.collection.bind('reset', this.render);
  },

  get: function(org, field) {  
     // XXX TODO we need to have a better info object join here.
    if (!org.info) {
      // console.log('Skipping, no info', org);
      return;
    }

    var series = {
      name: org.info.NAME,
      data: []
    };

    org.data.forEach(function(year) {
      // var date = moment(year.year + '-' + year.month + '-01').endOf('month');
      series.data.push([Date.UTC(year.year, year.month, 1), Number(year[field])]);
    });

    // console.log("Got series", series);
    return series;
  },

  getRevenues: function(org) {
    return this.get(org, 'total_revenue');
  },

  getExpenses: function(org) {
    return this.get(org, 'total_expenses');
  },

  getAssets: function(org) {
    return this.get(org, 'total_assets');
  },

  makeChart: function(slug, series) {
    var colors = tinycolor('#27a9ff', series.length).analogous();
    colors = colors.map(function(t) { return t.toHexString(); });

    series = _.filter(series, undefined);

    $('.chart-' + slug).highcharts({
      chart: {
        type: 'spline'
      },
      title: {
        text: null
      },
      legend: {
        enabled: false
      },
      tooltip: {
        dateTimeLabelFormats: {
          month: '%b %Y',
          year: '%b %Y',
          day: '%b %Y'
        },
        headerFormat: '<span style="font-size: 10px">Year ending {point.key}</span><br/>',
        pointFormatter: function() {
          return this.series.name + ': $' + numeral(this.y).format('0,0[.]00');
        },
        // shared: true,
        split: true,
        distance: 30,
        padding: 5
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
          month: '%b %Y',
          year: '%b %Y',
          day: '%b %Y'
        },
        title: {
          text: null
        }
      },
      yAxis: {
        labels: {
          formatter: function() {
            var value = this.value;
            if (value >= 1000000000) {
              value = value / 1000000000 + 'B';
            }

            if (value >= 1000000) {
              value = value / 1000000 + 'M';
            }

            if (value >= 1000) {
              value = value / 1000 + 'k';
            }
            return '$' + value;
          }
        },
        minorTickInterval: 0.1,
        minorGridLineColor: '#f2f2f2',
        title: {
          text: null
        },
        type: 'logarithmic'
      },
      plotOptions: {
        spline: {
          lineWidth: 1,
          marker: {
            enabled: true,
            radius: 4,
            lineColor: '#fff',
            lineWidth: 1
          }
        }
      },
      series: series,
      colors: colors,
      credits: {
        enabled: false
      }
    });
  },

  render: function() {    
    var data = this.collection.toJSON();
    var revenues = data.map(this.getRevenues.bind(this));
    var expenses = data.map(this.getExpenses.bind(this));
    var assets = data.map(this.getAssets.bind(this));

    this.makeChart('revenues', revenues);
    this.makeChart('expenses', expenses);
    this.makeChart('assets', assets);
  }
});

module.exports = NTEEChartView;

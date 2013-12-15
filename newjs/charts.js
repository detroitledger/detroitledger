(function(window) {

"use strict";

var target_els = [];

target_els = [].slice.call(document.querySelectorAll('.d3'));

target_els.forEach(function(el, idx, arr) {
  var options = {};

  el.id = 'plot_' + idx;

  options.id = (el.dataset.optionsId > 0) ? el.dataset.optionsId : null;

  draw_a_plot(el.id, el.dataset.type, options);
});

/**
 * Draw a quantile plot
 *
 * @param target_id
 *   DOM id that will hold the plot
 * @param plot_type
 *   Type of plot to draw. Either 'all_grants' or 'org_grants'
 * @param options
 *   For org grants, specify organization id: {id:12345}
 */
function draw_a_plot(target_id, plot_type, options) {
  var json_url = '';

  switch (plot_type) {
    case 'org_grants':
      json_url = '/jsons/' + options.id + '.json';
      break;
    case 'all_grants':
    default:
      json_url = '/jsons/allgrants.json';
      break;
  }

  d3.json(json_url, function(error, data) {

    var dataByType = d3.nest()
        .key(function(d){ return d.year_start; })
        .sortKeys(d3.ascending)
        .entries(data);

    var draw = function(data, dataByType) {
      var margin = {top: 10, right: 10, bottom: 20, left: 80},
          width = 500 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;

      if (d3.selectAll('#' + target_id + ' svg')[0].length === 0) {
        var svg = d3.select('#' + target_id).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      } else {
        var svg = d3.select('#' + target_id + ' svg');
      }

      var x = d3.scale.ordinal()
          .domain(dataByType.map(function(d){ return d.key; }))
          .rangePoints([0, width], 1);

      var y = d3.scale.linear()
          .domain([d3.min(data, function(d){ return d.amount; })-1, d3.max(data, function(d){ return d.amount; })+1])
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x);

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      window.quartileplot = d3.svg.quartileplot()
          .domain(y.domain())
          .height(height)
          .whiskers(whiskers(2))
          .y(accessor)
          .yScale(y);

      svg.selectAll(".quartileplot")
          .data(dataByType)
        .enter().append("g")
          .attr("class", "quartileplot")
          .attr("transform", function(d){ return "translate(" + x(d.key) + ")"; })
          .call(quartileplot);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);
    };

    draw(data, dataByType);

    // The accessor function returns a sample of records for each type of glass.
    // We do this only to demonstrate that quartile plots can be transitioned.
    function accessor(d) {
      return d.values.map(function(d) {
        return d.amount;
      });
    }

  });
}


// Compute a quartile plot's whiskers in terms of its inter-quartile range.
// Returns an array of two elements: the values of the lower and upper whiskers.
function whiskers(k) {

  return function(data) {

    var q1 = d3.quantile(data, 0.25),
        q2 = d3.quantile(data, 0.5),
        q3 = d3.quantile(data, 0.75),
        iqr = q3 - q1,
        i = 0,
        j = data.length - 1;

    while (data[i] < q2 - k * iqr) {
      i += 1;
    }

    while (data[j] > q2 + k * iqr) {
      j -= 1;
    }

    return [data[i], data[j]];

  }

}

})(window);

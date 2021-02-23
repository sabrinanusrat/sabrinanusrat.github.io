//generate the chart to show number of deaths over time

var margin_time = {top: 10, right: 50, bottom: 20, left: 70},
    width_time = 900 -margin_time.left - margin_time.right,
    height_time = 500 - margin_time.top - margin_time.bottom;

var time_d = "/static/assets/data/time_deaths.csv" ;

var svg0 = d3.select("#chart0")
    .append("svg:svg")
    .attr("width", width_time+margin_time.left+margin_time.right)
    .attr("height", height_time+margin_time.top+margin_time.bottom)
    .append("svg:g")
    .attr("transform", "translate(" + margin_time.left + "," + margin_time.top + ")");


d3.csv(time_d, function(error, data) {
  if (error) throw error;

  var color = d3.scale.category10()
    .domain(d3.keys(data[0]).filter(function(key) { return key !== "Date"; }));

  var stats = color.domain().map(function(cause) {
    return {    
      cause: cause,
      values: data.map(function(d) {
        return {date: parseInt(d.Date), num_deaths: +d[cause]};
      })
    };
  });


  var x = d3.scale.linear()
    .domain(d3.extent(data, function(d) { return parseInt(d.Date); }))
    .range([0, width_time]);

  var y = d3.scale.linear()
    .domain([
      d3.min(stats, function(c) { return d3.min(c.values, function(v) { return v.num_deaths; }); }),
      d3.max(stats, function(c) { return d3.max(c.values, function(v) { return v.num_deaths; }); })
    ])  
    .range([height_time, 0]);

  var xAxis0 = d3.svg.axis()
    .scale(x)
    .tickValues(data.map(function(d) {
      return parseInt(d.Date);
    }))
    .tickFormat(d => ""+d)
    .orient("bottom");

  var yAxis0 = d3.svg.axis()
    .scale(y)
    .orient("left");

  var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.num_deaths); });

  svg0.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height_time) + ")")
      .call(xAxis0);

  svg0.append("g")
      .attr("class", "y axis")
      .call(yAxis0)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Deaths");

  var cd = svg0.selectAll(".cd")
      .data(stats)
      .enter()
      .append("g")
      .attr("class", "cd");

  cd.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.cause); });

  cd.append("text")
      .datum(function(d) { return {cause: d.cause, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.num_deaths) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.cause; });
});

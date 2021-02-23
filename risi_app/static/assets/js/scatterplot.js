//generate a scatterplot to show death rates from Covid and Crude_rate

var margin_s = //{top: 20, right: 80, bottom: 30, left: 50},
{top: 10, right: 20, bottom: 20, left: 40},
    width_s = 900 - margin_s.left - margin_s.right,
    height_s = 500 - margin_s.top - margin_s.bottom;

var rate_s = "/static/assets/data/death_rates_counties.csv" ;

//var parseDate = d3.time.format("%Y%m%d").parse;

//var x = d3.time.scale()
var x_s = d3.scale.linear()
    .domain([0,120])
    .range([0, width_s]);

var y_s = d3.scale.linear()
    .domain([0,700])
    .range([height_s, 0]);

//var color = d3.scale.category10();

var xAxis_s = d3.svg.axis()
    .scale(x_s)
    .orient("bottom");

var yAxis_s = d3.svg.axis()
    .scale(y_s)
    .orient("left");

/*var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.num_deaths); });*/

var svg_s = d3.select("#chart_scatter")
.append("svg:svg")
.attr("width", width_s+margin_s.left+margin_s.right)
.attr("height", height_s+margin_s.top+margin_s.bottom)
.append("svg:g")
.attr("transform", "translate(" + margin_s.left + "," + margin_s.top + ")");


svg_s.append("g")
      .attr("class", "x axis label")
      .attr("transform", "translate(" + 0 + "," + height_s + ")")
      .call(xAxis_s)
      .append("text")
      .text("DoD death per 100k")
      .attr("x", width_s)
      .attr("y", -6)
      .style("text-anchor", "end");	
  // y-axis
svg_s.append("g")
      .attr("class", "y axis label")
      .call(yAxis_s)
      .append("text")
      .text("Covid death rate")
      .attr("transform", "rotate(-90)")
      .attr("y",6)
      .attr("dy", ".71em") 
      .style("text-anchor","end")	

var tooltip_s = d3.select("body")
					.append("div")
					.attr("class","tooltip")
					.attr("style","display:none")
var datas;
d3.csv(rate_s,  
		function(data) 
		{
            //datas = data;
            datas = data.filter(function(d){
                if(isNaN(d.crude_rate) || isNaN(d.deaths_per_100k) || d.crude_rate=="" || d.deaths_per_100k==""){
                    return false;
                }
                
                return true;
            });
			svg_s.selectAll("circle")
			.data(datas)
			.enter()
			.append("circle")
			.attr("cx", function(d) {return x_s(d.crude_rate); })
			.attr("cy", function(d) {return y_s(d.deaths_per_100k); })
            .attr("r", 2)
            .style("stroke", function(d) { return "#8856a7"; })
            .style("stroke-width", function(d) { return 0.7; })
	        .style("stroke-opacity", function(d) { return 0.7; })
            .attr("fill", function(d) { return "#8856a7"; })
            .attr("opacity", function(d) { return 0.7; })
			.on("mouseover", function(d)
			{
				tooltip_s.transition()
						.duration(100)
						.style("opacity", .9);
				tooltip_s.html( "County: "+ d.name + ", " + "State: "+ d.st_name + ", " + "DoD per 100k: "+ d3.round(d.crude_rate) + ", " + "Covid deaths per 100k: "+ d3.round(d.deaths_per_100k,2) ) //what to display on mouseover
				.style("left", (d3.event.pageX + 5) + "px")
				.style("top", (d3.event.pageY - 28) + "px")
				.style("display", "block")
			})
			.on("mouseout", function(d) 
			{
				tooltip_s.transition()
						.duration(500)
						.style("opacity",0);
			});		
		});

function type(d) {
	d.size = +d.size;
	d.time  = d.time;
	return d
}		
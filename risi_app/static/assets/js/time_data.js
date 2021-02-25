//Width and height
var w = 960;
var h = 500;

var margin = {
    top: 60,
    bottom: 40,
    left: 70,
    right: 40
  };

  var width = w - margin.left - margin.right;
  var height = h - margin.top - margin.bottom;



  
var fl0 =  "/static/assets/data/foreclosures_by_year_month.csv" ;//document.getElementById('file1').textContent; //states-albers-10m-2 //USA-Pop2010-input.json



var svg0 = d3.select("#chart0")
.append("svg:svg")
.attr("width", width)
.attr("height", height)
.append("svg:g");

var left = 60;
var right = width-50;
var bottom = height-100;
var top = 50;
console.log("left="+left);
console.log("right="+right);
console.log("bottom="+bottom);
console.log("top="+top);

data=[[2003, 147392],[2008, 164430],[2013, 192506],[2018, 223842]];

var x_min = d3.min(data, d=>d[0]);
var x_max = d3.max(data, d=>d[0]);
var x_interval = x_max - x_min;

var y_min = d3.min(data, d=>d[1]);
var y_max = d3.max(data, d=>d[1]);
var scale_x = d3.scale.linear()
.domain([x_min - x_interval/20, x_max+x_interval/20])
.range([left, right]);

var scale_y = d3.scale.linear()
.domain([y_min-1, y_max+1])
.range([bottom, 50]);

//.range([bottom, top]);

var valueline = d3.svg.line()
.x(d => scale_x(d[0]))
.y(d => scale_y(d[1]));

var tooltip0 = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
  .style("visibility", "hidden");

  labels=['Year', 'Suicide'];
  

svg0.append("path")
.attr("class", "line")
.attr("d", valueline(data))
.attr("stroke", "yellow");

svg0.selectAll("dot")
.data(data)
.enter()
.append("circle")
.attr("class", "point")
.attr("r", 4)
.attr("cx", d => scale_x(d[0]))
.attr("cy", d => scale_y(d[1]))
.on("mouseover", d => {
    tooltip0
        .style("visibility", "visible")
        .text(labels[0]+": "+d[0]+'\n'+labels[1]+": "+d[1])
})
.on("mousemove", () => tooltip0.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px"))
.on("mouseout", () => tooltip0.style("visibility", "hidden"))
.on("click", d => {console.log(d);});

var xAxis = d3.svg.axis().scale(scale_x)
.orient("bottom");//.ticks(tick_intervals[0]);

svg0.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0, " + bottom + ")")
.call(xAxis);

svg0.append("text")
.attr("class", "axis-label")
.attr("text-anchor", "middle")
.attr("x", (left+right)/2)
.attr("y", bottom+40)
.text(labels[0]);

var yAxis = d3.svg.axis().scale(scale_y)
.orient("left");//.ticks(tick_intervals[1]);

svg0.append("g")
.attr("class", "y axis")
.attr("transform", "translate(" + left + ", 0)")
.call(yAxis);

svg0.append("text")
.attr("class", "axis-label")
.attr("text-anchor", "middle")
.attr("x", -(top+bottom)/2)
.attr("y", left-45)
.attr("transform", "rotate(-90)")
.text(labels[1]);

svg0.append("text")
.attr("class", "title")
.attr("text-anchor", "middle")
.attr("x", (left+right)/2)
.attr("y", height-20)
.text(name);


	
var height_dorling2=550, width_dorling2=900;	
var force2 = d3.layout.force()
	.charge(0)
	.gravity(0)
	.size([width_dorling, height_dorling]);


var nodes, links = [];

var Crude_rate=[];

allStatesForRate=[];

var Max_cr;
//var DataMax ;

var states;
	
var project = d3.geo.albersUsa(),
	idToNode = {};

var cause_rate = "Drug";
var time_p_rate ="2014-2018";

var fl1 = "/static/assets/data/export_dataframe_all.csv" ;
var fl1 = "/static/assets/data/export_dataframe_all.csv" ;
d3.csv(fl1, function(states) {
	allStatesForRate = states;
	const causes = [...new Set(states.map(st => st.death_cause))].sort();
	const time_periods = [...new Set(states.map(st => st.time_period))].sort();
	populateRadioForRate(
		document.getElementById("radio_rate"),
		"Choose a cause of death", "cause", cause_rate, causes, "setCauseForRate");
	populateRadioForRate(
		document.getElementById("radio_rate"),
		"Choose a time period", "time_period", time_p_rate, time_periods, "setTimePeriodForRate");
	return drawShadedCartogramsForRate();
});

function setCauseForRate(val) {
	cause_rate = val;
}
function setTimePeriodForRate(val) {
	time_p_rate = val;
}


function populateRadioForRate(element, label, source, current, values, fName) {
	text = '<label class="inline-label">'+label+'</label>';
	text += '<div id="radio_rate_'+source+'" class="radio-group">';
	values.forEach(value => {
		var onClickVar = fName+'("'+value+'");drawShadedCartogramsForRate()';
        if (value === current) {
            text += '<input type="radio" name="radio_rate_'+source+'" id="radio_rate_'+source+'_'+value+'" value="'+value+'" onClick='+onClickVar+' checked />';
        } else {
            text += '<input type="radio" name="radio_rate_'+source+'" id="radio_rate_'+source+'_'+value+'" value="'+value+'" onClick='+onClickVar+' />';
        }
        text += '<label for="radio_rate_'+source+'_'+value+'">'+value+'</label>';
	});
	element.innerHTML += text+'</div>';
}


function drawShadedCartogramsForRate() {

	d3.select("#chart4").select("svg").remove();
	var svg4 = d3.select("#chart4").append("svg:svg")
		.attr("width", width_dorling)
		.attr("height", height_dorling)
		.append("svg:g")
		.attr("transform", "translate(0,0)");

	states=allStatesForRate.filter(obj => obj.death_cause == cause_rate && obj.time_period == time_p_rate)

	//states.features.map(function(d){data.push(d.deaths_dod)});
	states = states.filter(d => project([d.lon, d.lat]));
	
	/*states.forEach(function(d){
		data.push(d.deaths_dod);
	})
		
	DataMax = d3.max(data);
	DataMin=d3.min(data);*/

	//console.log("Data Max = "+DataMax);



	states.forEach(function(d)
		{Crude_rate.push(d.crude_rate)});

    Max_cr = d3.max(Crude_rate);


	var lons = states.map(d => project([d.lon, d.lat])[0]);
	var lats = states.map(d => project([d.lon, d.lat])[1]);
	//var lats = states.map(d => d.lat);
	//var lons = states.map(d => d.lon);
	var latScale = d3.scale.linear()
    	.domain([d3.min(lats), d3.max(lats)])
		.range([50, height_dorling2-50]);
	var lonScale = d3.scale.linear()
		.domain([d3.min(lons), d3.max(lons)])
		.range([50, width_dorling2-50]);
	nodes4 = states.map(function(d)
	{
		var xy = project([d.lon, d.lat]);
		return idToNode[d.id] =
		{
			//x: latScale(xy[0]),
			//y: lonScale(xy[1]),
			y: latScale(xy[1]),
			x: lonScale(xy[0]),
			gravity: {x: d.lon, y: d.lat},
			r: Math.sqrt(d.crude_rate/Max_cr)*5,
			cr:d.crude_rate,
			name: d.name
		};
	});


	var tooltip4 = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden");
		
	
	svg4.selectAll("circle")
	.data(nodes4)
	.enter().append("svg:circle")
	.style("stroke", function(d) { return "#dd1c77" ; }) //"#c51b8a"; })//"#7b3294"
	.style("stroke-width", function(d) { return 0.7; })
	.style("stroke-opacity", function(d) { return 0.7; })
	.style("fill", function(d) { 
		//console.log("value: "+d.dod); 
        //console.log("color value: "+color(d.dod)); 
      //  return  "#c51b8a";
      return  "none";
		//return "lightgray"; //color_d(d.dod);
	})
	//.style("fill-opacity", function(d) { return 0.3; })
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r", function(d, i) { return d.r; })
//    .on("mouseover", function(d){return tooltip.style("visibility", "visible").text("Total number of quote events "+"of "+ d.name +" is " +d.quote+ " and number of policy of "+d.name+ " is "+d.pop60);})
	.on("mouseover", function(d){return tooltip4.style("visibility", "visible").text(d.name+": Crude rate "+"of "+ d.name +" is " + d.cr);})
	//.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
	.on("mousemove", function(d){return tooltip4.style("top", (d.x-55)+"px").style("left",(d.y-55)+"px");})
	.on("mouseout", function(){return tooltip4.style("visibility", "hidden");});  
	;
	var dx, dy, l, d;


	/*var times = 0;
	//var factor=0.02;
	force
	.nodes(nodes)
	//.links(links)
	.start()
	.on("tick", function(e)
	{
		times = times + 1;
		if(times>10) {
			return;
		}
		var k = e.alpha,
		kg = k * .02;
		//kg = k * factor;
		//var flag = 0;

		nodes.forEach(function(a, i)
		{
			//Apply gravity forces.
			a.x += (a.gravity.x - a.x) * kg;
			a.y += (a.gravity.y - a.y) * kg;
			  
			nodes.slice(i + 1).forEach(function(b, j)
			{
				// Check for collisions.
				b = nodes.slice(i+1)[j];

				dx = a.x - b.x,
				dy = a.y - b.y,
				l = Math.sqrt(dx * dx + dy * dy),
				d = a.r + b.r;
					
				if (l < d)
				{
					l = (l - d) / l * k;
					dx *= l;
					dy *= l;
			  
					a.x -= dx;
					a.y -= dy;
					b.x += dx;
					b.y += dy;
					//flag = 1;
				}
				nodes.slice(i+1)[j].x=b.x;
				nodes.slice(i+1)[j].y=b.y;
			});
				
			nodes[i].x=a.x;
			nodes[i].y=a.y;
	
		});
		
});**/

/*svg.selectAll("circle")
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; });**/

}
	


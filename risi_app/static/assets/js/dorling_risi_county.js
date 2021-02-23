var data=[];
	
var height_dorling=550, width_dorling=900;	
var force = d3.layout.force()
	.charge(0)
	.gravity(0)
	.size([width_dorling, height_dorling]);

var nodes, links = [];

var Pop=[];
var allStatesForDoD = [];

var PopMax;
var DataMax ;

var states;
	
var project = d3.geo.albersUsa(),
	idToNode = {};

//var cause = "DoD";
//var time_p ="2009-2013";

var cause_dod = "Drug";
var time_p_dod ="2014-2018";

var fl1 = "https://sabrinanusrat.github.io/risi_app/static/assets/data/export_dataframe_all.csv" ;
d3.csv(fl1, function(states) {
	allStatesForDoD = states;
	const causes = [...new Set(states.map(st => st.death_cause))].sort();
	const time_periods = [...new Set(states.map(st => st.time_period))].sort();
	populateRadioForDod(
		document.getElementById("radio_dod"),
		"Choose a cause of death", "cause", cause_dod, causes, "setCauseForDod");
	populateRadioForDod(
		document.getElementById("radio_dod"),
		"Choose a time period", "time_period", time_p_dod, time_periods, "setTimePeriodForDod");
	return drawShadedCartogramsForDoD();
});

function setCauseForDod(val) {
	cause_dod = val;
}
function setTimePeriodForDod(val) {
	time_p_dod = val;
}


function populateRadioForDod(element, label, source, current, values, fName) {
	text = '<label class="inline-label">'+label+'</label>';
	text += '<div id="radio_dod_'+source+'" class="radio-group">';
	values.forEach(value => {
		var onClickVar = fName+'("'+value+'");drawShadedCartogramsForDoD()';
        if (value === current) {
            text += '<input type="radio" name="radio_dod_'+source+'" id="radio_dod_'+source+'_'+value+'" value="'+value+'" onClick='+onClickVar+' checked />';
        } else {
            text += '<input type="radio" name="radio_dod_'+source+'" id="radio_dod_'+source+'_'+value+'" value="'+value+'" onClick='+onClickVar+' />';
        }
        text += '<label for="radio_dod_'+source+'_'+value+'">'+value+'</label>';
	});
	element.innerHTML += text+'</div>';
}

function drawShadedCartogramsForDoD(){
	d3.select("#chart3").select("svg").remove();
	var svg = d3.select("#chart3").append("svg:svg")
	.attr("width", width_dorling)
	.attr("height", height_dorling)
	.append("svg:g")
	.attr("transform", "translate(0,0)");

	//states.features.map(function(d){data.push(d.deaths_dod)});

	states=allStatesForDoD.filter(obj => obj.death_cause == cause_dod && obj.time_period == time_p_dod)
	states = states.filter(d => project([d.lon, d.lat]));
	
	states.forEach(function(d){
		data.push(d.deaths_dod);
	})
		
	DataMax = d3.max(data);
	DataMin=d3.min(data);

	//console.log("Data Max = "+DataMax);

	//var color = d3.scaleLinear()
	/*var color = d3.scale.linear()
    	.domain([d3.min(data), 0.5, d3.max(data)])
		.range(["#fff","#00d", "#556"]); */


	states.forEach(function(d)
		{Pop.push(d.population)});

	PopMax = d3.max(Pop);


	var lons = states.map(d => project([d.lon, d.lat])[0]);
	var lats = states.map(d => project([d.lon, d.lat])[1]);
	//var lats = states.map(d => d.lat);
	//var lons = states.map(d => d.lon);
	var latScale = d3.scale.linear()
    	.domain([d3.min(lats), d3.max(lats)])
		.range([50, height_dorling-50]);
	var lonScale = d3.scale.linear()
		.domain([d3.min(lons), d3.max(lons)])
		.range([50, width_dorling-50]);
	nodes = states.map(function(d)
	{
		var xy = project([d.lon, d.lat]);
		return idToNode[d.id] =
		{
			//x: latScale(xy[0]),
			//y: lonScale(xy[1]),
			y: latScale(xy[1]),
			x: lonScale(xy[0]),
			gravity: {x: d.lon, y: d.lat},
			r: Math.sqrt(d.population/PopMax),
			dod:d.deaths_dod,
			name: d.name,
			value: d.population/5
		};
	});


	var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden");
		
	

	console.log("dataMax = "+ DataMax +", datamin ="+DataMin);

	//quantile = ƒ(n);

	var color_d = 
//d3.scale.linear().domain([DataMin,  DataMax]).range(["#e7e1ef","#dd1c77"])
d3.scale.linear().domain([DataMin,  DataMax]).range(["#ef8a62","#67a9cf"])
 //d3.scale.quantile()
 // .domain(data) // pass the whole dataset to a scaleQuantile’s domain
  //.range(['#edf8b1', '#7fcdbb', '#2c7fb8'])
  //.range(['#66c2a5', '#fc8d62', '#8da0cb'])

	console.log("Testing cScale="+color_d(DataMin));

	console.log("Testing cScale2="+color_d(DataMax));

	svg.selectAll("circle")
	.data(nodes)
	.enter().append("svg:circle")
	.style("stroke", function(d) {return color_d(d.dod);}) //{ return "#0000FF"; })
	.style("stroke-width", function(d) { return 1; })
//	.style("stroke-opacity", function(d) { return 0.7; })
	.style("fill", function(d) { 
		//console.log("value: "+d.dod); 
		//console.log("color value: "+color(d.dod)); 
		return color_d(d.dod);
	})
	.style("fill-opacity", function(d) { return 0.3; })
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r", function(d, i) { return d.r; })
//    .on("mouseover", function(d){return tooltip.style("visibility", "visible").text("Total number of quote events "+"of "+ d.name +" is " +d.quote+ " and number of policy of "+d.name+ " is "+d.pop60);})
	.on("mouseover", function(d){return tooltip.style("visibility", "visible").text(d.name+": Total number of dod "+"of "+ d.name +" is " + d.dod + ", and pop is "+d.value + ", color = "+color_d(d.dod));})
	//.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
	.on("mousemove", function(d){return tooltip.style("top", (d.x-55)+"px").style("left",(d.y-55)+"px");})
	.on("mouseout", function(){return tooltip.style("visibility", "hidden");});  
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
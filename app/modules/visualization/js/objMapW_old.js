var policycompass = policycompass || {'version':0.1, 'controller':{}, 'viz': {} ,'extras': {} };

policycompass.viz.mapW = function(options)
{
	var self = {};
    // Get options data
    for (key in options){
        self[key] = options[key];
    }
    self.parentSelect = "#"+self.idName;
    
	d3.select(window).on("resize", throttle);

	var zoom = d3.behavior.zoom()
    	.scaleExtent([1, 9])
    	.on("zoom", move)
    	;

	//var width = document.getElementById('container_graph').offsetWidth;
	//var height = width / 2;
	var width = self.width + self.margin.left + self.margin.left;
    var height = self.height + self.margin.top + self.margin.bottom;
    //console.log("width="+width);
    //console.log("height="+height);
    
    //var height = self.height / 2;
    var color = d3.scale.category20();
    //width = 960;
    //height = 960;
    	
	var topo,projection,path,svg,g;
	var graticule = d3.geo.graticule();
	
	//var tooltip = d3.select(self.parentSelect).append("div").attr("class", "tooltip hidden");

	var λ = d3.scale.linear()
	    //.domain([0, width])
	    .domain([self.margin.left, self.margin.left+self.width])
	    .range([-180, 180]);
	
	var φ = d3.scale.linear()
	    //.domain([0, height])
	    .domain([self.margin.top, self.height])
	    .range([90, -90]);
    
            
	setup(width, height);		
		    
	function setup(width,height) 
	{
		if (self.projection=='mercator')
		{
			projection = d3.geo.mercator()
				.translate([(width/2), (height/2)])
				.scale( width / 2 / Math.PI)
				.precision(.1);
				;			
		}		
		else if (self.projection=='conicConformal')
		{
			projection = d3.geo.conicConformal()
			    //.rotate([98, 0])
			    .center([0, 0])
			    //.parallels([29.5, 45.5])
			    //.scale(1000)
			    .scale( width / 2 / Math.PI)
			    //.scale( width / 4 / Math.PI)
			    //.translate([width / 2, height / 2])
			    .precision(.1);
		}		
		else if (self.projection=='equirectangular')
		{

			projection = d3.geo.equirectangular()
				.translate([(width/2), (height/2)])
				//.scale( width / 2 / Math.PI)
				.precision(.1);
				;
	
				/*
			projection = d3.geo.transverseMercator()
    			.scale((width + 1) / 2 / Math.PI)
    			.translate([width / 2, height / 2]);
    			*/						
		}
		else if (self.projection=='orthographic')
		{
			projection = d3.geo.orthographic()
			   // .scale(475)
			    .translate([width / 2, height / 2])
			    .clipAngle(90)
			    .precision(.1)
			    ;			
		}
		else if (self.projection=='azimuthalEqualArea')
		{
			projection = d3.geo.azimuthalEqualArea()
			    .clipAngle(180 - 1e-3)
			    //.scale(237)
			    .translate([width / 2, height / 2])
			    .precision(.1);		
		}
		else
		{
			projection = d3.geo.mercator()
				.translate([(width/2), (height/2)])
				.scale( width / 2 / Math.PI)
				.precision(.1);
				;				
		}	


					
        path = d3.geo.path().projection(projection);    	

		//console.log(self.parentSelect);
		self.parentSelect = self.parentSelect.replace("undefined","");
		//console.log(self.parentSelect);
		
		self.svg = d3.select(self.parentSelect).append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("class", "mapa")
			//.call(zoom)
			//.on("click", click)			
			.append("g")			
			//.on("mousemove", mousemove)
			//.on("mousedown", mousedown);

			
			;
	    
	    //console.log("showZoom="+self.showZoom);
	    
	    if ( (self.projection!='orthographic') && (self.projection!='azimuthalEqualArea'))
	    {
		    if (self.showZoom)
		    {	
				self.svg.call(zoom);
			}	    	
	    }


		g = self.svg.append("g");

		var lat = 0;

		//if ( (self.projection=='orthographic') || (self.projection=='azimuthalEqualArea'))
		//{
			if (self.showMovement)
			{
	
				setInterval(function(){
				//console.log("self.projection="+self.projection+"--lat="+lat);
				//lat = lat +.5
				lat = lat + 5
		 		projection.rotate([lat,0]);
		  		self.svg.selectAll("path")
		      		.attr("d", path)
		      		;
		    
				},50);
				
		    }	
		//}
			
			//g.attr("transform", "scale(0.75)");
			/*
			self.svg
			.attr("width", width+self.margin.left+self.margin.left)
			.attr("height", height+self.margin.top+self.margin.bottom);
			*/
			
			if (self.legend)
			{
				self.legendsColumn = 4;
	
				var cntiMultiple=0;
				var cntY =0;
				for (var i=0; i < 25; i++) {
				
					
					cntY=cntY+1;
		    		if ((i%14 == 0) && (i>0))
	                {
						cntiMultiple=cntiMultiple+1;
						cntY=0;
					}
					else if (i==0)
					{
						cntY=0;
					}
					var valueX =  (40 * (cntiMultiple));
					
					valueX = 15+valueX;
					valueY = height/3 + cntY*20;
					key = i;
					self.svg.append("rect")
				    	.attr("x", valueX-10)
						.attr("y", valueY-5) 	
				    	.attr("width", 5)
				    	.attr("height", 5)
				    	.style("fill", function(d,i) {return color(key);});
				    	
					self.svg.append("text")
		                .attr("x", function(d,i){
		                   	//console.log("cnti="+cnti+"--key="+key);
		                   	return valueX ;}
		               	)
						.attr("y", function(d,i){
							//console.log("--->cnti="+cnti+"--key="+key);
							return  valueY;}
						)
						.attr("text-anchor","center")
						.attr("text-decoration","none")					
						.attr("class", "link superior legend value")				
						.attr("font-size", self.font_size)
						.text("A"+i)
						.style("fill", function(d,i) {return color(key);});
						;
				};
			}			

/*
var colors = d3.scale.quantize()
    .range(colorbrewer.Greens[7]);
    */
/*
var legend = d3.select('#maplegend');

legend.html("<ul><li style='color:"+color(key)+"'>1111</li><li style='color:"+color()+"'>2222</li></ul>")
;
*/
function mousemove() {
	
  
	if ( (self.projection=='orthographic')
		|| (self.projection=='azimuthalEqualArea'))
	{
		var p = d3.mouse(this);
		projection.rotate([λ(p[0]), φ(p[1])]);
		//projection.rotate([λ(p[0]), 0]);
		self.svg.selectAll("path").attr("d", path);
		
	}
	else
	{
		
	}
}
/*
self.svg.on("click", function() {
  var p = d3.mouse(this);
  
  console.log(λ(p[0]));
  console.log(φ(p[1]));
  projection.rotate([λ(p[0]), φ(p[1])]);
  //projection.rotate([λ(p[0]), 0]);
  self.svg.selectAll("path").attr("d", path);
});
*/
/*
self.svg.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);

self.svg.append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#sphere");

self.svg.append("use")
    .attr("class", "fill")
    .attr("xlink:href", "#sphere");

self.svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);
*/
	}
	

	
	d3.json("/app/modules/visualization/json/world-topo-min.json", function(error, world)
	//d3.json("/app/modules/visualization/json/world-50m.json", function(error, world) 
	{
		
  		var countries = topojson.feature(world, world.objects.countries).features;
  		topo = countries;
  		
  		draw(topo);
		
/*		
		self.svg.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")            
      .attr("d", path);

  		self.svg.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);  		
*/
      
	});
	
//	d3.select(self.frameElement).style("height", height + "px");

	



	function draw(topo) 
	{
		self.svg.append("path")
			.datum(graticule)
			.attr("class", "graticule")
			.attr("fill", "none")
			.attr("d", path)			
			.on("mousemove", function(d,i) {
				var posMouse = d3.mouse(this);
				var posX = posMouse[0];
				var posY = posMouse[1];
				mousemove();
				
					
			})				
			;
				
		
			
			
/*
		g.append("path")
			.datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
			.attr("class", "equator")
			.attr("d", path);
*/
		var country = g.selectAll(".country").data(topo);

		country.enter().insert("path")
			//.attr("class", "country ")
			.attr("class", function(d,i) {
			var countryname = d.properties.name;
			countryname = countryname.replace(/ /g, "_");
			countryname = countryname.replace(/\,/g, "_");
			countryname = countryname.replace(/\./g, "_");
				return "country "+countryname;
			 	}
				)
			.attr("d", path)
			.attr("id", function(d,i) { return d.id; })
			.attr("title", function(d,i) { return d.properties.name; })
			//.style("fill", function(d, i) { return d.properties.color; })

			.on("click", function(d,i) { 
				//console.log("click="+d.properties.name); 			
				}
				)
			//.style("fill", function(d,i) { return color(d.id); })
			;

		//offsets for tooltips
		//var offsetL = document.getElementById('container_graph').offsetLeft+20;
		//var offsetT = document.getElementById('container_graph').offsetTop+10;
		var offsetL = document.getElementById(self.parentSelect.replace("#",'')).offsetLeft+20;
		var offsetT = document.getElementById(self.parentSelect.replace("#",'')).offsetTop+10;
		

		//tooltips
		country
			.on("mousemove", function(d,i) {
				//console.log(d.properties.name);
				
				d3.select(this).style("fill", "RED");
				
				var mouse = d3.mouse(self.svg.node()).map( function(d) { return parseInt(d); } );
				
				tooltip.style("opacity",1.0).html(d.properties.name);
				//tooltip.style("opacity",1.0).html("textTooltip");
				
				/*
				tooltip.classed("opacity", 1.0)
					.attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
					.html(d.properties.name);
				*/
			})
			.on("mouseout",  function(d,i) {	
				d3.select(this).style("fill", "Black");			
				tooltip.style("opacity",0.0);
      		})
      		//.style("fill", function(d,i) { return color(d.id); })
      		; 


		//EXAMPLE: adding some capitals from external CSV file
		d3.csv("/app/modules/visualization/json/country-capitals.csv", function(err, capitals) {
			capitals.forEach(function(i){
				addpoint(i.CapitalLongitude, i.CapitalLatitude, i.CapitalName );
			});

		});

	}


	function redraw() 
	{
	/*		
		//width = document.getElementById('container_graph').offsetWidth;
		width = document.getElementById(self.parentSelect.replace("#",'')).offsetWidth;
		height = width / 2;
		d3.select('svg').remove();
		setup(width,height);
		draw(topo);
		*/
	}


	function move() 
	{
		var t = d3.event.translate;
		var s = d3.event.scale; 
		zscale = s;
		var h = height/4;

		t[0] = Math.min(
			(width/height)  * (s - 1), 
    		Math.max( width * (1 - s), t[0] )
  		);

  		t[1] = Math.min(
    		h * (s - 1) + h * s, 
    		Math.max(height  * (1 - s) - h * s, t[1])
  		);

  		zoom.translate(t);
  		g.attr("transform", "translate(" + t + ")scale(" + s + ")");

		//adjust the country hover stroke width based on zoom level
  		d3.selectAll(".country").style("stroke-width", 1.5 / s);

	}


	var throttleTimer;
	function throttle() {
  		window.clearTimeout(throttleTimer);
    	throttleTimer = window.setTimeout(function() {
      	redraw();
    	}, 200);
	}


	//geo translation on mouse click in map
	function click() {
  		var latlon = projection.invert(d3.mouse(this));
  		console.log(latlon);
	}


	//function to add points and text to the map (used in plotting capitals)
	function addpoint(lat,lon,text) {
  		var gpoint = g.append("g").attr("class", "gpoint");
  		var x = projection([lat,lon])[0];
		var y = projection([lat,lon])[1];

  		gpoint.append("svg:circle")
        	.attr("cx", x)
        	.attr("cy", y)
        	.attr("class","point")
        	.attr("r", 2)
        	.style("fill", "blue")
        	;

		//conditional in case a point has no associated text
		if(text.length>0){
    		gpoint.append("text")
				.attr("x", x+5)
				.attr("y", y+2)
				.attr("class","text")
				.style("fill", "blue")
				.text(text);
  		}

	}

}


	/*** funtion to init. graph ***/	   
    self.init = function () {
	}
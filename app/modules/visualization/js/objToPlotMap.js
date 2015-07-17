var policycompass = policycompass || {'version':0.1, 'controller':{}, 'viz': {} ,'extras': {} };


   

policycompass.viz.mapW_datamaps = function(options)
{
	var self = {};
    // Get options data
    for (key in options){
    	//console.log(key);
        self[key] = options[key];
    }
    
	//console.log("self.legend="+self.legend);
	//console.log("self.showZoom="+self.showZoom);
	//console.log("self.showBubbles="+self.showBubbles);
	    
	self.parentSelect = self.idName;
	self.parentSelect = self.parentSelect.replace("undefined","");

	//console.log("*************");
	//console.log(self.data);
	//console.log("self.from_country="+self.from_country);
	//console.log("self.to_country="+self.to_country);
	
	//console.log("self.idName");
	//console.log(self.idName);
		
	//console.log("self.parentSelect");
	//console.log(self.parentSelect);
	
	var width = self.width + self.margin.left + self.margin.left;
    var height = self.height + self.margin.top + self.margin.bottom;
	
	self.maxWidth = self.width;
	self.maxHeight = self.height;
	
	self.cntResizes = 0;
	d3.select(window).on('resize', resize);
	//console.log(self.parentSelect);
	function resize() {		
		self.cntResizes = self.cntResizes+1;
		if (self.cntResizes>1)
		{
		
			var element=document.getElementById(self.parentSelect.replace("#",''));
			element.innerHTML = "";		
			console.log(self.parentSelect);
	      	d3.select("#"+self.parentSelect).select("svg").remove();
			
			self.plotMap()
		}
		else
		{
			//self.plotMap();
		}
	}
	
    var zoomFactor = 0.9,
	enabled = true;
              
	var arrayBubbles = [];

	var colors = d3.scale.category10();
    
    var objectColores = {};
    var objectColoresValues = {};
    var listDataToPlot = [];


	function getDate(d) {
    		return new Date(d);
	}


	var dates = {
    	convert:function(d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp) 
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
            d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0],d[1],d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year,d.month,d.date) :
            NaN
        );
    },
    compare:function(a,b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a=this.convert(a).valueOf()) &&
            isFinite(b=this.convert(b).valueOf()) ?
            (a>b)-(a<b) :
            NaN
        );
    },
    inRange:function(d,start,end) {
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
       return (
            isFinite(d=this.convert(d).valueOf()) &&
            isFinite(start=this.convert(start).valueOf()) &&
            isFinite(end=this.convert(end).valueOf()) ?
            start <= d && d <= end :
            NaN
        );
    }
	}
	
	self.plotMap = function () 
	{
		//console.log(self.parentSelect);
		var selection = d3.select("#"+self.parentSelect);
		var clientwidth = selection[0][0].clientWidth;
		if (self.maxWidth<clientwidth)
		{
			//self.width = self.maxWidth;
			width = self.maxWidth + self.margin.left + self.margin.left;
			height = self.maxHeight;
		}
		else
		{	
			width = clientwidth + self.margin.left + self.margin.left;
			var newScale = (self.width) / self.maxWidth;
			//console.log("newScale="+newScale);
			height = self.maxHeight * newScale;
		}
       	
		d3.json("/app/modules/visualization/json/world-topo-min.json", function(error, world)
		{
	  		var countries = topojson.feature(world, world.objects.countries).features;
	  		//console.log(countries);
	  		
	  		var maxValue = 0;
	  		for (di in self.data)  
	  		{
					for (dj in self.data[di].Data)
					{
						if (dates.inRange (getDate(dj), getDate(self.from_country), getDate(self.to_country)))
						{
							//if (d3.max(d3.values(self.data[di].Data))>maxValue)
							//{
							//	console.log(d3.values(self.data[di]));
							//	maxValue = d3.max(d3.values(self.data[di].Data));	
							//}
							if (self.data[di].Data[self.from_country]>maxValue)
							{
								maxValue = self.data[di].Data[self.from_country];							
							}
						}
					}
			}
					
			for (var i=0; i < countries.length; i++) 
	  		{  		
	  			for (di in self.data)  			
				{
					var sum = 0;
					
					
					for (dj in self.data[di].Data)
					{
						//console.log(d3.max(d3.values(self.data[di].Data)));
						
						if (dates.inRange (getDate(dj), getDate(self.from_country), getDate(self.to_country)))
						{						
							if (self.data[di].Title==countries[i].properties.name)
							{
								sum = sum + self.data[di].Data[dj];
								//if (countries[i].properties.name=='Spain')
		  						var latlng = d3.geo.centroid(countries[i]);  				
		  						//arrayBubbles.push({'name': countries[i].properties.name, 'latitude': latlng[1], 'longitude': latlng[0], 'radius': 45, 'fillKey': 'gt500'});  				
		  						//console.log(countries[i].properties.name);
		  						//console.log(d3.geo.centroid(countries[i]));
	  						}
	  					}
	  				}
	  				//console.log(sum);
	  				sum = Math.round(sum,2);
		
					if (sum>0)
					{
						//console.log(self.data[i]);
						//console.log("maxvalue="+maxValue);
						//console.log("sum="+sum);
						//console.log("zoomFactor="+zoomFactor);
						var maxradious = 25;
						var radious = (maxradious*sum) / maxValue;  
						//console.log(radious);
						if (radious<(maxradious/5))
						{
							radious=(maxradious/5);
						}
						
						//var radious = 30;
						if (self.showBubbles)
						{
							arrayBubbles.push({'name': countries[i].properties.name+': '+sum, 'latitude': latlng[1], 'longitude': latlng[0], 'radius': radious, 'fillKey': sum});
						}
						listDataToPlot[self.data[di].Id]= colors(sum);
						//console.log(colors(sum));
						objectColores[sum] = colors(sum);		
					}	
				}
			};
		
			//console.log(arrayBubbles);
			var graticule = d3.geo.graticule();
			
			
			d3.select(self.parentSelect).append("svg").remove();
			
			self.svg = d3.select(self.parentSelect).append("svg")	
				.attr("width", width)
				.attr("height", height)
				.attr("class", "mapa")
				.append("g")			
				;	
	
			var projection;
			var topo,projection,path,svg,g;
			var λ = d3.scale.linear()
		    	//.domain([0, width])
		    	.domain([self.margin.left, self.margin.left+self.width])
		    	.range([-180, 180]);
		
			var φ = d3.scale.linear()
		    	//.domain([0, height])
		    	.domain([self.margin.top, self.height])
		    	.range([90, -90]);
	
			//objectColores['defaultFill']= "#ABDDA4";
			objectColores['defaultFill']= "#cccccc";
	    
			var map_to_plot = new Datamap({
				scope: 'world',
				element: document.getElementById(self.parentSelect),  
				projection: self.projection,
				setProjection: function(element, options) {
				
				lt= 0;
				lg= 40;
				
				
				
				//console.log(self.projection);
					if (self.projection=='mercator')
					{
						projection = d3.geo.mercator()	
							.center([0, 40])
							//.center([lt, lg])
							.translate([(width/2), (height/2)])
							.scale( width / 3.8 / Math.PI)
							.precision(.1);
							
					}		
					else if (self.projection=='conicConformal')
					{
						projection = d3.geo.conicConformal()
						    //.rotate([98, 0])
				    		.center([0, 40])
				    		//.parallels([29.5, 45.5])
				    		//.scale(1000)
				    		.translate([(width/2), (height/2)])
				    		.scale( width / 3 / Math.PI)
				    		//.scale( width / 4 / Math.PI)
				    		//.translate([width / 2, height / 2])
				    		.precision(.1);
					}		
					else if (self.projection=='equirectangular')
					{
						projection = d3.geo.equirectangular()
							.translate([(width/2), (height/2)])				
							.scale( (width) / 3 / Math.PI)
							//.scale( width / 2 / Math.PI)
							.precision(.1);
							;				
							//projection = d3.geo.transverseMercator()
		    				//	.scale((width + 1) / 2 / Math.PI)
		    				//	.translate([width / 2, height / 2]);
					}
					else if (self.projection=='orthographic')
					{
						projection = d3.geo.orthographic()
							//.scale(475)
							.scale( (width) / 2 / Math.PI)
				    		.translate([width / 2, height / 2])
				    		.clipAngle(90)			    
				    		.precision(.1);			
					}
					else if (self.projection=='azimuthalEqualArea')
					{
						projection = d3.geo.azimuthalEqualArea()
						    .clipAngle(180 - 1e-3)
				    		//.scale(237)
				    		.scale( (width) / 2 / Math.PI)
				    		.translate([width / 2, height / 2])
				    		.precision(.1);		
					}
					else
					{
						projection = d3.geo.mercator()
							.translate([(width/2), (height/2)])
							.scale( width / 2 / Math.PI)
							.precision(.1);				
					}
	
	
					path = d3.geo.path().projection(projection);
					//console.log("path");
					//console.log(path);
					
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
				
					/*			
					var lat = 0;
					//if (self.showMovement)
					if (1==1)
					{
			
						setInterval(function(){
						console.log("self.projection="+self.projection+"--lat="+lat);
						//lat = lat +.5
						lat = lat + 5
				 		projection.rotate([lat,0]);
				  		self.svg.selectAll("path")
				      		.attr("d", path)
				      		;
				    
						},50);
						
						
						
				    }	
				    */
	    		
	    			return {path: path, projection: projection};
				},
	  			height: height,
	  			width: width,
	  			//done: function() {
	  				//	
	  			//},
	
			
	        		
			geographyConfig: {
				highlightBorderColor: '#bada55',
	              //popupOnHover: false,
	              highlightOnHover: true,
	              borderColor: '#444',
	              borderWidth: 0.5
	            },
	
				geographyConfig: 
				{
					popupOnHover: !self.small,
	    			highlightOnHover: !self.small		
				
	  			},
	  
	
	/*
	  geographyConfig: {  	
	    highlightBorderColor: '#bada55',
	
	   popupTemplate: function(geography, data) {
	   		return '<div class="hoverinfo">'+ geography.properties.name +'<br/>'+data.value;
	    },
	   
	    highlightBorderWidth: 2
	  },
	    */
	  /*
	  fills: {
	    defaultFill: "#ABDDA4",
	    authorHasTraveledTo: "#fa0fa0"
	  },
	  */
		fills: objectColores,
		//data: {
		//	USA: { fillKey:'color_'+2, value: 2 },
		//	JPN: { fillKey:'color_'+4, value: 4 },
		//	ITA: { fillKey:'color_'+6, value: 6 },
		//	ARG: { fillKey:'color_'+2, value: 2 },
		//	ESP: { fillKey:'color_'+4, value: 4 },
		//	DEU: { fillKey:'color_'+2, value: 2 }
		//},
		done: function(datamap) {
		
			if (self.showZoom)
			{
				datamap.svg.call(d3.behavior.zoom().on("zoom", redraw));
				function redraw() {
						
						datamap.svg.selectAll("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

		               //console.log(self.mode);
		               //console.log(d3.event.translate);
		               //console.log(d3.event.scale);
		               //if ((self.mode=='edit') || (self.mode=='create'))
		               //{
		               //		document.getElementById("centerLatMap").value=d3.event.translate[0];
		               //		document.getElementById("centerLngMap").value=d3.event.translate[1];
					   //		document.getElementById("zoomFactor").value=d3.event.scale;
		               //}
		                 
						//resize bubles. current size / scale map zoom		               
						datamap.svg.selectAll("circle")
						      .attr("r", function(){
						        var self = d3.select(this);
						        
								//console.log(self[0][0]['__data__']['radius']);
						        var r = self[0][0]['__data__']['radius'] / d3.event.scale;  // set radius according to scale
						        //var r = self.radius / d3.event.scale;  // set radius according to scale
						        self.style("stroke-width", r < 4 ? (r < 2 ? 0.5 : 1) : 2);  // scale stroke-width
						        return r;
						    });		     
				               
				}
				
	
				
			}
			
		}
			
	
			
			  
	});
	
	
	
	
	//console.log("---------listDataToPlot---");
	//console.log(listDataToPlot);
	
	if (!self.showBubbles)
	{
		map_to_plot.updateChoropleth(listDataToPlot);
	} 
	  
	/*
	map_to_plot.bubbles([
	 {name: 'Bubble 1', latitude: 21.32, longitude: -7.32, radius: 45, fillKey: 'gt500'},
	 {name: 'Bubble 2', latitude: 12.32, longitude: 27.32, radius: 25, fillKey: 'eq0'},
	 {name: 'Bubble 3', latitude: 0.32, longitude: 23.32, radius: 35, fillKey: 'lt25'},
	 {name: 'Bubble 4', latitude: -31.32, longitude: 23.32, radius: 55, fillKey: 'eq50'},
	], {
	 popupTemplate: function(geo, data) {
	   return "<div class='hoverinfo'>Bubble for " + data.name + "";
	 }
	});
	*/
	
	
	
	map_to_plot.bubbles(arrayBubbles, {
	 popupTemplate: function(geo, data) {
	   return "<div class='hoverinfo'>" + data.name + "";
	 }
	});
	
	/*
	map_to_plot.arc([
	  {
	      origin: {
	          latitude: 40.639722,
	          longitude: -73.778889
	      },
	      destination: {
	          latitude: 37.618889,
	          longitude: -122.375
	      }
	  },
	  {
	      origin: {
	          latitude: 30.194444,
	          longitude: -97.67
	      },
	      destination: {
	          latitude: 25.793333,
	          longitude: -80.290556
	      },
	      options: {
	        strokeWidth: 2,
	        strokeColor: 'rgba(100, 10, 200, 0.4)'
	      }
	  },
	  {
	      origin: {
	          latitude: 39.861667,
	          longitude: -104.673056
	      },
	      destination: {
	          latitude: 35.877778,
	          longitude: -78.7875
	      }
	  }
	],  {strokeWidth: 1, arcSharpness: 1.4});
	          
	*/
	
	
	//map_to_plot.legend();
	//map_to_plot.legend({defaultFillName: 'Undecided'});
	//map_to_plot.legend({legendTitle: 'Map Legend!'});
	
	
	if (self.legend)
	{
	 map_to_plot.legend({
	    legendTitle : "Legend",
	    defaultFillName: "No data",    
	    labels: objectColoresValues,
	  });	
	}
	
	
				
	});

}

	self.plotMap();
}

/*** funtion to init. graph ***/	   
    self.init = function () {
	}
	

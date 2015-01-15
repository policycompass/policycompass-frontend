var policycompass = policycompass || {'version':0.1, 'controller':{}, 'viz': {} ,'extras': {} };


policycompass.viz.mapW_datamaps = function(options)
{
	var self = {};
    // Get options data
    for (key in options){
        self[key] = options[key];
    }
	self.parentSelect = self.idName;
	self.parentSelect = self.parentSelect.replace("undefined","");
	//console.log(self.parentSelect);
	
	var width = self.width + self.margin.left + self.margin.left;
    var height = self.height + self.margin.top + self.margin.bottom;

	var graticule = d3.geo.graticule();

	self.svg = d3.select(self.parentSelect).append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("class", "mapa")
			.append("g")			
			;	

	var projection;
	
	var λ = d3.scale.linear()
	    //.domain([0, width])
	    .domain([self.margin.left, self.margin.left+self.width])
	    .range([-180, 180]);
	
	var φ = d3.scale.linear()
	    //.domain([0, height])
	    .domain([self.margin.top, self.height])
	    .range([90, -90]);
    
            
	
    
var map_to_plot = new Datamap({
  element: document.getElementById(self.parentSelect),  
  projection: self.projection,
	setProjection: function(element) {
	

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
      
      
    var path = d3.geo.path()
      .projection(projection);
    
    return {path: path, projection: projection};
  },
  height: height,
  width: width,
  done: function() {
  
  },
  
  fills: {
    defaultFill: "#ABDDA4",
    authorHasTraveledTo: "#fa0fa0"
  },
  data: {
    USA: { fillKey: "authorHasTraveledTo" },
    JPN: { fillKey: "authorHasTraveledTo" },
    ITA: { fillKey: "authorHasTraveledTo" },
    CRI: { fillKey: "authorHasTraveledTo" },
    KOR: { fillKey: "authorHasTraveledTo" },
    DEU: { fillKey: "authorHasTraveledTo" },
  }
});

var colors = d3.scale.category10();

map_to_plot.updateChoropleth({
    USA: colors(Math.random() * 10),
    RUS: colors(Math.random() * 100),
    AUS: { fillKey: 'authorHasTraveledTo' },
    BRA: colors(Math.random() * 50),
    CAN: colors(Math.random() * 50),
    ZAF: colors(Math.random() * 50),
    IND: colors(Math.random() * 50),
  });

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
          



var lat = 0;
var path = d3.geo.path().projection(projection);



}

/*** funtion to init. graph ***/	   
    self.init = function () {
	}
	

var policycompass = policycompass || {'version':0.1, 'controller':{}, 'viz': {} ,'extras': {} };




policycompass.viz.mapLeaflet = function(options)
{
	
	//console.log(" mapLeaflet");
	
	var self = {};

    // Get options data

    for (key in options){
        self[key] = options[key];
    }
    
    
    //console.log(self.data);
    
    //console.log("self.showBubbles");
	//console.log(self.showBubbles);
	
	d3.select(window).on('resize', resize);
	
	function resize() {
		//console.log("sssssssss");	
		var maxWidth = self.width;
		var maxHeight = self.height;
		self.maxWidth = maxWidth;
		
		windowWidth = window.innerWidth
				|| document.documentElement.clientWidth
				|| document.body.clientWidth;
		
		windowWidth = windowWidth - 40;
		
		if (windowWidth<100)
		{
			windowWidth = 100;
		}
		if (windowWidth>maxWidth)
		{
			windowWidth = maxWidth;
		}
		
		self.windowWidth = windowWidth;
		
		//windowHeight = (500 * windowWidth) / maxWidth;
		windowHeight = (maxHeight * windowWidth) / maxWidth;
		
		document.getElementById('mapPC_'+self.idName).style.width=windowWidth+'px';
		document.getElementById('mapPC_'+self.idName).style.height=windowHeight+'px';

	//document.getElementById('mapPC_'+self.idName).style.position='absolute';
	//document.getElementById('mapPC_'+self.idName).style.top='0';	
	//document.getElementById('mapPC_'+self.idName).style.bottom='0';
	//document.getElementById('mapPC_'+self.idName).style.left='0';
	//document.getElementById('mapPC_'+self.idName).style.right='0';
	document.getElementById('mapPC_'+self.idName).style.background='black';
			
	}
	
    // Object

    

	//console.log(self.idName);
	//console.log("legend="+self.legend);
	//console.log("zoom="+self.showZoom);
	
	if (self.idName=='container_graph_undefined')
	{
		self.idName='container_graph_';
	}
    self.parentSelect = "#"+self.idName;
	


	//console.log(self.idName);
	document.getElementById(self.idName).innerHTML = "<div id='mapPC_"+self.idName+"' class='datamap'></div>";
	resize();
	
	var countriesData = {};
	var countriesDataCircle = {};

	

	//var map = "";

	var initialZoom = 3;
		
	initialZoom = (initialZoom * self.windowWidth) / self.maxWidth;
	initialZoom = Math.round(initialZoom);
		
	//console.log("initialZoom");
	//console.log(initialZoom);
		
	L.Map.include({
			panInsideBounds: function(bounds) {
				bounds = L.latLngBounds(bounds);
				var viewBounds = this.getBounds(),
				    viewSw = this.project(viewBounds.getSouthWest()),
				    viewNe = this.project(viewBounds.getNorthEast()),
				    sw = this.project(bounds.getSouthWest()),
				    ne = this.project(bounds.getNorthEast()),
				    dx = 0,
				    dy = 0,
				    cp;	// compensate for projection (only works for map mercator)
		
			 	if (viewNe.y < ne.y) { // north
					cp = this.latLngToContainerPoint([85.05112878, 0]).y;
					dy = ne.y - viewNe.y + (cp > 0 ? cp : 0);
				}
				if (viewNe.x > ne.x) { // east
					dx = ne.x - viewNe.x;
				}
				if (viewSw.y > sw.y) { // south
					cp = this.latLngToContainerPoint([-85.05112878, 0]).y - this.getSize().y;
					dy = sw.y - viewSw.y + (cp < 0 ? cp : 0);
				}
				if (viewSw.x < sw.x) { // west
					dx = sw.x - viewSw.x;
				}
		
				return this.panBy(new L.Point(dx, dy, true));
			}
		});

   // var map = L.map("mapPC_"+self.idName).setView([49.009952, 2.548635], initialZoom);


		var map = L.map("mapPC_"+self.idName, {
		    layers: [
		    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {        
		        attribution: 'Policy Compass &copy;',
		        noWrap: true
		    })],
		    zoom: initialZoom,
		    center: [49.009952, 2.548635],
		    //center: [49.009952, 0],
		    minZoom: 2, maxZoom: 8,
		    //        maxBounds: [[-90.0,-180.0],[90.0,180.0]]
		    maxBounds: [
		        [-85.0, -180.0],
		        [85.0, 180.0]
		    ]
		
		});
    
		if (!self.showZoom)
		{
			map.touchZoom.disable();
			map.doubleClickZoom.disable();
			map.scrollWheelZoom.disable();
			map.boxZoom.disable();
			map.keyboard.disable();
			$(".leaflet-control-zoom").css("visibility", "hidden");		
			map.scrollWheelZoom.disable();
		}   
		
		
	$.getJSON( "/app/modules/visualization/json/countries.json", function( data ) {

		//console.log("data");
    	//console.log(data);

		//countryData = data;
		//if (map != undefined) { map.remove(); }
		
		
		
		//map = L.map("mapPC_"+self.idName).setView([40, 0], initialZoom);
		
		
		
		countriesData["type"] = "FeatureCollection";
		countriesData["features"] = [];
	
		countriesDataCircle["type"] = "FeatureCollection";
		countriesDataCircle["features"] = [];
		
		self.maxDensityValue = 0;
		self.minDensityValue = 0;
		
				
		var items = [];
  		$.each( data.features, function( key, val ) 
  		{
    		//console.log(val);
    		//if ((data.features[key].id=='ESP') || (data.features[key].id=='ITA'))    		
    		//if (data.features[key].id == self.data[id].Title)
    		if (1==2)    		
    		{
    			//console.log(data.features[key].properties);
    			//console.log(key);
    			var valueCalc = "";
    			if (key>60)
    			{
    				valueCalc = 800
    			}
    			else
    			{
    				var valueCalc = key;
    			}
    		 
	    		data.features[key].properties.density = valueCalc;
    		
    			//data.features[key].properties.popupContent = data.features[key].id;    		
    			//console.log(data.features[key].id);
    		
    			var latlng = d3.geo.centroid(data.features[key]);
    			//console.log(latlng); 
    		    		
    			data.features[key].latlng = latlng;
    		   
    			if (valueCalc>self.maxDensityValue)
    			{
    				self.maxDensityValue = valueCalc;
    			}
    			
    			if (valueCalc<self.minDensityValue)
    			{
    				self.minDensityValue = valueCalc;
    			}
    			
    			
    			
    			
    			if (self.showBubbles)
    			{
	    			countriesDataCircle["features"].push({'density':valueCalc,'geometry':{'type':'Point', "coordinates":latlng}, "type": "Feature",
	            	"properties": {
	                "popupContent": "Data for "+data.features[key].id+"---value="+valueCalc
		            }});
	            }
	            else
	            {
	            	countriesData["features"].push(data.features[key]);
	            }
    		}
  		});





    
    /*
		L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
			maxBounds: [
        		[-85.0, -180.0],
        		[85.0, 180.0]
    		],
    		//zoom: 0,
    		//center: [49.009952, 2.548635],
			minZoom: 2, maxZoom: 8,
			attribution_old: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			attribution: 'Policy Compass &copy;',
			id: 'examples.map-20v6611k'
		}).addTo(map);
*/

		// control that shows state info on hover
		var info = L.control();

		info.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info');
			this.update();
			return this._div;
		};

		if (self.legend)
		{
			info.update = function (props) {
				this._div.innerHTML = '<h4>Policy Compass map chart</h4>' +  (props ?
					'<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
					: 'Hover over a country');
			};
	
			info.addTo(map);
		}

		self.maxValueScale = Math.round(self.maxDensityValue);
		self.minValueScale = Math.round(self.minDensityValue);
		
		self.difMaxMinScale = Math.round((Math.round(self.maxValueScale) - Math.round(self.minValueScale))/8); 
		
		//console.log("max="+self.maxValueScale)
		//console.log("min="+self.minValueScale)

		//console.log("max="+self.maxValueScale)
		//console.log("min="+self.minValueScale)
		
		var color = d3.scale.linear().domain([self.minValueScale, self.maxValueScale]).range(['red', 'blue']);

		
		// get color depending on population density value
		function getColor(d) {
			return d >= self.maxDensityValue ? color(self.maxDensityValue) :
			d > (self.difMaxMinScale*7)  ? color(self.difMaxMinScale*7) :
			d > (self.difMaxMinScale*6)  ? color(self.difMaxMinScale*6) :
			d > (self.difMaxMinScale*5)  ? color(self.difMaxMinScale*5) :
			d > (self.difMaxMinScale*4)   ? color(self.difMaxMinScale*4) :
			d > (self.difMaxMinScale*3)   ? color(self.difMaxMinScale*3) :
			d > (self.difMaxMinScale*2)   ? color(self.difMaxMinScale*2) :
			color(self.minValueScale);
		}

		function style(feature) {
			return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7,
				fillColor: getColor(feature.properties.density)
			};
		}

		function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 5,
				color: '#666',
				dashArray: '',
				fillOpacity: 0.7
			});

			if (!L.Browser.ie && !L.Browser.opera) {
				layer.bringToFront();
			}

			info.update(layer.feature.properties);
		}

		var geojson;

		function resetHighlight(e) {
			geojson.resetStyle(e.target);
			info.update();
		}

		function zoomToFeature(e) {
			map.fitBounds(e.target.getBounds());
		}

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
		}
		
		//descomentar per pintar pasos

		geojson = L.geoJson(countriesData, {
			style: style,
			onEachFeature: onEachFeature
		}).addTo(map);

		//map.attributionControl.addAttribution('Policy Compass &copy;');

		
		if (self.legend)
		{
			var legend = L.control({position: 'bottomright'});
		}


	function onEachFeature(feature, layer) {
		/*
			var popupContent = "<p>I started out as a GeoJSON " +
					feature.geometry.type + ", but now I'm a Leaflet vector!</p>";
		*/
		
		if (self.showBubbles)
		{
			var popupContent = "";
						
			if (feature.properties && feature.properties.popupContent) {
				popupContent += feature.properties.popupContent;
			}
	
			layer.bindPopup(popupContent);
		}
	}

		


	if (self.legend)
	{

		
		
		
		legend.onAdd = function (map) {
			
			
			var div = L.DomUtil.create('div', 'info legend'),
					//grades = [0, 10, 20, 50, 100, 200, 500, 1000],
					grades = [self.minValueScale, (self.difMaxMinScale*2), (self.difMaxMinScale*3), (self.difMaxMinScale*4), (self.difMaxMinScale*5), (self.difMaxMinScale*6), (self.difMaxMinScale*7), self.maxDensityValue],
					labels = [],
					from, to;
	
				for (var i = 0; i < grades.length; i++) {
					from = grades[i];
					to = grades[i + 1];
	
					labels.push(
						'<i style="background:' + getColor(from + 1) + '"></i> ' +
						from + (to ? '&ndash;' + to : '+'));
				}
	
				div.innerHTML = labels.join('<br>');
				return div;
		};

		legend.addTo(map);
	}
	

	//console.log(countriesDataCircle);
	self.maxRadious = 30;
	//console.log("self.maxDensityValue");
	//console.log(self.maxDensityValue);
	//if (self.showBubbles)
	//{
		L.geoJson([countriesDataCircle], {
	
			style: function (feature) {
					return feature.properties && feature.properties.style;
			},
	
			onEachFeature: onEachFeature,
	
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, {
					//radius: 8,
					radius: Math.round((feature.density *self.maxRadious ) / self.maxDensityValue),
					//radius: feature.density,
					fillColor: "#ff7800",
					fillColor: color(feature.density),					
					color: "#000",
					weight: 1,
					opacity: 1,
					fillOpacity: 0.8
				});
			}
		}).addTo(map);
	//}	

	
});

    self.init = function(){



    }

           

    self.init();
    return self;

}
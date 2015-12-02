var policycompass = policycompass || {
        'version': 0.1,
        'controller': {},
        'viz': {},
        'extras': {}
    };


policycompass.viz.mapLeaflet = function (options) {

    //console.log(" mapLeaflet");

    var self = {};

    // Get options data

    for (key in options) {
        self[key] = options[key];
    }

	if ((!self.mode) || (self.mode=='view')) {
		var dom_el = document.querySelector('[ng-controller="VisualizationsEditController"]');
    	var ng_el = angular.element(dom_el);
    	var ng_el_scope = ng_el.scope();	
	}
	else {
		var dom_el = "";
		var ng_el = "";
		var ng_el_scope = "";
	}
    
    if (!self.scaleColor) {
    	self.scaleColor = "#f7941e"
    }

    d3.select(window).on('resize', resize);

    function resize() {
        //console.log("sssssssss");
        var maxWidth = self.width;
        var maxHeight = self.height;
        self.maxWidth = maxWidth;

        windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        windowWidth = windowWidth - 40;

        if (windowWidth < 100) {
            windowWidth = 100;
        }
        if (windowWidth > maxWidth) {
            windowWidth = maxWidth;
        }


        self.windowWidth = windowWidth;

        //windowHeight = (500 * windowWidth) / maxWidth;
        windowHeight = (maxHeight * windowWidth) / maxWidth;


        document.getElementById('mapPC_' + self.idName).style.width = windowWidth + 'px';
        document.getElementById('mapPC_' + self.idName).style.height = windowHeight + 'px';
        document.getElementById('mapPC_' + self.idName).style.background = '#fafafa';


    }

    if (self.idName == 'container_graph_undefined') {
        self.idName = 'container_graph_';
    }
    self.parentSelect = "#" + self.idName;


    if (!document.getElementById("mapPC_"+self.idName))	{
    	document.getElementById(self.idName).innerHTML = "<div id='mapPC_" + self.idName + "' class='datamap'></div>";
	}
	
    resize();

    var countriesData = {};
    var countriesDataCircle = {};


    //var map = "";
    if (self.initialZoom > 0) {
        var initialZoom = self.initialZoom;
    } else {
        var initialZoom = 2;
    }


    initialZoom = (initialZoom * self.windowWidth) / self.maxWidth;
    initialZoom = Math.round(initialZoom);

    var initialLat = 49.009952;
    if (self.initialLat != 'undefined') {
        if (self.initialLat) {
            var initialLat = self.initialLat;
        }
    }

    var initialLng = 2.548635;
    if (self.initialLng != 'undefined') {
        if (self.initialLng) {
            var initialLng = self.initialLng;
        }
    }

	//remove info divs
	var elements = document.getElementsByClassName("info_"+self.idName);
	while(elements.length > 0) {
       	elements[0].parentNode.removeChild(elements[0]);
    }
    //remove legend divs
	var elements = document.getElementsByClassName("legend_"+self.idName);
	while(elements.length > 0) {
       	elements[0].parentNode.removeChild(elements[0]);
    }
    //remove elements divs
	var elements = document.getElementsByClassName("leaflet-clickable");
	while(elements.length > 0) {
       	elements[0].parentNode.removeChild(elements[0]);
    }
    
	//used to check if map exist
	if (ng_el_scope.map != undefined) {
		ng_el_scope.reload = true;
		var map = ng_el_scope.map; 
	}
	else {	    
	    var map = L.map("mapPC_" + self.idName, {
	        layers: [
	            L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	                //attribution: 'Policy Compass &copy;',
	                noWrap: true
	            })
	        ],
	        zoom: initialZoom,
	        center: [initialLat, initialLng], //center: [49.009952, 0],
	        minZoom: 1,
	        maxZoom: 8,
	        maxBounds: [[-90.0, -180.0], [90.0, 180.0]]
	        //maxBounds: [[-85.0, -180.0],[85.0, 180.0]]
	
	    });
	}

	if (!ng_el_scope.reload) {	
    	L.control.pan().addTo(map);
    	L.control.scale().addTo(map);
	}
	
	ng_el_scope.map=map;
	
    map.on('zoomend', function () {
        document.getElementById('initialZoom').value = map.getZoom();
        document.getElementById('initialLat').value = map.getCenter().lat;
        document.getElementById('initialLng').value = map.getCenter().lng;
    });

    map.on('moveend', function () {
        document.getElementById('initialLat').value = map.getCenter().lat;
        document.getElementById('initialLng').value = map.getCenter().lng;
    });

    if (!self.showZoom) {
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
        $(".leaflet-control-zoom").css("visibility", "hidden");
        map.scrollWheelZoom.disable();
    }
    else {
		map.touchZoom.enable();
		map.doubleClickZoom.enable();
		map.scrollWheelZoom.enable();
		map.boxZoom.enable();
		map.keyboard.enable();
		$(".leaflet-control-zoom").css("visibility", "visible");		
		map.scrollWheelZoom.enable();			
	} 

    plotChartMap = function () {


        data = arguments[1];
        countriesDataCollection = arguments[2];

        countriesData["type"] = "FeatureCollection";
        countriesData["features"] = [];

        countriesDataCircle["type"] = "FeatureCollection";
        countriesDataCircle["features"] = [];

        self.maxDensityValue = 0;
        self.minDensityValue = 0;


        var items = [];
        $.each(data.features, function (key, val) {

            for (id = 0; id < self.data.length; id++) {

                if (data.features[key].id == self.data[id].Id)
                {
                    var valueCalc = "";
                    
                    for (variable in self.data[id].Data) {
                        //console.log(variable)
                        if (variable == self.from_country) {
                            valueCalc = self.data[id].Data[variable];
                        }
                    }


                    if (!valueCalc) {
                        //console.log("no data");
                    } else {
                        data.features[key].properties.density = valueCalc;

                        var latlng = [];

                        //console.log(data.features[key].id)
                        var getCenter = true;

                        if (self.showBubbles) {
                            for (var country_j = 0; country_j < countriesDataCollection.length; country_j++) {
                                //console.log(countriesData[country_j]['alpha3Code']);
                                if (data.features[key].id == countriesDataCollection[country_j]['alpha3Code']) {
                                    //console.log("DINS!!!");
                                    var latlngTmp = [];
                                    latlngTmp = countriesDataCollection[country_j]['latlng'];
                                    latlng[1] = latlngTmp[0];
                                    latlng[0] = latlngTmp[1];

                                    getCenter = false;
                                }
                            }
                        }

                        if (getCenter) {
                            latlng = d3.geo.centroid(data.features[key]);
                        }
                        //console.log(latlng);

                        data.features[key].latlng = latlng;

                        if (valueCalc > self.maxDensityValue) {
                            self.maxDensityValue = valueCalc;
                        }

                        if (valueCalc < self.minDensityValue) {
                            self.minDensityValue = valueCalc;
                        }


                        if (self.showBubbles) {
                            countriesDataCircle["features"].push({
                                'density': valueCalc,
                                'geometry': {
                                    'type': 'Point',
                                    "coordinates": latlng
                                },
                                "type": "Feature",
                                "properties": {
                                    "popupContent": data.features[key].properties.name + " (" + data.features[key].id + "): " + valueCalc
                                }
                            });

                        } else {
                            countriesData["features"].push(data.features[key]);
                        }
                    }
                }


            }


        });


        // control that shows state info on hover
        var info = L.control();

        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info info_'+self.idName);
            this.update();
            return this._div;
        };

        if (self.legend) {
            info.update = function (props) {
                /*
                 this._div.innerHTML = '<h4>Policy Compass </h4>' +  (props ?
                 '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
                 : 'Hover over a country');
                 */
                this._div.innerHTML = 'Data for: ' + self.from_country;

            };
			
			//remove info divs
			var elements = document.getElementsByClassName("info_"+self.idName);
			while(elements.length > 0) {
        		elements[0].parentNode.removeChild(elements[0]);
        	}
        
            info.addTo(map);
        }

        self.maxValueScale = Math.round(self.maxDensityValue);
        self.minValueScale = Math.round(self.minDensityValue);

        self.difMaxMinScale = Math.round((Math.round(self.maxValueScale) - Math.round(self.minValueScale)) / 8);


        function ColorLuminance(hex, lum) {
            // validate hex string
            hex = String(hex).replace(/[^0-9a-f]/gi, '');
            if (hex.length < 6) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            lum = lum || 0;
            // convert to decimal and change luminosity
            var rgb = "#", c, i;
            for (i = 0; i < 3; i++) {
                c = parseInt(hex.substr(i * 2, 2), 16);
                c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                rgb += ("00" + c).substr(c.length);
            }

            return rgb;
        }

        var lighterColor = ColorLuminance(self.scaleColor.replace('#', ''), 0.8);	// "#7ab8f5" - 20% lighter
        var darkerColor = ColorLuminance(self.scaleColor.replace('#', ''), -0.8);	// "#334d66" - 50% darker

        var color = d3.scale.linear().domain([self.minValueScale, self.maxValueScale]).range([
            lighterColor, darkerColor
        ]);

        // get color depending on population density value
        function getColor(d) {
            return d >= self.maxDensityValue ? color(self.maxDensityValue) : d > (self.difMaxMinScale * 7) ? color(self.difMaxMinScale * 7) : d > (self.difMaxMinScale * 6) ? color(self.difMaxMinScale * 6) : d > (self.difMaxMinScale * 5) ? color(self.difMaxMinScale * 5) : d > (self.difMaxMinScale * 4) ? color(self.difMaxMinScale * 4) : d > (self.difMaxMinScale * 3) ? color(self.difMaxMinScale * 3) : d > (self.difMaxMinScale * 2) ? color(self.difMaxMinScale * 2) : color(self.minValueScale);
        }

        function style(feature) {
            return {
                weight: 2, //opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 1,
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


        if (self.legend) {
            var legend = L.control({position: 'bottomright'});
        }


        function onEachFeature(feature, layer) {
            /*
             var popupContent = "<p>I started out as a GeoJSON " +
             feature.geometry.type + ", but now I'm a Leaflet vector!</p>";
             */

            if (self.showBubbles) {
                var popupContent = "";

                if (feature.properties && feature.properties.popupContent) {
                    popupContent += feature.properties.popupContent;
                }

                layer.bindPopup(popupContent);
            }
        }


        if (self.legend) {


            legend.onAdd = function (map) {


                var div = L.DomUtil.create('div', 'info legend legend_'+self.idName);
                var grades = [
                        self.minValueScale,
                        (self.difMaxMinScale * 2),
                        (self.difMaxMinScale * 3),
                        (self.difMaxMinScale * 4),
                        (self.difMaxMinScale * 5),
                        (self.difMaxMinScale * 6),
                        (self.difMaxMinScale * 7),
                        self.maxDensityValue];
                var labels = [];
                var from;
                var to;

                for (var i = 0; i < grades.length; i++) {
                    from = grades[i];
                    to = grades[i + 1];

                    labels.push('<i style="background:' + getColor(from + 1) + '"></i> ' + from + (to ? '&ndash;' + to : '+'));
                }

                div.innerHTML = labels.join('<br>');
                return div;
            };


    		//remove legend divs
			var elements = document.getElementsByClassName("legend_"+self.idName);
			while(elements.length > 0) {
	        	elements[0].parentNode.removeChild(elements[0]);
    		}
    		
            legend.addTo(map);
        }


        self.maxRadious = 30;
        self.minRadious = 3;

        L.geoJson([countriesDataCircle], {

            style: function (feature) {
                return feature.properties && feature.properties.style;
            },

            onEachFeature: onEachFeature,

            pointToLayer: function (feature, latlng) {

                var radiumCircle = Math.round((feature.density * self.maxRadious ) / self.maxDensityValue);
                if (radiumCircle < self.minRadious) {
                    radiumCircle = self.minRadious;
                }

                return L.circleMarker(latlng, {
                    radius: radiumCircle, //radius: feature.density,
                    fillColor: getColor(feature.density),
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 1
                });
            }
        }).addTo(map);

    }

    var q = queue();
    var pathToJson = "/app/modules/visualization/json/countries.json";
    q = q.defer(d3.json, pathToJson);

    var pathToJson = "/app/modules/visualization/json/countriesData.json";
    q = q.defer(d3.json, pathToJson);

    q.await(plotChartMap);



    return self;

}

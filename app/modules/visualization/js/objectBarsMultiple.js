"use strict";
var policycompass = policycompass || {
        'version': 0.1,
        'controller': {},
        'viz': {},
        'extras': {}
    };

policycompass.viz.barsMultiple = function (options) {

    var self = {};

    function mouseout() {
    	tooltip.style("opacity", 1.0).html("");
        tooltip.style("opacity", 0.0);
    }
    
    for (var key in options) {
        self[key] = options[key];
    }

    if (!self.resolution) {
        self.resolution = 'day';
    }
	
	//self.margin.bottom = 55;
	
    self.parentSelect = "#" + self.idName;

    self.maxMargin = self.margin;
    self.maxWidth = self.width;
    self.maxHeight = self.height;
    self.maxFont_size = self.font_size;

    self.cntResizes = 0;
    d3.select(window).on('resize', resize);

    function resize() {
        self.cntResizes = self.cntResizes + 1;
        if (self.cntResizes > 1) {
            var element = document.getElementById(self.parentSelect.replace("#", ''));
            element.innerHTML = "";
            self.init();
            self.render(self.dataIn, self.eventsData);
        } else {
            self.init();
        }
    }


	var plotEventsBarChart = function (eventsData) {
		
		/*************Ini plot historical events *******/	
		
		if (self.showLegend)
		{		
			var historicalEvents = self.svg.selectAll("rectagles").data(eventsData);
			
			var valueX = (self.margin.left)*2+((self.width/2));
			//console.log(valueX);
			//console.log(eventsData.length);
			if (eventsData.length>0) {
				//add title of legend			
				self.svg.append("text")
	                .attr("x", function (d, i) {
	                    return valueX;
	                })
	                .attr("y", function (d, i) {
	                    var valueY = (self.height) + self.margin.topIni + 30 ;
						return valueY;
	                })
	                .attr("text-anchor", "center")
	                .attr("class", function() {
	                })
	                .attr("font-size", self.font_size+1)
	                .style("fill", function (d, i) {
	                    var colorToReturn = "black";
	                    return colorToReturn;
	                })
	                .text(function (d, i) {
	                    var resTRext = "Events";
	                    
	                    return resTRext;
	                });
			
	            //add legend events 				
				historicalEvents.enter().append("rect")
					.attr("x", valueX - 10)
					.attr("y", function (d, i) {                    	
						//var valueY = (self.height) + self.margin.topIni + 30 + (i) * 20 + (20 * self.dataToPlotLength );
						var valueY = (self.height) + self.margin.topIni + 30 + (i+1) * 20;
						return valueY - 5;
					})		
					.attr("width", 5)
					.attr("height", 5)
					.style("fill", function (d, i) {    				
	    				var colorToReturn = d.color;
	    				return colorToReturn;
					});


				historicalEvents.enter().append("text")
	                    .attr("x", function (d, i) {
	                        return valueX;
	                    })
	                    .attr("y", function (d, i) {
	                        //var valueY = (self.height) + self.margin.topIni + 30 + (i) * 20 + (20 * self.dataToPlotLength );
	                        var valueY = (self.height) + self.margin.topIni + 30 + (i+1) * 20;
							return valueY;
	                    })
	                    .attr("text-anchor", "center")
	                    .attr("class", function() {
	                    })
	                    .attr("font-size", self.font_size+1)
	                    .style("fill", function (d, i) {
	                        var colorToReturn = d.color;
	                        return colorToReturn;
	                    })
	                    .on("mouseover", function (d, i) {
	                    	
							var str = "Event: " + d.title;
							var fromDate = "From: " +d.startDate;
							var toDate = "To: " +d.endDate;
							var desc = "Desc.: " +d.desc;
							
							tooltip.style("opacity", 1.0).html('<div class="tooltip-arrow"></div><div class="tooltip-inner ng-binding" ng-bind="content">' + str + '<br/>'+fromDate+'<br/>'+toDate+'<br/>'+desc+'</div>');
	                        d3.selectAll(".event_circle_"+i).style("stroke-width", self.radius+1);
	                    	
	                    })
	                    .on("mouseout", function (d, i) {
							mouseout();
							d3.selectAll(".event_circle_"+i).style("stroke-width", self.radius);
	                    })
	                    .text(function (d, i) {
	                        //var resTRext = d.title;	                        
	                        //return resTRext;

							var trimmedString = d.title;
            				var length = 80;
            				if (trimmedString.length > length) {
								trimmedString = trimmedString.substring(0, length) + "...";
							}
            
            				return trimmedString;
	                        
	                    })
	                    .on("click", function () {
	                        if (document.getElementById("addHEbutton")) {
	                        	document.getElementById("addHEbutton").click();
	                        }	                        
	                    });
             }   
		}

			
		var dataForCircles = [];
		
		dataForCircles = eventsData;
		/*
		for (var i in eventsData) {
			
			if (eventsData[i].startDate) {			
				var arrayObjDateStart = eventsData[i].startDate.split("-");
							
	            var arrayTemporal = [];
	            arrayTemporal['index'] = i;
	            arrayTemporal['color'] = eventsData[i].color;
	            arrayTemporal['title'] = eventsData[i].title;
	            arrayTemporal['startDate'] = eventsData[i].startDate;
	            arrayTemporal['endDate'] = eventsData[i].endDate;
	            
	            //console.log(eventsData[i].startDate);
	            
	            if (self.resolution=='day') {
	            	arrayTemporal['posx'] = eventsData[i].startDate;            	
	            }
	            else if (self.resolution=='month') {
	            	arrayTemporal['posx'] = arrayObjDateStart[0]+"-"+arrayObjDateStart[1];           	
	            }
	            else if (self.resolution=='year') {            	
	            	arrayTemporal['posx'] = arrayObjDateStart[0];           	
	            }
	            else if (self.resolution == 'quarter') {
	            	var extraString = "";
	            	if (arrayObjDateStart[1]<=3) {
	            		extraString = "Q1"
	            	}
	            	else if (arrayObjDateStart[1]<=6) {
	            		extraString = "Q2"
	            	}
	            	else if (arrayObjDateStart[1]<=9) {
	            		extraString = "Q3"
	            	}
	            	else if (arrayObjDateStart[1]<=12) {
	            		extraString = "Q4"
	            	}
	            	arrayTemporal['posx'] = arrayObjDateStart[0]+"-"+extraString;
	            }
	
	            arrayTemporal['posY'] = 0;
	            arrayTemporal['desc'] = eventsData[i].desc;
	            dataForCircles[i] = arrayTemporal;
            
           }
        }
		*/
		var historicalEventsCircles = self.svg.selectAll("circles").data(dataForCircles);
		
		//self.radius = 4;

		var rectangle = self.svg.append("rect")
			.style("stroke", "black")
  			.style("fill", "none")
  			.style("stroke-width", 1)
  			.attr("x", 0)
  			.attr("y", -((self.maxEventsByPeriod+1) * self.spaceBetweenEvents)+(self.spaceBetweenEvents/2))
  			.attr("width", self.width)
  			.attr("height", ((self.maxEventsByPeriod) * self.spaceBetweenEvents));

		self.svg.append("text")
			.attr("x", 2)
			.attr("y", -((self.maxEventsByPeriod+1) * self.spaceBetweenEvents)+(self.spaceBetweenEvents/2)-2)
			.attr("text-anchor", "center")
			.attr("font-size", self.font_size+1)
			.style("fill", function (d, i) {
				var colorToReturn = "black";
				return colorToReturn;
			})
			.text(function (d, i) {
				var resTRext = "Events";
				return resTRext;
			});
		
		var offset = (self.labelY.length * self.x1.rangeBand()/2);
		var range = (self.labelY.length * self.x1.rangeBand()/2)*2;

		if (self.groupby == 'Individual') {
			
			range = range / self.xAxisDataToIndividuals.length;
			
			self.xAxisDataToIndividuals.forEach(function (d, i) {

				var resTRext = d.split("_");
				var posXEvent = self.x0(resTRext[0]);
	
				var cnt_events_by_period = [];
	
				historicalEventsCircles.enter().append("rect")
					.attr("class", function (d, i) {
						var className = "lineXDisco event_circle_"+d.index;
						return className;
					})
					.style("stroke", function (d, i) {
						var colorToReturn;
						colorToReturn = d.color;	
						return colorToReturn;
					})	
					.style("stroke-width", function (d, i) {
						return self.radius;
					})				
					.style("fill", function (d, i) {
                		var colorToPlot = d.color;
                		return colorToPlot;
            		})
            		.attr("x", function (d, i) {
						//var returnValue = self.x0(d.posx);						
						//return x0(resTRext[0]) + x1(d.ValueX);						
						var returnValue = posXEvent+self.x1(d.posx);
						return returnValue;					
            		})
            		.attr("y", function (d, i) {            	
						var a = cnt_events_by_period.indexOf(d.posx);				
						if (cnt_events_by_period[d.posx]) {
							cnt_events_by_period[d.posx] = cnt_events_by_period[d.posx] +1;
						}
						else {					
							cnt_events_by_period[d.posx] = 1;	
						}
						//var returnValue = -10 + (self.radius*4)*(cnt_events_by_period[d.posx]-1);				
						var returnValue = -(self.maxEventsByPeriod * self.spaceBetweenEvents) + (self.spaceBetweenEvents)*(cnt_events_by_period[d.posx]-1);
						//console.log(returnValue);
						return returnValue;	
            		})
            		.attr("width", function (d, i) {
            			//var returnValue = self.x0(d.posx);
            			var returnValue = 10;
            			//to avoid plot events out of the range
            			returnValue = range;
            			/*
            			if (returnValue>0) {
            				returnValue = range;
            			}
            			else {
            				returnValue = 0;
            			}
            			*/
            			return returnValue;
            		})
            		.attr("height", function (d, i) {
            			return 1;
            		})
            		.on("mouseover", function (d, i) {			
						d3.selectAll(".event_circle_"+d.index).style("stroke-width", self.radius+1);				
						var str = "Event: " + d.title;
						var fromDate = "From: " +d.startDate;
						var toDate = "To: " +d.endDate;
						var desc = "Desc.: " +d.desc;
						if ((self.modeGraph == 'view') || (self.xaxeformat == 'sequence')) { 
							tooltip.style("opacity", 1.0).html('<div class="tooltip-arrow"></div><div class="tooltip-inner ng-binding" ng-bind="content">' + str + '<br/>'+fromDate+'<br/>'+toDate+'<br/>'+desc+'<br/></div>');
						}
						else {
							tooltip.style("opacity", 1.0).html('<div class="tooltip-arrow"></div><div class="tooltip-inner ng-binding" ng-bind="content">' + str + '<br/>'+fromDate+'<br/>'+toDate+'<br/>'+desc+'</div>');
						}					
					})
            		.on("mouseout", function (d, i) {
						mouseout();
						d3.selectAll(".event_circle_"+d.index).style("stroke-width", self.radius);
					})
            		;
			});
		}
		else {
			//plot gouped by date
			var cnt_events_by_period = [];
			
			historicalEventsCircles.enter().append("rect")
				.attr("class", function (d, i) {
					var className = "lineXDisco event_circle_"+d.index;
					return className;
				})
				.style("stroke", function (d, i) {
					var colorToReturn;
					colorToReturn = d.color;	
					return colorToReturn;
				})	
				.style("stroke-width", function (d, i) {
					return self.radius;
				})
				.style("fill", function (d, i) {
                	var colorToPlot = d.color;
                	return colorToPlot;
            	})
            	.attr("x", function (d, i) {
					var returnValue = self.x0(d.posx);						
					return returnValue;					
            	})
            	.attr("y", function (d, i) {            	
					var a = cnt_events_by_period.indexOf(d.posx);				
					if (cnt_events_by_period[d.posx]) {
						cnt_events_by_period[d.posx] = cnt_events_by_period[d.posx] +1;
					}
					else {					
						cnt_events_by_period[d.posx] = 1;	
					}
					//var returnValue = -10 + (self.radius*4)*(cnt_events_by_period[d.posx]-1);				
					var returnValue = -(self.maxEventsByPeriod * self.spaceBetweenEvents) + (self.spaceBetweenEvents)*(cnt_events_by_period[d.posx]-1);
					//console.log(returnValue);
					return returnValue;	
            	})
            	.attr("width", function (d, i) {
            		var returnValue = self.x0(d.posx);
            		//to avoid plot events out of the range
            		if (returnValue>0) {
            			returnValue = range;
            		}
            		else {
            			returnValue = 0;
            		}
            		return returnValue;
            	})
            	.attr("height", function (d, i) {
            		return 1;
            	})
            	.on("mouseover", function (d, i) {			
					d3.selectAll(".event_circle_"+d.index).style("stroke-width", self.radius+1);				
					var str = "Event: " + d.title;
					var fromDate = "From: " +d.startDate;
					var toDate = "To: " +d.endDate;
					var desc = "Desc.: " +d.desc;
					if ((self.modeGraph == 'view') || (self.xaxeformat == 'sequence')) { 
						tooltip.style("opacity", 1.0).html('<div class="tooltip-arrow"></div><div class="tooltip-inner ng-binding" ng-bind="content">' + str + '<br/>'+fromDate+'<br/>'+toDate+'<br/>'+desc+'<br/></div>');
					}
					else {
						tooltip.style("opacity", 1.0).html('<div class="tooltip-arrow"></div><div class="tooltip-inner ng-binding" ng-bind="content">' + str + '<br/>'+fromDate+'<br/>'+toDate+'<br/>'+desc+'</div>');
					}					
				})
            	.on("mouseout", function (d, i) {
					mouseout();
					d3.selectAll(".event_circle_"+d.index).style("stroke-width", self.radius);
				})
            	;
		}		
		/*
		//plot a circle in the beggin and in the end of the "event" line		
		for (var iHE=1;iHE<=2; iHE=iHE+1) {
			var cnt_events_by_period = [];	
		
		
			historicalEventsCircles.enter().append("circle")
				.attr("cx", function (d, i) {
					var retunrDate='';
					if (iHE==1) {
						retunrDate = self.x0(d.posx);	
					}
					else {
						retunrDate = self.x0(d.posx) + (range);
					}
										
					//console.log(retunrDate);					
					return retunrDate;					
					//return x0(resTRext[0]) + x1(d.Key);
				})
				.style("opacity", 1)
				.attr("cy", function (d, i) {								
					var a = cnt_events_by_period.indexOf(d.posx);				
					if (cnt_events_by_period[d.posx]) {
						cnt_events_by_period[d.posx] = cnt_events_by_period[d.posx] +1;
					}
					else {					
						cnt_events_by_period[d.posx] = 1;	
					}
					//var returnValue = -10 + (self.radius*4)*(cnt_events_by_period[d.posx]-1);
					var returnValue = -(self.maxEventsByPeriod * self.spaceBetweenEvents) + (self.spaceBetweenEvents)*(cnt_events_by_period[d.posx]-1);
					return returnValue;
				})
				//.attr("r", 0)
				.attr("r", self.radius)
				.attr("class", function (d, i) {
					var className = "lineXDisco event_circle_"+d.index;
					return className;
				})
				.style("stroke-width", self.radius)
				.style("stroke", function (d, i) {
					var colorToReturn;
					colorToReturn = d.color;	
					return colorToReturn;
				})
				.on("mouseover", function (d, i) {			
					d3.selectAll(".event_circle_"+d.index).style("stroke-width", self.radius+1);				
					var str = "Event: " + d.title;
					var fromDate = "From: " +d.startDate;
					var toDate = "To: " +d.endDate;
					var desc = "Desc.: " +d.desc;
					if ((self.modeGraph == 'view') || (self.xaxeformat == 'sequence')) { 
						tooltip.style("opacity", 1.0).html('<div class="tooltip-arrow"></div><div class="tooltip-inner ng-binding" ng-bind="content">' + str + '<br/>'+fromDate+'<br/>'+toDate+'<br/>'+desc+'<br/></div>');
					}
					else {
						tooltip.style("opacity", 1.0).html('<div class="tooltip-arrow"></div><div class="tooltip-inner ng-binding" ng-bind="content">' + str + '<br/>'+fromDate+'<br/>'+toDate+'<br/>'+desc+'</div>');
					}					
				})
				.on("mouseout", function (d, i) {
					mouseout();
					d3.selectAll(".event_circle_"+d.index).style("stroke-width", self.radius);
				})
				//.transition().attr("r", self.radius).duration(2000)	
		}
		*/
        /******** end plot historical events ***********/		
	}

    self.drawBarsMultiple = function (bars, eventsData) {

        var showAsPercentatge = self.showAsPercentatge;

        self.arrayFirstValuesKey = [];
        self.arrayFirstValuesValue = [];
        if (showAsPercentatge) {

            bars.forEach(function (d, i) {

                var a = self.arrayFirstValuesKey.indexOf(bars[i].Key);

                if (a < 0) {
                    var iniValue = bars[i].ValueY;
                    self.arrayFirstValuesKey.push(bars[i].Key);
                    self.arrayFirstValuesValue.push(bars[i].ValueY);

                } else {
                    var iniValue = self.arrayFirstValuesValue[a];
                }

                if (iniValue != 0) {

                    var valueTMP = ((bars[i].ValueY - iniValue) / iniValue) * 100;

                    bars[i].From = valueTMP;
                    bars[i].Value = valueTMP;
                    bars[i].ValueY = valueTMP;
                    bars[i].XY = bars[i].To + "|" + valueTMP;

                }
            });
        }

        var showLegend = self.showLegend;
        var showLabels = self.showLabels;
        var showGrid = self.showGrid;

        var colorScale = d3.scale.category20();
        var valuesY = [];

        bars.forEach(function (d, i) {
            //valuesY.push(parseInt(d.ValueY));
            valuesY.push((d.ValueY));
        });

        var maxV = d3.max(d3.values(valuesY));
        var minVy = d3.min(d3.values(valuesY));
        var x0 = d3.scale.ordinal().rangeRoundBands([0, self.width], .1);
        var x1 = d3.scale.ordinal();
        var y = d3.scale.linear().range([self.height, 0]);
        var yInversa = d3.scale.linear().range([0, self.height]);
        var color = d3.scale.category20();
        var xAxis = d3.svg.axis().scale(x0).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

		function wrap(text, width) {

			text.each(function() {
		    	var text = d3.select(this),
		        words = text.text().split(/\s+/).reverse(),
		        word,
		        line = [],
		        lineNumber = 0,
		        lineHeight = 1.1, // ems
		        y = text.attr("y"),
		        dy = parseFloat(text.attr("dy"));

		        var colorLegend = '#000';

		        self.dataIn.forEach(function (d, i) {

            		var resTRext = d.Key.split("_");

            		if (resTRext[0]==text[0][0]['__data__']) {
            			colorLegend = d.Color;
            		}
        		});
		        
		        var tspan = text.style("fill",colorLegend).text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
		    
		    	while (word = words.pop()) {
					line.push(word);
		      		tspan.text(line.join(" "));
		      		if (tspan.node().getComputedTextLength() > width) {
		        		line.pop();
		        		tspan.text(line.join(" "));
		        		line = [word];
		        		tspan = text.style("fill", colorLegend).append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		      		}
		    	}
		  	});
		}

        var xAxisData = d3.set(bars.map(function (line) {
        	//console.log(line.ValueX);
            //return line.ValueX;
            if (self.groupby == 'Individual') {
            	return line.ValueX;
            }
            else {
            	return line.Key;
            }
            
        })).values();


        self.xAxisDataToIndividuals = d3.set(bars.map(function (line) {
            	return line.Key;
        })).values();
        		
		
		var xAxisDataColor = d3.set(bars.map(function (line) {
            return line.Color;
        })).values();

        function make_x_axis() {
            return d3.svg.axis().scale(x0).orient("bottom").ticks(20)
        }

        function make_y_axis() {
            return d3.svg.axis().scale(y).orient("left").ticks(20)
        }

        x0.domain(bars.map(function (d) {
            //var resTRext = .split("_");
            //var resTRext = d.Key.split("_");
            if (self.groupby == 'Individual') {
            	var resTRext = d.Key.split("_");
            }
            else {
            	var resTRext = d.To.split("_");
            }
                                  
            //console.log(resTRext);
            var trimmedString = resTRext[0];
            
            var length = 120;
            if (trimmedString.length > length) {
				trimmedString = trimmedString.substring(0, length) + "...";
			}
			
            //console.log(trimmedString);
            return trimmedString;
        }));
		/*
		var legendsColumn = 0;
		if (self.showLegend) {
			legendsColumn = Math.ceil(xAxisData.length / 9);
		} else {
			legendsColumn = 0;
		}		
		
		self.margin.bottom = 55 + (legendsColumn+1) * 20;
		*/		
		//console.log(self.margin.bottom);
		//self.legendsColumn = legendsColumn;
		//console.log(self.margin.bottom);
        self.svg = d3.select(self.parentSelect)
        .append("svg")
        .attr("class", "pc_chart")
        .attr("width", self.width + self.margin.left + self.margin.right + self.extraWidth)
        .attr("height", self.height + self.margin.top + self.margin.bottom)        
        .on("mousemove", mousemove)
        .append("g")
        .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");
        
        x1.domain(xAxisData).rangeRoundBands([0, x0.rangeBand()]);
		self.x0 = x0;
		self.x1 = x1;
		
        var valueYmin = 0;
        if (minVy < 0) {
            valueYmin = minVy;
        }

        y.domain([valueYmin, maxV]);

        if (showLabels) {
        	
            self.svg.append("g")
            .attr("class", "x axis")
            .attr("font-size", self.font_size)
            .attr("transform", "translate(0," + self.height + ")")
            .style("stroke-width", 1)
            .call(xAxis)
            //.append("text")
            .selectAll(".tick text")
      		.call(wrap, x0.rangeBand());

            var keyIndex;
            var arrayYaxisProcessed = [];
            var cnt_keyIndex = 0;

            self.svg.append("g")
            .attr("class", "y axis")
            .attr("font-size", self.font_size)
            .style("stroke-width", 1)
            .call(yAxis);

            for (keyIndex in self.labelY) {

                if (arrayYaxisProcessed[self.labelY[keyIndex]]) {
                    // Exists
                } else {
                    // Does not exist
                    arrayYaxisProcessed[self.labelY[keyIndex]] = self.labelY[keyIndex];
                    self.svg.append("g")
                    .append("text")
                    .attr("font-size", self.font_size)
                    .attr("transform", "rotate(-90)")
                    .attr("y", 15 * (cnt_keyIndex))
                    .attr("dy", "15px").style("text-anchor", "end")
                    .text(function () {
                        var returnValue = "";
                        if (self.showAsPercentatge) {
                            returnValue = "As % (" + self.labelY[keyIndex] + ")";
                        } else {
                            returnValue = self.labelY[keyIndex];
                        }
                        return returnValue;
                    });
                    cnt_keyIndex = cnt_keyIndex + 1;
                }
            }
        }

        if (showGrid) {
        	
        	//console.log(self.maxEventsByPeriod)
        	var tickPosition = self.height;
        	if (self.maxEventsByPeriod>0) {
        		tickPosition = tickPosition + (self.maxEventsByPeriod*self.spaceBetweenEvents)+10;
        	}
        	
        	
            self.svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + self.height + ")")
            .call(make_x_axis()
            .tickSize(-tickPosition, 0, 0)
            .tickFormat(""));
            
            self.svg.append("g")
            .attr("class", "grid")
            .call(make_y_axis().tickSize(-self.width, 0, 0)
            .tickFormat(""));
        }

        var myBars = self.svg.selectAll("rect")
        .data(bars)
        .enter()
        .append("rect")
        //.attr("width", x1.rangeBand())
        .attr("width", function (d) {
        	var range = x1.rangeBand();
        	//var range = 10;
        	return range;
        })
		.attr("class", function (d, i) {
			
			if (self.groupby == 'Individual') {
				var find = d.To;
			}
			else {
				var find = d.Key;
			}
			
			var re = find.replace(/[^\w\-\u00A0-\uFFFF]/g,"_");

			var className = "bar bar_line_"+re;
			return className;
		})        
        .attr("x", function (d,i) {
        	//var resTRext = d.Key.split("_");
        	if (self.groupby == 'Individual') {
        		var resTRext = d.Key.split("_");
        	}
        	else {
        		var resTRext = d.To.split("_");
        	}
        	
        	if (self.groupby == 'Individual') {
        		return x0(resTRext[0]) + x1(d.ValueX);
        	}
        	else {
        		return x0(resTRext[0]) + x1(d.Key);
        	}

        })
        .attr("y", function (d) {
        	return self.height;
        })
        .attr("height", function (d) {
            return 0;
        })
        .attr("fill", function (d) {                    
            //return color(d.ValueX);
            //var resTRext = d.Key.split("_");
            //return color(resTRext[0]);    
            
            if (self.groupby == 'Individual') {
            	return color(d.ValueX);
            }
            else {
            	return d.Color;
            }
            
        })
        .on("mouseout", function (d, i) {
           	
           	if (self.groupby == 'Individual') {
           		var find = d.To;
           	}
           	else {
           		var find = d.Key;
           	}
           	       	
			var re = find.replace(/[^\w\-\u00A0-\uFFFF]/g,"_");
			
			d3.selectAll(".bar_line_"+re).attr("stroke","white").attr("stroke-width",0.0);		

            mouseout();
        })
        .on("mouseover", function (d, i) {
            
            if (self.groupby == 'Individual') {
            	var find = d.To;
            }
            else {
            	var find = d.Key;
            }
                    
			var re = find.replace(/[^\w\-\u00A0-\uFFFF]/g,"_");
			
			d3.selectAll(".bar_line_"+re).attr("stroke","red").attr("stroke-width",0.8);       	        	
						
            var resolution = 'day';
            var formatXaxe = "%d-%m-%Y";

            if (self.resolution == 'quarter') {
                formatXaxe = "%Y";
            } else if (self.resolution == 'year') {
                formatXaxe = "%Y";
            }
            else if (self.resolution == 'month') {
                formatXaxe = "%m-%Y";
            }
            else if (self.resolution == 'day') {
                formatXaxe = "%d-%m-%Y";
            } else {
                formatXaxe = "%Y";
            }

            var resX = d.ValueX.replace("/", "-");
            resX = resX.replace("/", "-");
            resX = resX.replace("/", "-");

            var resSplit = resX.split("-");

            var monthNames = [
                "",
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ];
            var startDateToPlot = "";

            if (self.resolution == 'day') {
                startDateToPlot = monthNames[parseInt(resSplit[1])] + " " + parseInt(resSplit[2]) + ", " + resSplit[0];
            } else if (self.resolution == 'month') {
                startDateToPlot = monthNames[parseInt(resSplit[1])] + ", " + parseInt(resSplit[0]);
            } else if (self.resolution == 'year') {
                startDateToPlot = +parseInt(resSplit[0]);
            } else if (self.resolution == 'quarter') {
                startDateToPlot = resX;
            } else {
                startDateToPlot = resX;
            }

            var valueString = d.ValueY;
            if (showAsPercentatge) {

                var formatdecimal = 0;
                if (valueString != 0) {
                    valueString = (parseFloat(valueString * 100) / 100).toFixed(2);
                    formatdecimal = Math.round(valueString / 100) + 1;
                } else {
                    formatdecimal = 2;
                }


                if (formatdecimal < 2) {
                    formatdecimal = 2;
                } else if (formatdecimal > 4) {
                    formatdecimal = 4;
                }
                var si = d3.format('.' + formatdecimal + 's');
                valueString = si(valueString);

                valueString = valueString + "%";
            }
            var resTRext = d.Key.split("_");
            tooltip.style("opacity", 1.0).html("<div class='tooltip-arrow'></div><div class='tooltip-inner ng-binding' ng-bind='content'>" + resTRext[0] + "<br />" + startDateToPlot + "<br />" + valueString + "</div>");
        })
        .on("click", function (d, i) {
            var posMouse = d3.mouse(this);
            var posX = posMouse[0];
            var posY = posMouse[1];
            $('input[name="startDatePosX"]').val(posX);                    
		})
		.transition().duration(3000)
		.attr("y", function (d) {
			return y(d.ValueY);
		})
		.attr("height", function (d) {
			var returnValue = self.height - y(+d.ValueY);
			if (returnValue < 0) {
				returnValue = 0;
			}
			return returnValue;
		});
/*
        var dataForCircles = [];
        for (var i in eventsData) {
            var arrayTemporal = [];
            arrayTemporal['posX'] = eventsData[i].posX;
            arrayTemporal['posY'] = eventsData[i].posY;
            arrayTemporal['desc'] = eventsData[i].desc;
            dataForCircles[i] = arrayTemporal;
        }


        var myDiscoLinesX = self.svg.selectAll("lineXDisco").data(dataForCircles);

        myDiscoLinesX.enter().append("line").attr("class", "lineXDisco").style("stroke", function (d, i) {
            return colorScale("99");
        }).attr("opacity", 0.5).attr("x1", function (d, i) {
            return (d.posX);
        }).attr("y1", self.height).attr("x2", function (d, i) {
            return (d.posX);
        }).attr("y2", function (d, i) {
            return (d.posY);
        })

        var myDiscoLinesY = self.svg.selectAll("lineYDisco").data(dataForCircles);

        myDiscoLinesY.enter().append("line").attr("class", "lineYDisco").style("stroke", function (d, i) {
            return colorScale("99");
        }).attr("opacity", 0.5).attr("x1", function (d, i) {
            return 0;
        }).attr("y1", function (d, i) {
            return (d.posY);
        }).attr("x2", function (d, i) {
            return (d.posX);
        }).attr("y2", function (d, i) {
            return (d.posY);
        })

        var myCircles = self.svg.selectAll("circulos").data(dataForCircles);

        myCircles.enter().append("circle").attr("cx", function (d, i) {
            return (d.posX);
        }).attr("cy", function (d, i) {
            return (d.posY);
        }).attr("r", self.radius).attr("class", "circulos").attr("opacity", 1.0).on("mouseover", function (d, i) {

            var circle = d3.select(this);
            circle.transition().attr("r", self.radius * 2);


            console.log(d3.select(this));
            d3.select(this).classed("circuloOn", true);
            tooltip.style("opacity", 1.0).html("<div class='tooltip-arrow'></div><div class='tooltip-inner ng-binding' ng-bind='content'>Desc=" + d.desc + "</div>");


        })
            .on("mouseout", function (d, i) {

                var circle = d3.select(this);
                circle.transition().attr("r", self.radius);


                d3.select(this).classed("circuloOn", false);
                mouseout();
            }).on("click", function (d, i) {
                
            });
*/
        var cnti = 1;
        var cntiMultiple = 0;
        var incremetY = 0;
		
	
		//to plot leggent at bottom
		 
		var cntiMultiple = 0;
        var incremetY = 0;
        var cnti = 0;
        //self.legendsColumn = 1;
        
        var xAxisDataForLegend = [];
        xAxisData.forEach(function (d, i) {
        	xAxisDataForLegend[i] = {'title':xAxisData[i], 'color':xAxisDataColor[i]};
        });
        
		xAxisDataForLegend = self.alphabetical_sort_object_of_objects(xAxisDataForLegend, 'title');
		
		var xAxisDataClonned = self.clone(xAxisDataForLegend);
        
        
		xAxisDataClonned.forEach(function (d, i) {
			
			if (showLegend) {
				
                //var valueX = ((self.maxWidth / (xAxisDataColor.length / self.legendsColumn)) * (cntiMultiple));
                var valueX = 10;

				if (i==0) {                	
						//add title of legend
						self.svg.append("text")
		                	.attr("x", function (d, i) {
		                    	return valueX;
		                	})
		                	.attr("y", function (d, i) {
		                    	var valueY = (self.height) + self.margin.topIni + 30 + (incremetY) * 20;
								return valueY;
		                	})
		                	.attr("text-anchor", "center")
		                		.attr("class", function() {
		                	})
		                	.attr("font-size", self.font_size+1)
		                	.style("fill", function (d, i) {
		                    	var colorToReturn = "black";
		                    	return colorToReturn;
		                	})
		                	.text(function (d, i) {
		                    	var resTRext = "Bars";                    
		                    return resTRext;
		                	});
                	}
                
                if ((i+1) % self.legendsColumn == 0) {
                    cntiMultiple = cntiMultiple + 1;
                }
				/*
                var valueY = (self.height) + self.margin.topIni + 50 + (incremetY) * 20;
                */
                var valueY = (self.height) + self.margin.topIni + 30 + (incremetY+1) * 20;
               
                /*
                if ((i+1) % self.legendsColumn == 0) {
                    incremetY = 0;
                } else {
                    incremetY = incremetY + 1;
                }
                */
               incremetY = incremetY + 1;
				
                self.svg.append("rect")
                .attr("x", valueX - 10)
                .attr("y", valueY - 5)
                .attr("width", 5)
                .attr("height", 5)
                //.style("fill", xAxisDataColor[i])
                .style("fill", function () {
                	if (self.groupby == 'Individual') {
                		return color(d.title);
                	}
                	else {
                		return xAxisDataClonned[i]['color'];
                	}
                  	
				});


				//var trimmedStringTmp = xAxisDataClonned[i].split("_");
				var trimmedStringTmp = xAxisDataClonned[i]['title'].split("_");
				
                var trimmedString = trimmedStringTmp[0];
                var fullString = trimmedStringTmp[0];
                var length = 100;
				/*
                if (xAxisDataColor.length == 1) {
                    length = 150;
                } else if (xAxisDataColor.length == 2) {
                    length = 80;
                } else if (xAxisDataColor.length == 3) {
                    length = 50;
                } else if (xAxisDataColor.length == 4) {
                    length = 30;
                } else if (xAxisDataColor.length == 5) {
                    length = 28;
                } else if (xAxisDataColor.length == 6) {
                    length = 20;
                } else if (xAxisDataColor.length == 7) {
                    length = 12;
                } else if (xAxisDataColor.length == 8) {
                    length = 10;
                } else {
                    length = 6;
                }
				
                if (trimmedString.length > length) {
                    trimmedString = trimmedString.substring(0, length) + "...";
                }
				*/
				if (eventsData.length>0) {							
					var length = 100;
					if (trimmedString.length > length) {
						trimmedString = trimmedString.substring(0, length-3) + "...";
					}
				}
                            
                self.svg.append("text")
                    .attr("x", function (d, i) {
                        return valueX;
                    })
                    .attr("y", function (d, i) {
                        return valueY;
                    })
                    .attr("text-anchor", "center")
                    .attr("class", "link superior legend value")
                    .attr("font-size", self.font_size+1)
                    //.style("fill", xAxisDataColor[i])
                    .style("fill", function () {
                    	if (self.groupby == 'Individual') {
                    		//return '#000';
                    		return color(d.title);                    		
                    	}
                    	else {
                    		return xAxisDataClonned[i]['color'];
                    	}
                    	
                    })
                    .text(trimmedString)
					.on("mouseover", function () {
						
						var find = d.title;						
						var re = find.replace(/[^\w\-\u00A0-\uFFFF]/g,"_");
						
						d3.selectAll(".bar_line_"+re).attr("stroke","red").attr("stroke-width",0.8);
			
						var str = fullString;				
						tooltip.style("opacity", 1.0).html('<div class="tooltip-arrow"></div><div class="tooltip-inner ng-binding" ng-bind="content">' + str + '</div>');
					})
					.on("mouseout", function () {
						
						var find = d.title;						
						var re = find.replace(/[^\w\-\u00A0-\uFFFF]/g,"_");
						
						d3.selectAll(".bar_line_"+re).attr("stroke","white").attr("stroke-width",0.0);
						
						mouseout();
                    })					
                    ;

                }
            
            
            
        });
                
        if (eventsData.length>0) {
        	plotEventsBarChart(eventsData);	
        }
        
        
    }


    self.init = function () {

        self.extraWidth = 0;
        if (self.showLegend) {
            self.extraWidth = 60;
        }

        //self.groupby = 'Date';
        //self.groupby = 'Individual';

        self.parentSelect = self.parentSelect.replace("undefined", "");

        var selection = d3.select(self.parentSelect);

        if (selection[0][0]) {
        	var clientwidth = selection[0][0].clientWidth;
        }
        else {
        	var clientwidth = self.maxWidth;
        }

        if (self.maxWidth < clientwidth) {
            self.width = self.maxWidth;
            self.height = self.maxHeight;
            self.font_size = self.maxFont_size;
            self.margin = self.maxMargin;
        } else {
            self.width = clientwidth - 20;

            if (self.width < 0) {
                self.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                if (self.width > 200) {
                    self.width = self.width - 120;
                }
                if (self.width > self.maxWidth) {
                    self.width = self.maxWidth;
                }
            }

            var newScale = (self.width) / self.maxWidth;
            self.height = self.maxHeight * newScale;
            self.font_size = self.maxFont_size * newScale;
            self.margin = {
                'top': self.maxMargin.top * newScale,
                'right': self.maxMargin.right * newScale,
                'bottom': self.maxMargin.bottom * newScale,
                'left': self.maxMargin.left * newScale
            };

        }
		
		
    }

    //function to clone an object
    self.clone = function (obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        var temp = obj.constructor();
        for (var key in obj) {
            temp[key] = self.clone(obj[key]);
        }

        return temp;
    }


	self.alphabetical_sort_object_of_objects = function(data, attr) {
        var arr = [];
        for (var prop in data) {
            if (data.hasOwnProperty(prop)) {
                var obj = {};
                obj[prop] = data[prop];
                obj.tempSortName = data[prop][attr].toLowerCase();
                arr.push(obj);
            }
        }

        arr.sort(function (a, b) {
            var at = a.tempSortName, bt = b.tempSortName;
            return at > bt ? 1 : ( at < bt ? -1 : 0 );
        });

        var result = [];
        for (var i = 0, l = arr.length; i < l; i++) {
            var obj = arr[i];
            delete obj.tempSortName;
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    var id = prop;
                }
            }
            var item = obj[id];
            result.push(item);
        }
        return result;
    }

    self.render = function (dataIn, eventsData) {		
		
		if (self.groupby == 'Individual') {
			//eventsData = [];
		}
		
        self.dataIn = dataIn;
        self.eventsData = eventsData;

        if (Object.keys(dataIn).length === 0) {
            self.svg.append("text")
            .text("No data to plot. Add datasets")
            .attr("class", "nodatatoplot")
            .attr("x", self.margin.left)
            .attr("y", self.margin.top)
        } else {


			var dataForCircles =[];
			var cnt_events_by_period = [];
			var maxEventsByPeriod = 0;
			for (var i in eventsData) {
			
				if (eventsData[i].startDate) {			
					var arrayObjDateStart = eventsData[i].startDate.split("-");
								
		            var arrayTemporal = [];
		            arrayTemporal['index'] = i;
		            arrayTemporal['color'] = eventsData[i].color;
		            arrayTemporal['title'] = eventsData[i].title;
		            arrayTemporal['startDate'] = eventsData[i].startDate;
		            arrayTemporal['endDate'] = eventsData[i].endDate;
		            
		            //console.log(eventsData[i].startDate);
		            
		            if (self.resolution=='day') {
		            	arrayTemporal['posx'] = eventsData[i].startDate;            	
		            }
		            else if (self.resolution=='month') {
		            	arrayTemporal['posx'] = arrayObjDateStart[0]+"-"+arrayObjDateStart[1];           	
		            }
		            else if (self.resolution=='year') {            	
		            	arrayTemporal['posx'] = arrayObjDateStart[0];           	
		            }
		            else if (self.resolution == 'quarter') {
		            	var extraString = "";
		            	if (arrayObjDateStart[1]<=3) {
		            		extraString = "Q1"
		            	}
		            	else if (arrayObjDateStart[1]<=6) {
		            		extraString = "Q2"
		            	}
		            	else if (arrayObjDateStart[1]<=9) {
		            		extraString = "Q3"
		            	}
		            	else if (arrayObjDateStart[1]<=12) {
		            		extraString = "Q4"
		            	}
		            	arrayTemporal['posx'] = arrayObjDateStart[0]+"-"+extraString;
		            }
		
		            arrayTemporal['posY'] = 0;
		            arrayTemporal['desc'] = eventsData[i].desc;
		            dataForCircles[i] = arrayTemporal;
	
					var a = cnt_events_by_period.indexOf(arrayTemporal.posx);				
					if (cnt_events_by_period[arrayTemporal.posx]) {
						cnt_events_by_period[arrayTemporal.posx] = cnt_events_by_period[arrayTemporal.posx] +1;
					}
					else {					
						cnt_events_by_period[arrayTemporal.posx] = 1;	
					}
					
					if (maxEventsByPeriod<cnt_events_by_period[arrayTemporal.posx]) {
						maxEventsByPeriod=cnt_events_by_period[arrayTemporal.posx]
					}
					            
	           }
        	}

			self.margin.topIni = self.margin.top;
		
			self.spaceBetweenEvents = 20;
			if (maxEventsByPeriod>0)
			{
				self.margin.top = self.margin.top + (self.spaceBetweenEvents*(maxEventsByPeriod+1));
				self.maxEventsByPeriod = maxEventsByPeriod;
			}
                	
            var dataToPlotUpdate = self.clone(dataIn);
            dataToPlotUpdate = self.alphabetical_sort_object_of_objects(dataToPlotUpdate, 'To');
            self.drawBarsMultiple(dataToPlotUpdate, dataForCircles);
        }

    }

    self.init();

    return self;

}
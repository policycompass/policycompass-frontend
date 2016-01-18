"use strict";
var policycompass = policycompass || {
        'version': 0.1,
        'controller': {},
        'viz': {},
        'extras': {}
    };

policycompass.viz.barsMultiple = function (options) {

    var self = {};

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
            valuesY.push(parseInt(d.ValueY));
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
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

        var xAxisData = d3.set(bars.map(function (line) {
        	//console.log(line.ValueX);
            //return line.ValueX;
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
            var resTRext = d.To.split("_");
            
            var trimmedString = resTRext[0];
            var length = 120;
            if (trimmedString.length > length) {
				trimmedString = trimmedString.substring(0, length) + "...";
			}
            
            return trimmedString;
        }));

		var legendsColumn = 0;
		if (self.showLegend) {
			legendsColumn = Math.ceil(xAxisData.length / 9);
		} else {
			legendsColumn = 0;
		}
		
		
		self.margin.bottom = 55 + (legendsColumn+1) * 20;
		self.legendsColumn = legendsColumn;
		
        self.svg = d3.select(self.parentSelect)
        .append("svg")
        .attr("class", "pc_chart")
        .attr("width", self.width + self.margin.left + self.margin.right + self.extraWidth)
        .attr("height", self.height + self.margin.top + self.margin.bottom)
        .on("mousemove", mousemove)
        .append("g")
        .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");
        
        x1.domain(xAxisData).rangeRoundBands([0, x0.rangeBand()]);

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
            self.svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + self.height + ")")
            .call(make_x_axis()
            .tickSize(-self.height, 0, 0)
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
        .attr("x", function (d,i) {
        	//var resTRext = d.Key.split("_");
        	var resTRext = d.To.split("_");
       	
        	//return x0(resTRext[0]) + x1(d.ValueX);
        	return x0(resTRext[0]) + x1(d.Key);
        })
        .attr("y", function (d) {
        	return self.height;
        })
        .attr("height", function (d) {
            return 0;
        })
        .style("fill", function (d) {                    
            //return color(d.ValueX);
            //var resTRext = d.Key.split("_");
            //return color(resTRext[0]);            
            return (d.Color);
        })
        .on("mouseout", function (d, i) {
            tooltip.style("opacity", 0.0);
        })
        .on("mouseover", function (d, i) {
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
                startDateToPlot = monthNames[parseInt(resSplit[0])] + ", " + parseInt(resSplit[1]);
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

        var cnti = 1;
        var cntiMultiple = 0;
        var incremetY = 0;
		/*
		// to plot legend at right
		
        xAxisData.forEach(function (d, i) {
        	
            var valueX = ((self.width / (xAxisData.length / self.legendsColumn)) * (cntiMultiple));
            if (cnti % self.legendsColumn == 0) {
                cntiMultiple = cntiMultiple + 1;
            }

            var valueY = (self.height) + self.margin.top + 30 + (incremetY) * 20;
            
            if (cnti % self.legendsColumn == 0) {
                incremetY = 0;
            } else {
                incremetY = incremetY + 1;
            }
			
            if (self.showLegend) {
                self.svg.append("rect")
                //.attr("x", valueX - 10)
                .attr("x", self.width+7)
                //.attr("y", valueY - 5)
                .attr("y", (15*(cnti-1)+8))
                .attr("width", 5)
                .attr("height", 5)
                //.style("fill", color(xAxisData[i]));
                .style("fill", xAxisDataColor[i]);
                
                var trimmedString = xAxisData[i];
                   var length = 10;

                    if (trimmedString.length > length) {
                        trimmedString = trimmedString.substring(0, length) + "...";
                    }
                   
                    
                self.svg.append("text")
                //.attr("x", function (d, i) {
                //	return valueX;
                //})
                .attr("x", self.width+14)
                //.attr("y", function (d, i) {
                //	return valueY;
                //})
                .attr("y", (15*(cnti-1)+15))
                .attr("text-anchor", "center")
                .attr("text-decoration", "none")
                .attr("class", "link superior legend value")
                .attr("font-size", self.font_size)
                //.style("fill", color(xAxisData[i]))
                .style("fill", xAxisDataColor[i])
                //.text(xAxisData[i]);
                .text(trimmedString);
            }
            
            cnti = cnti + 1;
            
		});
		*/
	
		//to plot leggent at bottom
		 
		var cntiMultiple = 0;
        var incremetY = 0;
        var cnti = 0;
        //self.legendsColumn = 1;
		xAxisData.forEach(function (d, i) {
			if (showLegend) {
				
                var valueX = ((self.maxWidth / (xAxisDataColor.length / self.legendsColumn)) * (cntiMultiple));
                
                
                if ((i+1) % self.legendsColumn == 0) {
                    cntiMultiple = cntiMultiple + 1;
                }

                var valueY = (self.height) + self.margin.top + 50 + (incremetY) * 20;
                if ((i+1) % self.legendsColumn == 0) {
                    incremetY = 0;
                } else {
                    incremetY = incremetY + 1;
                }
				
                self.svg.append("rect")
                .attr("x", valueX - 10)
                .attr("y", valueY - 5)
                .attr("width", 5)
                .attr("height", 5)
                .style("fill", xAxisDataColor[i])
                ;


				var trimmedStringTmp = xAxisData[i].split("_");
				
                var trimmedString = trimmedStringTmp[0];
                var fullString = trimmedStringTmp[0];
                var length = 100;

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
                    .style("fill", xAxisDataColor[i])
                    .text(trimmedString)
					.on("mouseover", function () {
						var str = fullString;				
						tooltip.style("opacity", 1.0).html('<div class="tooltip-arrow"></div><div class="tooltip-inner ng-binding" ng-bind="content">' + str + '</div>');
					})
					.on("mouseout", function () {
						tooltip.style("opacity", 0.0);
                    })					
                    ;

                }
            
            
            
        });
    }


    self.init = function () {

        self.extraWidth = 0;
        if (self.showLegend) {
            self.extraWidth = 60;
        }

        self.parentSelect = self.parentSelect.replace("undefined", "");

        var selection = d3.select(self.parentSelect);
        
        if (selection[0][0])
        {
        	var clientwidth = selection[0][0].clientWidth;
        }
        else
        {
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

    self.render = function (dataIn, eventsData) {

        self.dataIn = dataIn;
        self.eventsData = eventsData;

        function alphabetical_sort_object_of_objects(data, attr) {
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

        if (Object.keys(dataIn).length === 0) {
            self.svg.append("text")
            .text("No data to plot. Add datasets")
            .attr("class", "nodatatoplot")
            .attr("x", self.margin.left)
            .attr("y", self.margin.top)
        } else {
        	
            var dataToPlotUpdate = self.clone(dataIn);
            dataToPlotUpdate = alphabetical_sort_object_of_objects(dataToPlotUpdate, 'To');
            self.drawBarsMultiple(dataToPlotUpdate, eventsData);
        }

    }

    self.init();

    return self;

}

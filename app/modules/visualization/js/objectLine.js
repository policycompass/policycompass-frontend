"use strict";
var policycompass = policycompass || {
        'version': 0.1,
        'controller': {},
        'viz': {},
        'extras': {}
    };


policycompass.viz.line = function (options) {

    var self = {};

    for (var key in options) {

        self[key] = options[key];
    }
	
    self.parentSelect = "#" + self.idName;
    self.maxMargin = self.margin;
    self.maxWidth = self.width;
    self.maxHeight = self.height;
    self.maxFont_size = self.font_size;
    self.maxRadius = self.radius;
    self.maxDymarging = self.dymarging;
    self.maxOffsetYaxesR = self.offsetYaxesR;
    self.maxOffsetYaxesL = self.offsetYaxesL;
    self.maxDistanceXaxes = self.distanceXaxes;

    self.cntResizes = 0;
    d3.select(window).on('resize', resize);

    if (!self.resolution) {
        self.resolution = 'day';
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
        
    function resize() {
        self.cntResizes = self.cntResizes + 1;
        if (self.cntResizes > 1) {
            var element = document.getElementById(self.parentSelect.replace("#", ''));
            element.innerHTML = "";
            self.init();
            self.render(self.dataToPlot, self.eventsData, self.modeGraph);
        } else {
            self.init();
        }
    }


    function make_x_axis() {
        return d3.svg.axis().scale(self.xScale).orient("bottom").ticks(20)
    }

    function make_y_axis() {
        return d3.svg.axis().scale(self.y).orient("left").ticks(20)
    }

    function mouseover() {
        posMouse = d3.mouse(this);
        posX = posMouse[0];
        posY = posMouse[1];
        posX = xInversa(posX);
        posY = yInversa(posY);
        tooltip.style("opacity", 1.0).html("key=<br/>pos x=" + posX + "<br/>pos y=" + posY);
    }

    function mouseout() {
        tooltip.style("opacity", 0.0);
    }

    function mouseoutLegend() {
        self.showLegendOpened = 0;
        tooltipLegend.style("opacity", 0.0);
    }

    function toIntArray(arr) {
        for (var i = 0; i < arr.length; i++) {
            arr[i] = +arr[i];
        }
        return arr;
    }

    function renderLine(posX, posY) {
        var lineData = [
            {
                "x": 0,
                "y": posY
            }, {
                "x": posX,
                "y": posY
            }, {
                "x": posX,
                "y": posY
            }, {
                "x": posX,
                "y": self.height
            }
        ];

        var lineFunction = d3.svg.line()
            .x(function (d) {
                return d.x;
            }).y(function (d) {
                return d.y;
            }).interpolate("linear");

        self.lineFunction = lineFunction;

        //The SVG Container
        var svgContainer = self.svg;

        //The line SVG Path we draw
        var lineGraph = svgContainer.append("path").attr("d", lineFunction(lineData)).attr("stroke", "blue").attr("stroke-width", 2).attr("fill", "none");

    }

    self.drawLines = function (lines, eventsData) {

        if (!self.showYAxesTogether) {
            var widthTempoarl = self.width - (self.distanceXaxes * (lines.length - 1));
            if (widthTempoarl < (self.width / 3)) {
                self.width = self.width / 3;
            } else {
                self.width = widthTempoarl;
            }
            self.svg.attr("width", self.width + self.margin.left + self.margin.right);
        }

        self.linesIn = lines;
        self.eventsDataIn = eventsData;

        var showLegend = self.showLegend;
        var showLines = self.showLines;
        var showAreas = self.showAreas;
        var showPoints = self.showPoints;
        var showLabels = self.showLabels;
        var showGrid = self.showGrid;
        var showAsPercentatge = self.showAsPercentatge
        var colorScale = d3.scale.category20();
        var colorScaleForHE = d3.scale.category20();
        var parseDate = d3.time.format("%Y-%m-%d").parse;
        var valuesX = [];
        var valuesX_day = [];
        var valuesY = [];

        self.arrayMaxVy = [];
        self.arrayMinVy = [];

        if (showAsPercentatge) {
            lines.forEach(function (d, i) {            	
                var iniValue = lines[i].ValueY[0];                
                if (!isNaN(iniValue)) {                	
                	if (iniValue == null) {
                		
                	}
                	else if (iniValue != 0) {
                		
                    	lines[i].ValueX.forEach(function (d, j) {
                        	var valueTMP = ((lines[i].ValueY[j] - iniValue) / iniValue) * 100;
                        	lines[i].ValueY[j] = valueTMP;
                    	});
                	}
               	}
            });
        }

        var arrayXaxesLabel = [];

        lines.forEach(function (d, i) {
            var r_data = []
            r_data = toIntArray(d.ValueY);
            self.arrayMaxVy.push(d3.max(d3.values(r_data)));
            var vMinValueD3 = d3.min(d3.values(r_data));
            self.arrayMinVy.push(vMinValueD3);

            var obj = d.ValueY;

            for (var i in obj) {
                var twoPlacedFloat = parseFloat(obj[i]);
                valuesY.push(twoPlacedFloat)
            }
            obj = d.ValueX;

            for (var i in obj) {

                var a = arrayXaxesLabel.indexOf(obj[i]);
                if (a < 0) {
                    arrayXaxesLabel.push(obj[i]);
                }

                valuesX.push((obj[i]));

                if (self.xaxeformat == 'sequence') {
                    valuesX_day.push(obj[i]);
                } else if (self.resolution == 'quarter') {

                    var arrayObjDate = obj[i].split("-");
                    var newMonth = 1;

                    if ((arrayObjDate[1] == 'Q1') || (arrayObjDate[1] == 'Q2') || (arrayObjDate[1] == 'Q3') || (arrayObjDate[1] == 'Q4')) {
                        var Q = arrayObjDate[1].replace("Q", "");
                        newMonth = parseInt((Q * 3) - 2);
                        if (newMonth < 10) {
                            newMonth = "0" + newMonth;
                        }

                        var dateToPush = arrayObjDate[0] + "-" + newMonth + "-01";
                        valuesX_day.push(dateToPush);
                    }

                } else if (self.resolution == 'year') {

                    valuesX_day.push(("01-01-" + obj[i]));
                }
                else if (self.resolution == 'month') {
                    var arrayObjDate = obj[i].split("-");
                    valuesX_day.push((arrayObjDate[1] + "-01-" + arrayObjDate[0]));
                }
                else if (self.resolution == 'day') {
                    var strDatTmp = obj[i];
                    var arrayObjDate = obj[i].split("-");
                    strDatTmp = arrayObjDate[1] + "/" + arrayObjDate[2] + "/" + arrayObjDate[0];
                    valuesX_day.push(strDatTmp);
                }
            }

            self.lengthArrayXaxesLabel = arrayXaxesLabel.length;
        });


        if (!lines[0].ValueY) {
            lines[0].ValueY = 1;
        }


        self.maxVy = d3.max(d3.values(valuesY));
        self.minVy = d3.min(d3.values(valuesY));
        self.minVx = d3.min(d3.values(valuesX_day));
        self.maxVx = d3.max(d3.values(valuesX_day));

        function getDate(d) {
            return new Date(d);
        }

        var dateRE = /^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/;

        function dmyOrdA(a, b) {
            a = a.replace(dateRE, "$3$2$1");
            b = b.replace(dateRE, "$3$2$1");
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        }

        function dmyOrdD(a, b) {
            a = a.replace(dateRE, "$3$2$1");
            b = b.replace(dateRE, "$3$2$1");
            if (a > b) return -1;
            if (a < b) return 1;
            return 0;
        }

        function mdyOrdA(a, b) {
            a = a.replace(dateRE, "$3$1$2");
            b = b.replace(dateRE, "$3$1$2");
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        }

        function mdyOrdD(a, b) {
            a = a.replace(dateRE, "$3$1$2");
            b = b.replace(dateRE, "$3$1$2");
            if (a > b) return -1;
            if (a < b) return 1;
            return 0;
        }

        var formatXaxe = "%d-%m-%Y";
        if (self.xaxeformat == 'sequence') {
            valuesX.sort();
        } else {
            if (self.resolution == 'quarter') {
                formatXaxe = "%Y";
                formatXaxe = "%d-%m-%Y";
            } else if (self.resolution == 'year') {
                formatXaxe = "%Y";
            }
            else if (self.resolution == 'month') {
                formatXaxe = "%m-%Y";
            }
            else if (self.resolution == 'day') {
                formatXaxe = "%d-%m-%Y";
            }

            valuesX_day.sort(mdyOrdA);

            if (getDate(valuesX_day[0]) == "Invalid Date") {
                var value = valuesX_day[0];
                if (value) {
                    value = value.replace("-", "/");
                    value = value.replace("-", "/");
                    value = value.replace("-", "/");
                    self.minDate = getDate(value);
                }
            } else {
                self.minDate = getDate(valuesX_day[0]);
            }

            if (getDate(valuesX_day[valuesX_day.length - 1]) == "Invalid Date") {
                var value = valuesX_day[valuesX_day.length - 1];
                if (value) {
                    value = value.replace("-", "/");
                    value = value.replace("-", "/");
                    value = value.replace("-", "/");
                    self.maxDate = getDate(value);
                }
            } else {
                self.maxDate = getDate(valuesX_day[valuesX_day.length - 1]);
            }

        }

        if (self.xaxeformat == 'sequence') {
            self.xScale = d3.scale.linear().domain([self.minVx, self.maxVx]).range([0, self.width]).clamp(true);
        } else {
            self.xScale = d3.time.scale().domain([self.minDate, self.maxDate]).range([0, self.width]).clamp(true);
        }

        if (self.xaxeformat == 'sequence') {
            self.xScaleInversa = d3.scale.linear().domain([0, self.width]).range([self.minVx, self.maxVx]).clamp(true);
        } else {
            self.xScaleInversa = d3.time.scale().domain([0, self.width]).range([
                self.minDate, self.maxDate
            ]).clamp(true);
        }

        if (self.xaxeformat == 'sequence') {
            self.xScaleX = d3.scale.linear().domain([self.minVx, self.maxVx]).range([0, self.maxVx]).clamp(true);
        } else {
            self.xScaleX = d3.time.scale().domain([self.minDate, self.maxDate]).range([0, self.maxDate]).clamp(true);
        }

        if (self.xaxeformat == 'sequence') {
            self.xScaleXInversa = d3.scale.linear().domain([0, self.maxVx]).range([self.minVx, self.maxVx]).clamp(true);
        } else {
            self.xScaleXInversa = d3.time.scale().domain([0, self.maxDate]).range([
                self.minDate, self.maxDate
            ]).clamp(true);
        }

        if (self.xaxeformat == 'sequence') {
            self.x = d3.scale.linear().domain([0, self.maxVx]).range([0, self.width]).clamp(true);
        } else {
            self.x = d3.time.scale().domain([0, self.maxDate]).range([0, self.width]);
        }

        if (self.xaxeformat == 'sequence') {
            self.xInversa = d3.scale.linear().domain([0, self.width]).range([0, self.maxVx]).clamp(true);
        } else {
            self.xInversa = d3.time.scale().domain([0, self.width]).range([0, self.maxDate]).clamp(true);
        }

        var minYToPlot = 0;
        var maxYToPlot = 0;
        self.yArray = [];
        self.yArrayInversa = [];

        lines.forEach(function (d, i) {
            if (self.showYAxesTogether) {
                minYToPlot = self.minVy;
                maxYToPlot = self.maxVy;
            } else {
                minYToPlot = self.arrayMinVy[i];
                maxYToPlot = self.arrayMaxVy[i];
            }

            self.yArray.push(d3.scale.linear().domain([minYToPlot, maxYToPlot]).range([self.height, 0]).clamp(true));
            self.yArrayInversa.push(d3.scale.linear().domain([self.height, 0]).range([
                minYToPlot, maxYToPlot
            ]).clamp(true));
        });

        self.y = d3.scale.linear().domain([self.minVy, self.maxVy]).range([self.height, 0]).clamp(true);
        self.yInversa = d3.scale.linear().domain([self.height, 0]).range([self.minVy, self.maxVy]).clamp(true);

        var formatdecimal = 0;

        formatdecimal = Math.round(self.maxVy / 100) + 1;

        if (formatdecimal < 2) {
            formatdecimal = 2;
        }

        var orientText = "left";
        if (formatdecimal > 4) {
            orientText = "left";
            formatdecimal = 4;
        }



        if (self.xaxeformat == 'sequence') {
            var xAxis = d3.svg.axis().scale(self.xScale).orient("bottom")
                .tickFormat(d3.format("." + formatdecimal + "s"));
        } else {

            if (self.resolution == 'quarter') {

                var xAxis = d3.svg.axis().scale(self.xScale).orient("bottom")
                    .ticks(d3.time.month, 2)
                    .tickFormat(function (x) {
                        var milli = (x.getTime());
                        var vanilli = new Date(milli);
                        var mon = vanilli.getMonth();
                        var yr = vanilli.getFullYear();

                        if (mon <= 2) {
                            return "Q1 " + yr;
                        } else if (mon <= 5) {
                            return "Q2 " + yr;
                        } else if (mon <= 8) {
                            return "Q3 " + yr;
                        } else {
                            return "Q4 " + yr;
                        }
                    });

            } else {

                var xAxis = d3.svg.axis().scale(self.xScale).orient("bottom")
                    .ticks(self.lengthArrayXaxesLabel).tickFormat(d3.time.format(formatXaxe));
            }


        }
        self.xAxis = xAxis;

        if (self.hideyaxeunits == true) {
            var yAxis = d3.svg.axis().scale(self.y)
                .orient(orientText);
        } else {
            if (self.maxVy < 100) {
                var yAxis = d3.svg.axis().scale(self.y).orient(orientText);
            } else {
                var yAxis = d3.svg.axis().scale(self.y)
                    .orient(orientText)
                    .tickFormat(d3.format(".2s"));
            }
        }
        var lineFunction = d3.svg.line().x(function (d, i) {


            var resX = d.xOriginal;
            if (self.xaxeformat == 'sequence') {
                return (self.xScale((resX)));
            } else {

                if (self.xaxeformat == 'sequence') {
                    resX = resX;
                } else if (self.resolution == 'quarter') {
                    var arrayObjDate = resX.split("-");
                    var newMonth = 1;
                    if ((arrayObjDate[1] == 'Q1') || (arrayObjDate[1] == 'Q2') || (arrayObjDate[1] == 'Q3') || (arrayObjDate[1] == 'Q4')) {
                        var Q = arrayObjDate[1].replace("Q", "");

                        newMonth = parseInt((Q * 3) - 2);
                        if (newMonth < 10) {
                            newMonth = "0" + newMonth;
                        }

                        var dateToPush = arrayObjDate[0] + "-" + newMonth + "-01";

                        resX = dateToPush;
                    }
                } else if (self.resolution == 'year') {
                    resX = "01/01/" + resX;
                }
                else if (self.resolution == 'month') {
                    var arrayObjDate = resX.split("-");
                    resX = arrayObjDate[1] + "/01/" + arrayObjDate[0];
                }
                else if (self.resolution == 'day') {
                    resX = resX;
                    var arrayObjDate = resX.split("-");
                    resX = arrayObjDate[1] + "/" + arrayObjDate[2] + "/" + arrayObjDate[0];

                }
                return (self.xScale(getDate(resX)));
            }


        }).y(function (d) {
            return self.yArray[self.cntLineasPintadas](d.posY);
        }).interpolate("linear");

        ;

        self.lineFunction = lineFunction;

        /** Start to plot mouse pointer */
        /* x line */
        self.hoverLineX = self.svg.append("line").attr("class", "hover-line-vertical").style("stroke", "red").attr("opacity", 0.5).attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", self.height)

        self.hoverLineX.classed("hide", true);
        /* y line */
        self.hoverLineY = self.svg.append("line").attr("class", "hover-line-horitzontal").style("stroke", "red").attr("opacity", 0.5).attr("x1", 0).attr("y1", 0).attr("x2", self.width).attr("y2", 0)

        self.hoverLineY.classed("hide", true);
        /* en plot mouse pointer*/

        if (showLabels) {

            self.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + self.height + ")")
            .call(xAxis)
            .attr("font-size", self.font_size).selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", function (d) {
				return "rotate(-25)"
			});

            if (self.showYAxesTogether) {


                var keyIndex;

                self.svg.append("g").attr("class", "y axis").call(yAxis).attr("font-size", self.font_size);


                var arrayYaxisProcessed = [];
                var cnt_keyIndex = 0;
                for (keyIndex in self.labelY) {
                    var posa = arrayYaxisProcessed.indexOf(self.labelY[keyIndex]);

                    if (posa >= 0) {
                        // Exists
                    } else {
                        // Does not exist
                        arrayYaxisProcessed.push(self.labelY[keyIndex]);
                    }

                }

                if (arrayYaxisProcessed.length == 1) {
                    var offsetYaxes = 0;
                    if (orientText == "left") {
                        offsetYaxes = self.offsetYaxesR;
                    } else {
                        offsetYaxes = self.offsetYaxesL;
                    }
                    self.svg.append("g")
                    .append("text")
                    .attr("font-size", self.font_size)
                    .attr("transform", "rotate(-90)")
                    .attr("y", offsetYaxes)                    
					.attr("dy", self.dymarging + "px")
					.style("text-anchor", "end").text(function () {
						var returnValue = "";
						if (self.showAsPercentatge) {
							if (self.labelY[0]) {							
								returnValue = "As % (" + self.labelY[0] + ")";
							}
							else {
								returnValue = "As %"
							}							
						} else {
							returnValue = self.labelY[0];
						}
						return returnValue;
					});
                } else {

                    var cnt_linea = 0;
                    for (keyIndex in self.labelY) {
                        cnt_linea = cnt_linea + 1;
                        self.svg.append("g")
                        .append("text")
                        .attr("font-size", self.font_size)
                        .attr("transform", "rotate(-90)")
                        .attr("y", self.dymarging * (keyIndex))
                        .attr("dy", self.dymarging + "px")
                        .style("fill", function (d, i) {
                            var colorToReturn = "";
                            var lineColor = lines[keyIndex].Color;
                            if (lineColor) {
                                colorToReturn = lineColor;
                            } else {
                                colorToReturn = colorScale(lines[keyIndex].Key);
                            }
                            return colorToReturn;
						})
						.style("font-weight", "bold")
						.style("text-anchor", "end")
						.text(function () {
                            var returnValue = "";
                            if (self.showAsPercentatge) {
                            	if (self.labelY[keyIndex]) {
                                	returnValue = "As % (" + self.labelY[keyIndex] + ")";
                               	}
                               	else {
                               		returnValue = "As %";
                               	}
                               	
                            } else {
                                returnValue = self.labelY[keyIndex];
                            }
                            return returnValue;
						});
                    }
                }
            }
        }


        if (showGrid) {
            self.svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + self.height + ")")
            .call(make_x_axis()
            .tickSize(-self.height, 0, 0)
            .tickFormat(""))

            self.svg.append("g")
            .attr("class", "grid")
            .call(make_y_axis()
            .tickSize(-self.width, 0, 0)
            .tickFormat(""))
        }
        
        var cntpasadas;
        if (showAreas) {
            cntpasadas = 1;
        } else {
            cntpasadas = 2;
        }
        while (cntpasadas <= 2) {

			if (cntpasadas==2) {
				plotEvents(eventsData, colorScaleForHE, getDate);
			}

            self.legendText = "";
            var cntiMultiple = 0;
            var incremetY = 0;
            var cnti = 0;
            
            lines = self.alphabetical_sort_object_of_objects(lines, 'Key');
            
            lines.forEach(function (d, i) {
                self.cntLineasPintadas = i;
                cnti = cnti + 1;

                var linesArray = [];
                var linesArrayX = [];
                var linesArrayXY = [];
                var lineColor = [];

                var evaluate = 0;
                if ('ValueY' in d) {


                    linesArray = d.ValueY;
                    linesArrayX = d.ValueX;
                    linesArrayXY = d.ValueX + "|" + d.ValueY;
                    lineColor = d.Color;

                    evaluate = 1;

                }

                key = d.Key;

                //to create n y axes
                if ((!self.showYAxesTogether) && (showLabels)) {

                    var transform = "";
                    if (cnti === 1) {

                        //formatdecimal = parseInt(self.maxVy.toString().length);
                        formatdecimal = Math.round(self.maxVy / 100) + 1;

                        if (formatdecimal < 2) {
                            formatdecimal = 2;
                        }
                        var orientText = "left";
                        if (formatdecimal > 4) {
                            orientText = "left";
                            formatdecimal = 4;
                        }

                        transform = "translate(0,0)";

                        if (self.hideyaxeunits == true) {
                            var yAxisLeft = d3.svg.axis().scale(self.yArray[i])
                                .orient(orientText);
                        } else {
                            var yAxisLeft = d3.svg.axis().scale(self.yArray[i])
                                .orient(orientText)
                                .tickFormat(d3.format(".2s"));
                        }
                    } else {
                        formatdecimal = parseInt(self.arrayMaxVy[i].toString().length);

                        if (formatdecimal < 2) {
                            formatdecimal = 2;
                        }

                        var posFinalXAxeY = self.width;
                        posFinalXAxeY = posFinalXAxeY + (self.distanceXaxes + formatdecimal) * (i - 1)
                        transform = "translate(" + posFinalXAxeY + ",0)";

                        if (self.hideyaxeunits == true) {
                            var yAxisLeft = d3.svg.axis().scale(self.yArray[i]).ticks(10).orient("right");
                        } else {
                            var yAxisLeft = d3.svg.axis().scale(self.yArray[i]).ticks(10).orient("right")
                                .tickFormat(d3.format(".2s"));
                        }
                    }

                    var paddingText = "";
                    if (cnti == 1) {
                        paddingText = self.dymarging + "px";
                    } else {
                        paddingText = "0px";
                    }

                    var offsetYaxes = 0;

                    if (orientText == "left") {
                        offsetYaxes = self.offsetYaxesR;
                    } else {
                        offsetYaxes = self.offsetYaxesL / 2;
                    }

                    self.svg.append("svg:g")
                    .attr("class", "y axis axisLeft")
                    .attr("transform", transform)
                    .style("fill", function (d, i) {

                        var colorToReturn;

                        if (lineColor) {
                            colorToReturn = lineColor;
                        } else {
                            colorToReturn = colorScale(key);
                        }
                        return colorToReturn;
                    })
                    .attr("font-size", self.font_size)
                    .call(yAxisLeft)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("dy", paddingText)
                    .attr("y", offsetYaxes)
                    .style("text-anchor", "end")
                    .text(function () {
						var returnValue = "";
                        if (self.showAsPercentatge) {
                        	if (self.labelY[cnti - 1]) {
                        		returnValue = "As % (" + self.labelY[cnti - 1] + ")";
                        	}
                        	else {
                        		returnValue = "As %";
                        	}                        	
						} else {
                        	returnValue = self.labelY[cnti - 1];
                        }
                            return returnValue;
					});
                }

                var data = new Object();

                if (evaluate === 1) {

                    data = linesArray.map(function (d, i) {
                        var posXToPrint = linesArrayX[i];
                        posXToPrint = self.xScaleX(posXToPrint);
                        posXToPrint = self.x(posXToPrint);
                        posXToPrint = self.xInversa(posXToPrint)

                        return {
                            posX: posXToPrint,
                            posY: d,
                            key: key,
                            xOriginal: linesArrayX[i],
                            color: lineColor
                        };
                    });

                }


                self.x.domain(d3.extent(data, function (d, i) {
                    return d.xOriginal;
                }));


                if ((showAreas) && (cntpasadas == 1)) {
                	
					
					if (document.getElementById('disableindividuals')) {
                    	var arrayDisabledIndividuals = document.getElementById('disableindividuals').value.split("|");
                    	var stringToCheck = d.Key.replace(/\W/g, '');
                    	var a = arrayDisabledIndividuals.indexOf(stringToCheck);
                   	}
                   	else
                   	{
                   		var a=-1;
                   	}
                   
                    var areaOpacity=0.3;
                    
                    if (a>=0) {
                    	areaOpacity=0;
                    }
					
                    var area = d3.svg.area().x(function (d) {

                        var resX = d.xOriginal;

                        if (self.xaxeformat == 'sequence') {
                            return (self.xScale((resX)));
                        } else {

                            if (self.resolution == 'quarter') {
                                var arrayObjDate = resX.split("-");

                                var newMonth = 1;
                                if ((arrayObjDate[1] == 'Q1') || (arrayObjDate[1] == 'Q2') || (arrayObjDate[1] == 'Q3') || (arrayObjDate[1] == 'Q4')) {
                                    var Q = arrayObjDate[1].replace("Q", "");
                                    newMonth = parseInt((Q * 3) - 2);
                                    if (newMonth < 10) {
                                        newMonth = "0" + newMonth;
                                    }

                                    var dateToPush = arrayObjDate[0] + "-" + newMonth + "-01";
                                    resX = dateToPush;
                                }
                            } else if (self.resolution == 'year') {
                                resX = "01/01/" + resX;
                            }
                            else if (self.resolution == 'month') {
                                var arrayObjDate = resX.split("-");
                                resX = arrayObjDate[1] + "/01/" + arrayObjDate[0];
                            }
                            else if (self.resolution == 'day') {
                                var arrayObjDate = resX.split("-");
                                resX = arrayObjDate[1] + "/" + arrayObjDate[2] + "/" + arrayObjDate[0];
                            }
                            return (self.xScale(getDate(resX)));
                        }
                    }).y0(self.height).y1(function (d) {
                        return (self.yArray[self.cntLineasPintadas](d.posY));
                    });

                    self.svg.append("path")
                    .datum(data)
                    .attr("class", "area area_item item_" + (cnti - 1) + " area_class_" + key.replace(/\W/g, ''))
                    .attr("d", area)
                    .style("fill", function (d, i) {
                        var colorToReturn;

                        if (lineColor) {
                            colorToReturn = lineColor;
                        } else {
                            colorToReturn = colorScale(key);
                        }
                        return colorToReturn;
                    }).style("stroke", function (d, i) {
                        var colorToReturn;

                        if (lineColor) {
                            colorToReturn = lineColor;
                        } else {
                            colorToReturn = colorScale(key);
                        }
                        return colorToReturn;
                    })
                    .style("opacity", areaOpacity);
                }
                if ((showLines) && (cntpasadas == 2)) {
					
					if (document.getElementById('disableindividuals')) {						
                    	var arrayDisabledIndividuals = document.getElementById('disableindividuals').value.split("|");
                    	var stringToCheck = d.Key.replace(/\W/g, '');
                    	var a = arrayDisabledIndividuals.indexOf(stringToCheck);
                   	}
                   	else {
                   		var a = -1;
                   	}
                   
                    var lineOpacity=1;
                    var lineClass = "line line--hover class_" + key.replace(/\W/g, '');
                    if (a>=0) {
                    	lineOpacity=0;
                    }
                    else {
                    	lineClass += " active_item";
                    }
                    
                    var path = self.svg.append("path").datum(data)                  
                        .attr("class", lineClass)
                        .style("opacity", lineOpacity)
                        .attr("id", 'tag_' + key.replace(/\W/g, '')) // assign ID
                        .attr("fill", "none").style("stroke", function (d, i) {

                            var colorToReturn;
                            if (d[i].color) {
                                colorToReturn = d[i].color;
                            } else {
                                colorToReturn = colorScale(key);
                            }
                            return colorToReturn;

                        }).style("stroke-width", 2)
                        .attr("d", lineFunction)
                        .on("mouseover", function (d, i) {
                            d3.select(this).style("stroke-width", 4);
                        }).on("mouseout", function () {
                            d3.select(this).style("stroke-width", 2);
                            mouseout();
                        }).on("click", function (d, i) {

                            if (self.modeGraph == 'view') {

                            } else {
                                if (self.xaxeformat == 'sequence') {

                                } else {
                                    var posMouse = d3.mouse(this);
                                    var posX = posMouse[0];
                                    posX = posX + self.margin.left;
                                    var posY = posMouse[1];
                                    var maxPosX = self.width + self.margin.left;
                                    var posXinvers = "";
                                    if (posX > maxPosX) {
                                        posXinvers = ""
                                    } else {
                                        if (self.xScale) {
                                            posXinvers = self.xScale.invert(posX - self.margin.left);
                                            var format = d3.time.format("%m-%d-%Y");
                                            posXinvers = format(posXinvers);
                                            posXinvers = posXinvers.replace(/-/g, "/");
                                        }
                                    }

                                    var format = d3.time.format("%m-%d-%Y");
                                    var maxDateGraph = format(self.maxDate);
                                    maxDateGraph = maxDateGraph.replace(/-/g, "/");

                                    $('input[name="startDatePosX"]').val(posXinvers);
                                    $('input[name="endDatePosX"]').val(maxDateGraph);

                                    document.getElementById("addHEbutton").click();
                                }
                            }


                        });

                    if (path.node()) {
                        var totalLength = path.node().getTotalLength();

                        path.attr("stroke-dasharray", totalLength + " " + totalLength).attr("stroke-dashoffset", totalLength).transition().duration(2000).ease("linear").attr("stroke-dashoffset", 0);
                    }

                }
                var resTRext = key.split("_");

                self.legendText = self.legendText + '<div style="margin-top: 2px; width: 5px; background: ' + lineColor + '; height: 5px; float: left;"> </div>&nbsp;<font color="' + lineColor + '">' + resTRext[0] + '</font><br/>';

                if (showLegend)
                {
                    var valueX = ((self.maxWidth / (lines.length / self.legendsColumn)) * (cntiMultiple));
                    if (cnti % self.legendsColumn == 0) {
                        cntiMultiple = cntiMultiple + 1;
                    }

                    var valueY = (self.height) + self.margin.top + 50 + (incremetY) * 20;
                    if (cnti % self.legendsColumn == 0) {
                        incremetY = 0;
                    } else {
                        incremetY = incremetY + 1;
                    }

                    self.svg.append("rect")
                    .attr("x", valueX - 10)
                    .attr("y", valueY - 5)
                    .attr("width", 5)
                    .attr("height", 5)
                    .style("fill", function (d, i) {
                        var colorToReturn;

                        if (lineColor) {
                            colorToReturn = lineColor;
                        } else {
                            colorToReturn = colorScale(key);
                        }
                        return colorToReturn;

                    });

					
                    			
                    self.svg.append("text")
                        .attr("x", function (d, i) {
                            return valueX;
                        })
                        .attr("y", function (d, i) {
                            return valueY;
                        })
                        .attr("text-anchor", "center")
                        .attr("class", function() {
                        	
                        	if (document.getElementById('disableindividuals')) {
                        		var arrayDisabledIndividuals = document.getElementById('disableindividuals').value.split("|");
                    			var stringToCheck = d.Key.replace(/\W/g, '');
                    			var a = arrayDisabledIndividuals.indexOf(stringToCheck);
                    		}
                    		else {
                    			var a = -1;
                    		}
                    		
                    		var extraClass='enableindividual';
                    
                    		if (a>=0) {
                    			extraClass='disableindividual';
                    		}
                    		
                    		return "link superior legend value legend_"+d.Key.replace(/\W/g, '')+" "+extraClass;
                    		
                        })
                        .attr("font-size", self.font_size+1)
                        .style("fill", function (d, i) {
                            var colorToReturn;

                            if (lineColor) {
                                colorToReturn = lineColor;
                            } else {
                                colorToReturn = colorScale(key);
                            }
                            return colorToReturn;

                        })
                        .on("mouseover", function () {

                            //if ((self.modeGraph == 'view') || (self.xaxeformat == 'sequence')) {
                            if (1==1) {

                                var keyTmp = d['Key'].split("_");
                                var str = keyTmp[0];
								if (document.getElementById('disableindividuals')) {
                   					var arrayDisabledIndividuals = document.getElementById('disableindividuals').value.split("|");
                   				}
                   				else {
                   					var arrayDisabledIndividuals = [];
                   				}
                    			var stringToCheck = d.Key.replace(/\W/g, '');
                    			var a = arrayDisabledIndividuals.indexOf(stringToCheck);

                                if (d3.select(this).classed("enableindividual")) {
									if ((self.modeGraph == 'view') || (self.xaxeformat == 'sequence')) { 
                                    	tooltip.style("opacity", 1.0).html('<div class="tooltip-arrow"></div><div class="tooltip-inner ng-binding" ng-bind="content">' + str + '<br/><i>Click over to hide</i></div>');
									}
                                   	else {
                                   		tooltip.style("opacity", 1.0).html('<div class="tooltip-arrow"></div><div class="tooltip-inner ng-binding" ng-bind="content">' + str + '</div>');
                                   	}
                                    d3.selectAll(".active_item").style("opacity", 0.3);

                                    var strokeWidth = d3.select("#tag_" + d.Key.replace(/\W/g, '')).style("stroke-width");
                                    strokeWidth = strokeWidth.replace("px", "");
                                    strokeWidth = parseInt(strokeWidth) + 2;

                                    d3.selectAll("#tag_" + d.Key.replace(/\W/g, '')).style("stroke-width", strokeWidth).style("opacity", 1);

                                    d3.selectAll(".point_" + d.Key.replace(/\W/g, '')).classed('pointOn', true)
                                        .style("opacity", 1);

                                } else {             
                                	if ((self.modeGraph == 'view') || (self.xaxeformat == 'sequence')) {                                		                   
                                    	tooltip.style("opacity", 1.0).html('<div class="tooltip-arrow"></div><div class="tooltip-inner ng-binding" ng-bind="content">' + str + '<br><i>Click over to show</i></div>');
                                   	}
                                   	else {
                                   		tooltip.style("opacity", 1.0).html('<div class="tooltip-arrow"></div><div class="tooltip-inner ng-binding" ng-bind="content">' + str + '</div>');
                                   	}
                                }

                            }

                        })
                        .on("mouseout", function () {
							
							if (document.getElementById('disableindividuals')) {
								var arrayDisabledIndividuals = document.getElementById('disableindividuals').value.split("|");
                    			var stringToCheck = d.Key.replace(/\W/g, '');
                    			var a = arrayDisabledIndividuals.indexOf(stringToCheck);
                    		}
                    		else {
                    			var a = -1;
                    		}
                    		
                    		if (a<0) {                    		
                            	d3.selectAll(".active_item").style("opacity", 1);
                            	d3.selectAll("#tag_" + d.Key.replace(/\W/g, '')).style("stroke-width", 2);
                            	d3.selectAll(".point_" + d.Key.replace(/\W/g, '')).classed('pointOn', false);
                            	
                           	}
                           	mouseout();
                        })
                        .text(function (d, i) {
                            var resTRext = key.split("_");
                            var trimmedString = resTRext[0];
                            var length = 100;

                            if (lines.length == 1) {
                                length = 150;
                            } else if (lines.length == 2) {
                                length = 80;
                            } else if (lines.length == 3) {
                                length = 50;
                            } else if (lines.length == 4) {
                                length = 30;
                            } else if (lines.length == 5) {
                                length = 28;
                            } else if (lines.length == 6) {
                                length = 20;
                            } else if (lines.length == 7) {
                                length = 12;
                            } else if (lines.length == 8) {
                                length = 10;
                            } else {
                                length = 6;
                            }

                            if (trimmedString.length > length) {
                                trimmedString = trimmedString.substring(0, length) + "...";
                            }

                            return trimmedString;
                        })
                        .on("click", function () {
                            
                            if ((self.modeGraph == 'view') || (self.xaxeformat == 'sequence')) {                            
                            
                            	var resTRext = d.Key.split("_");
                            	var trimmedString = resTRext[0];
                            	//console.log(resTRext[0]);
                            	
                            	if (document.getElementById('disableindividuals')) {
                            		var arrayDisabledIndividuals = document.getElementById('disableindividuals').value.split("|");
                            		var stringToCheck = d.Key.replace(/\W/g, '');
                            		var a = arrayDisabledIndividuals.indexOf(stringToCheck);
                            	}
                            	else {
                            		var a = -1;
                            	}
                            	
                            	d3.selectAll(".legend_" + stringToCheck).classed('enableindividual', true);
                    			d3.selectAll(".legend_" + stringToCheck).classed('disableindividual', false);
								
								d3.selectAll(".class_" + stringToCheck).classed('active_item', true);

                                d3.selectAll(".class_" + stringToCheck).transition().duration(100).style("opacity", 1);
                                d3.selectAll(".area_class_" + stringToCheck).transition().duration(100).style("opacity", 0.3);

								if (document.getElementById('disableindividuals')) {
	                            	if (a>=0) {
	                            		document.getElementById('disableindividuals').value = '';
	                            		for (key in arrayDisabledIndividuals) {                            			
	                            			if (arrayDisabledIndividuals[key]) {
	                            				if (arrayDisabledIndividuals[key]!=stringToCheck) {
	                            					if (document.getElementById('disableindividuals').value)
	                            					{
	                            						document.getElementById('disableindividuals').value +="|";
	                            					}
	                            					document.getElementById('disableindividuals').value +=arrayDisabledIndividuals[key];
	                            					
	                            					d3.selectAll(".legend_" + arrayDisabledIndividuals[key]).classed('enableindividual', false);
	                                				d3.selectAll(".legend_" + arrayDisabledIndividuals[key]).classed('disableindividual', true);
	                                				
	                                				d3.selectAll(".class_" + stringToCheck).classed('active_item', false);
	                                				
					                                d3.selectAll(".class_" + arrayDisabledIndividuals[key]).transition().duration(100).style("opacity", 0);
	                				                d3.selectAll(".area_class_" + arrayDisabledIndividuals[key]).transition().duration(100).style("opacity", 0);
	
	                                				
	                            				}
	                            			}
	                            		}                            		
	                            	}   
	                            	else {                            		
	                            		if (document.getElementById('disableindividuals').value)
	                            		{
	                            			document.getElementById('disableindividuals').value +="|";
	                            		}
	                            		document.getElementById('disableindividuals').value +=stringToCheck;
	
										d3.selectAll(".legend_" + d.Key.replace(/\W/g, '')).classed('enableindividual', false);
	                                	d3.selectAll(".legend_" + d.Key.replace(/\W/g, '')).classed('disableindividual', true);
										
										d3.selectAll(".class_" + stringToCheck).classed('active_item', false);
										
					                    d3.selectAll(".class_" + d.Key.replace(/\W/g, '')).transition().duration(100).style("opacity", 0);
	                				    d3.selectAll(".area_class_" + d.Key.replace(/\W/g, '')).transition().duration(100).style("opacity", 0);
	                            		
	                            	}
                            	}
                            	
                                var active = d.active ? false : true;
                                var newOpacity = active ? 0 : 1;
                                var newOpacityArea = active ? 0 : 0.3;

                                // Update whether or not the elements are active
                                d.active = active;

								var tooltipstr = resTRext[0];
                                var str = d3.select(this).text();
                                
                                var res = "";
																
                                if (active) {                                	                             
                                    res = 'Click to display ' + str;
                                    res = str.replace("hide", "display");
                                    tooltip.style("opacity", 1.0).html('<div class="tooltip-arrow"></div><div class="tooltip-inner ng-binding" ng-bind="content">' + tooltipstr + '<br/><i>Click over to show</i></div>');
                                } else {
                                    res = str.replace("display", "hide");
                                    tooltip.style("opacity", 1.0).html('<div class="tooltip-arrow"></div><div class="tooltip-inner ng-binding" ng-bind="content">' + tooltipstr + '<br/><i>Click over to hide</i></div>');
                                }
								
                                d3.select(this).text(res);

                            } else {
                                if (self.xaxeformat == 'sequence') {

                                } else {
                                    document.getElementById("modaladddataset").click();
                                }
                            }
                        })


                }
            });


            cntpasadas = cntpasadas + 1;
        }

		

        if (showPoints) {
            lines.forEach(function (d, i) {
                var keyCircle = d.Key;
                //var colorCircle = d.Color;
				var colorCircle = '';

                if (d.Color) {
                	colorCircle = d.Color;
                } else {
                	colorCircle = colorScale(d.Key);
                }                
                
                var cntLine = i;

                var datosCircle = []
                for (var i in d.ValueX) {
                    datosCircle.push(d.ValueX[i] + "|" + d.ValueY[i])
                }

                var myCircles = self.svg.selectAll("circles").data(datosCircle);

                var units = "";
                units = "";
                if (self.labelY) {
                    if (typeof self.labelY[i] !== 'undefined') {
                        units = self.labelY[i];
                    }
                }
				
				if (document.getElementById('disableindividuals')) {
					var arrayDisabledIndividuals = document.getElementById('disableindividuals').value.split("|");
                	var stringToCheck = keyCircle.replace(/\W/g, '');
                	var a = arrayDisabledIndividuals.indexOf(stringToCheck);
               	}
               	else {
               		var a = -1;
               	}
                
                var circleOpacity=1;
                
                var classCircle = "pointIn point_" + keyCircle.replace(/\W/g, '') + " class_" + keyCircle.replace(/\W/g, '');
                
                if (a>=0) {
                	circleOpacity=0;
                }
                else {
                	classCircle += " active_item";
                }
                  
                myCircles.enter().append("circle").attr("cx", function (d, i) {

                    var res = d.split("|");
                    var resX = res[0];
                    if (self.xaxeformat == 'sequence') {                        
                        return (self.xScale((resX)));
                    } else {

                        if (self.resolution == 'quarter') {
                            var arrayObjDate = resX.split("-");

                            var newMonth = 1;

                            if ((arrayObjDate[1] == 'Q1') || (arrayObjDate[1] == 'Q2') || (arrayObjDate[1] == 'Q3') || (arrayObjDate[1] == 'Q4')) {
                                var Q = arrayObjDate[1].replace("Q", "");
                                newMonth = parseInt((Q * 3) - 2);
                                if (newMonth < 10) {
                                    newMonth = "0" + newMonth;
                                }

                                var dateToPush = arrayObjDate[0] + "-" + newMonth + "-01";
                                resX = dateToPush;
                            }

                        } else if (self.resolution == 'year') {
                            resX = "01/01/" + resX;
                        }
                        else if (self.resolution == 'month') {
                            var arrayObjDate = resX.split("-");
                            resX = arrayObjDate[1] + "/01/" + arrayObjDate[0];
                        }
                        else if (self.resolution == 'day') {
                            var arrayObjDate = resX.split("-");
                            resX = arrayObjDate[1] + "/" + arrayObjDate[2] + "/" + arrayObjDate[0];
                        }
                        return (self.xScale(getDate(resX)));
                    }
                })
                .style("opacity", circleOpacity)
                .attr("cy", function (d, i) {
                    var res = d.split("|");
                    var resY = res[1];
                    return self.yArray[cntLine](resY);
                })
                .attr("r", 0)                
                .attr("class", classCircle)
                .style("stroke-width", self.radius)
                .style("stroke", function (d, i) {
					var colorToReturn;

                    if (colorCircle) {
                        colorToReturn = colorCircle;
                    } else {
                        colorToReturn = colorScale(keyCircle);
                    }
                    return colorToReturn;

                })
                .on("mouseover", function (d, i) {

                        var s = d3.select(this).attr("style");
                        var indexS = s.indexOf("opacity: 0");

                        if (indexS > -1) {

                        } else {
                            d3.select(this).classed("pointOn", true);

                            var circle = d3.select(this);
                            circle.transition().attr("r", self.radius * 2);
                            var posMouse = d3.mouse(this);

                            var res = d.split("|");
                            var resX = res[0];
                            var resY = res[1];

                            if (self.resolution == 'quarter') {
                                var arrayObjDate = resX.split("-");

                                var newMonth = 1;

                                if ((arrayObjDate[1] == 'Q1') || (arrayObjDate[1] == 'Q2') || (arrayObjDate[1] == 'Q3') || (arrayObjDate[1] == 'Q4')) {
                                    var Q = arrayObjDate[1].replace("Q", "");
                                    newMonth = parseInt((Q * 3) - 2);
                                    if (newMonth < 10) {
                                        newMonth = "0" + newMonth;
                                    }

                                    var dateToPush = arrayObjDate[0] + "-" + newMonth + "-01";
                                    resX = dateToPush;
                                }
                            } else if (self.resolution == 'year') {
                                resX = "01/01/" + resX;
                            }
                            else if (self.resolution == 'month') {
                                resX = resX + "/01";
                            }
                            else if (self.resolution == 'day') {
                                resX = resX;
                            }
                            resX = resX.replace("/", "-");
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

                            var endDateToPlot = "";
                            if (self.xaxeformat == 'sequence') {
                                endDateToPlot = resX;
                            } else {
                                if (self.resolution == 'day') {
                                    endDateToPlot = monthNames[parseInt(resSplit[1])] + " " + parseInt(resSplit[2]) + ", " + resSplit[0];
                                } else if (self.resolution == 'month') {
                                    endDateToPlot = monthNames[parseInt(resSplit[1])] + ", " + parseInt(resSplit[0]);
                                } else if (self.resolution == 'year') {
                                    endDateToPlot = +parseInt(resSplit[2]);
                                }

                                else if (self.resolution == 'quarter') {
                                    var Q = "Q1";
                                    if (resSplit[1] <= 3) {
                                        Q = "Q1";
                                    } else if (resSplit[1] <= 6) {
                                        Q = "Q2";
                                    } else if (resSplit[1] <= 9) {
                                        Q = "Q3";
                                    } else {
                                        Q = "Q4";
                                    }
                                    endDateToPlot = Q + "-" + resSplit[0];
                                }
                            }

                            var twoPlacedFloat = (parseFloat(resY * 100) / 100).toFixed(2);
                            var resSplit = keyCircle.split("_");
                            var number = resY;
                            number = (parseFloat(number * 100) / 100).toFixed(2);

                            var formatdecimal = 0;
                            formatdecimal = Math.round(number / 100) + 1;

                            if (formatdecimal < 2) {
                                formatdecimal = 2;
                            } else if (formatdecimal > 4) {
                                formatdecimal = 4;
                            } else if (formatdecimal == 2) {
                                formatdecimal = 2;
                            }

                            if (formatdecimal > 2) {
                                var si = d3.format('.' + formatdecimal + 's');
                                number = si(number);
                            }

                            if (showAsPercentatge) {
                                units = " %";
                            }

                            tooltip.style("opacity", 1.0).html("<div class='tooltip-arrow'></div><div class='tooltip-inner ng-binding' ng-bind='content'><font color='" + colorCircle + "'>" + resSplit[0] + "<br/>" + endDateToPlot + " <br /> " + number + " " + units + "</font></div>");

                        }
                    })
                    .on("mouseout", function (d, i) {
                        d3.select(this).classed("pointOn", false);
                        var circle = d3.select(this);
                        circle.transition().attr("r", self.radius);
                        mouseout();
                    }).on("click", function (d, i) {

                        if (self.modeGraph == 'view') {

                        } else {
                            if (self.xaxeformat == 'sequence') {

                            } else {
                                var posMouse = d3.mouse(this);
                                var posX = posMouse[0];
                                posX = posX + self.margin.left;
                                var posY = posMouse[1];
                                var maxPosX = self.width + self.margin.left;
                                var posXinvers = "";
                                if (posX > maxPosX) {
                                    posXinvers = ""
                                } else {
                                    if (self.xScale) {
                                        posXinvers = self.xScale.invert(posX - self.margin.left);
                                        var format = d3.time.format("%m-%d-%Y");
                                        posXinvers = format(posXinvers);
                                        posXinvers = posXinvers.replace(/-/g, "/");
                                    }
                                }

                                var format = d3.time.format("%m-%d-%Y");
                                var maxDateGraph = format(self.maxDate);
                                maxDateGraph = maxDateGraph.replace(/-/g, "/");

                                $('input[name="startDatePosX"]').val(posXinvers);
                                $('input[name="endDatePosX"]').val(maxDateGraph);

                                document.getElementById("addHEbutton").click();
                            }
                        }

                    }).transition().attr("r", self.radius).duration(2000)

                ;
            });
        }

		
		
        

        //delete this trnsition because causes problems in chrome per linux
        /*
         self.svg
         .attr("transform", "translate(0, "+self.height+") scale(1, 0)")
         .transition().duration(500)
         .attr("transform", "translate("+self.margin.left+", "+self.margin.top+") scale(1, 1)")
         ;
         */

    }


	var plotEvents = function (eventsData, colorScaleForHE, getDate) {
		
		/*************Ini plot historical events *******/
		
        var dataForCircles = [];

        for (var i in eventsData) {
            var arrayTemporal = [];
            arrayTemporal['index'] = i;
            arrayTemporal['color'] = eventsData[i].color;
            arrayTemporal['title'] = eventsData[i].title;
            arrayTemporal['startDate'] = eventsData[i].startDate;
            arrayTemporal['endDate'] = eventsData[i].endDate;

            arrayTemporal['posY'] = 0;
            arrayTemporal['desc'] = eventsData[i].desc;
            dataForCircles[i] = arrayTemporal;
        }

        var historicalEvents = self.svg.selectAll("rectagles").data(dataForCircles);


        historicalEvents.enter().append("rect").attr("class", "lineXDisco")                   
            .style("stroke", function (d, i) {                
                var colorToPlot = colorScaleForHE(d.index);
                if (d.color) {
                    colorToPlot = d.color;
                }
                return colorToPlot;
            })
            .style("fill", function (d, i) {
                var colorToPlot = colorScaleForHE(d.index);
                if (d.color) {
                    colorToPlot = d.color;
                }
                return colorToPlot;
            }).attr("opacity", 0.5).attr("x", function (d, i) {
                var posXToPlot = self.xScale(getDate(d.startDate));

                if (isNaN(posXToPlot)) {
                    posXToPlot = 1;
                }
                return posXToPlot;
            }).attr("y", 0).attr("width", function (d, i) {
                var dif = "1";
                if (d.endDate != "") {
                    dif = self.xScale(getDate(d.endDate)) - self.xScale(getDate(d.startDate));
                } else {
                    dif = 1;
                }

                if (dif <= 0) {
                    dif = 1;
                }

                if (isNaN(dif)) {
                    dif = 1;
                }
                return dif;
            }).attr("height", self.height).on("mouseover", function (d, i) {
                d3.select(this).style("stroke-width", 2);

                var textTooltip = "";

                if (d.startDate) {
                    var resSplit = d.startDate.split("-");
                } else {
                    var resSplit = [];
                }
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

                var startDateToPlot = monthNames[parseInt(resSplit[1])] + " " + parseInt(resSplit[2]) + ", " + resSplit[0];


                textTooltip = d.title + "<br /> From: " + startDateToPlot;
                if (d.endDate != "") {
                    if (d.endDate) {
                        var resSplit = d.endDate.split("-");
                    } else {
                        var resSplit = [];
                    }
                    var endDateToPlot = monthNames[parseInt(resSplit[1])] + " " + parseInt(resSplit[2]) + ", " + resSplit[0];
                    textTooltip = textTooltip + " <br /> To: " + endDateToPlot;

                }
                if (d.desc != "") {
                    textTooltip = textTooltip + "<br/> Desc.: " + d.desc;
                }

                var posXToPlot = self.xScale(getDate(d.startDate));
                if (posXToPlot > 0) {

                    tooltip.style("opacity", 1.0).html("<div class='tooltip-arrow'></div><div class='tooltip-inner ng-binding' ng-bind='content'>" + textTooltip + "</div>");

                }

            }).on("mouseout", function (d, i) {
                mouseout();
                d3.select(this).style("stroke-width", 1);
            })

        /******** end plot historical events ***********/		
	}

    /* function to plot the pointer mouse */
    var handleMouseOverGraph = function (posMouse) {
        var mouseX = posMouse[0];
        var mouseY = posMouse[1];

        if (self.hoverLineX) {
            if (mouseX - self.margin.left >= 0 && mouseX <= self.width + self.margin.left && mouseY - self.margin.top >= 0 && mouseY - self.margin.top - self.margin.bottom <= self.height - self.margin.bottom) {
                // show the hover line
                self.hoverLineX.classed("hide", false);
                self.hoverLineX.attr("x1", mouseX - self.margin.left).attr("x2", mouseX - self.margin.left);
                self.hoverLineY.classed("hide", false);
                self.hoverLineY.attr("y1", mouseY - self.margin.top).attr("y2", mouseY - self.margin.top);
            } else {
                self.hoverLineX.classed("hide", true);
                self.hoverLineY.classed("hide", true);
            }
        }
    }

    /*** funtion to init. graph ***/
    self.init = function () {

        var mousemove = function () {
            tooltip.style("left", (d3.event.pageX + 20) + "px").style("top", (d3.event.pageY - 12) + "px");
        };

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
            self.margin = self.maxMargin;
            self.width = self.maxWidth;
            self.height = self.maxHeight;
            self.font_size = self.maxFont_size;
            self.radius = self.maxRadius;
            self.dymarging = self.maxDymarging;
            self.offsetYaxesR = self.maxOffsetYaxesR;
            self.offsetYaxesL = self.maxOffsetYaxesL;
            self.distanceXaxes = self.maxDistanceXaxes;
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

            self.margin = {
                'top': self.maxMargin.top * newScale,
                'right': self.maxMargin.right * newScale,
                'bottom': self.maxMargin.bottom * newScale,
                'left': self.maxMargin.left * newScale
            };
            self.height = self.maxHeight * newScale;

            if (self.height > self.maxHeight) {
                self.height = self.maxHeight;
            }

            self.font_size = self.maxFont_size * newScale;
            self.radius = self.maxRadius * newScale;
            self.dymarging = self.maxDymarging * newScale;
            self.offsetYaxesR = self.maxOffsetYaxesR * newScale;
            self.offsetYaxesL = self.maxOffsetYaxesL * newScale;
            self.distanceXaxes = self.maxDistanceXaxes * newScale;
        }


//************************************************************
// Zoom specific updates
//************************************************************


        self.svg = d3.select(self.parentSelect)
        .append("svg").attr("class", "pc_chart")
        .attr("width", self.width + self.margin.left + self.margin.right)
        .attr("height", self.height + self.margin.top + self.margin.bottom)
        //.call(d3.behavior.zoom().on("zoom", redraw))
		.on("mousemove", function (d, i) {
            var posMouse = d3.mouse(this);
            var posX = posMouse[0];
            var posY = posMouse[1];
            handleMouseOverGraph(posMouse);
            mousemove();
		})
		.on("click", function (d, i) {
            if (self.xaxeformat == 'sequence') {
            } else {

            }
		})
		.append("g")
		.attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");
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

    /* function to Plot data into the graph*/
    self.render = function (dataToPlot, eventsData, modeGraph) {

        self.modeGraph = modeGraph;

        self.dataToPlot = dataToPlot;
        self.eventsData = eventsData;
        self.modeGraph = modeGraph;

        if (dataToPlot) {
            if (Object.keys(dataToPlot).length === 0) {

                self.svg.append("text").text("No data to plot. Add datasets").attr("class", "nodatatoplot").attr("x", self.margin.left).attr("y", self.margin.top)
            } else {

                var dataToPlotUpdate = self.clone(dataToPlot);
                self.drawLines(dataToPlotUpdate, eventsData);

            }
        }
    }


    self.init();

    return self;


}

"use strict";

function piechartdisplay() {
    var selectedValue = $('#dateselector').val();
    if (isNaN(selectedValue)) {
        $('.pie_' + self.visualizationid).show();
    } else {
        $('.pie_' + self.visualizationid).hide();
        $('#pie_' + self.visualizationid + '_' + selectedValue).show();

    }

}

var policycompass = policycompass || {
        'version': 0.1,
        'controller': {},
        'viz': {},
        'extras': {}
    };

// Computes the angle of an arc, converting from radians to degrees.
function angle(d) {
    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
    return a > 90 ? a - 180 : a;
}


policycompass.viz.pie = function (options) {

    var self = {};

    for (var key in options) {
        self[key] = options[key];
    }

    self.clicToOpen = true;

    self.parentSelect = "#" + self.idName;

    self.maxMargin = self.margin;
    self.maxWidth = self.width;
    self.maxHeight = self.height;
    self.maxRadius = self.radius;
    self.maxInnerRadious = self.innerRadious;
    self.maxFont_size = self.font_size;

    self.cntResizes = 0;
    d3.select(window).on('resize', resize);

    function resize() {
        self.cntResizes = self.cntResizes + 1;
        if (self.cntResizes > 1) {
            var element = document.getElementById(self.parentSelect.replace("#", ''));
            element.innerHTML = "";
            self.init();
            self.render(self.piesArray);
        } else {
            self.init();
        }
    }

    self.drawArcs = function (piesArray) {
        var resSplitidName = self.idName.split("_");
        var showLegend = self.showLegend;
        var showLabels = self.showLabels;

        var pies = piesArray.Values;
        var pieslabels = piesArray.Labels;

        var pie = d3.layout.pie().sort(null).value(function (d) {
            return d;
        });

        var arc = self.arc = d3.svg.arc().outerRadius(self.radius - self.margin.top).innerRadius(self.innerRadious);
        var colorScale = d3.scale.category20();

        self.arcOver = d3.svg.arc().outerRadius(self.radius + self.margin.top / 4).innerRadius(self.innerRadious);


        self.g = self.svg.selectAll(".arc_pie_" + self.idName).data(pie(pies)).enter().append("svg:g").attr("id", function (d, i) {
            return "arc_pie_" + self.idName + "_" + i;
        }).attr("class", "arc arc_pie_" + self.idName).attr("stroke", "rgb(255, 255, 255)").attr("stroke-width", "2px").on("click", function (d, i) {
            if (self.clicToOpen) {
                d3.select(this).select("path").transition().duration(1000).attr("d", self.arcOver);
                self.clicToOpen = false;
            } else {
                d3.select(this).select("path").transition().duration(1000).attr("d", self.arc);
                self.clicToOpen = true;
            }
        }).on("mouseover", function (d, i) {

            var resSplit = pieslabels[i];
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
            var startDateToPlot = pieslabels[i];

            var sumatotal = 0;
            for (var ij = 0; ij < pies.length; ij++) {
                sumatotal = parseInt(sumatotal) + parseInt(pies[ij]);
            }
            var average = Math.round((pies[i] * 100 / sumatotal), 2);
            var number = pies[i];
            number = (parseFloat(number * 100) / 100).toFixed(2);
            
            var formatdecimal = 0;
            formatdecimal = Math.round(number / 100) + 1;

            if (formatdecimal < 2) {
                formatdecimal = 2;
            } else if (formatdecimal > 4) {
                formatdecimal = 4;
            }
						
            var si = d3.format('.' + formatdecimal + 's');
			
			if (formatdecimal > 2) {
            	if (number != "0.00") {
                	number = si(number);
            	}
           	}
            
            if (isNaN(average)) {
            	var textToReturn = number;
            }
            else {
            	var textToReturn = number + " (" + average + "%)";	
            }
            
            tooltip.style("opacity", 1.0).html("<div class='tooltip-arrow'></div><div class='tooltip-inner ng-binding' ng-bind='content'>" + startDateToPlot + "<br />" + textToReturn + "</div>");

        })
		.on("mouseout", function (d, i) {
                self.clicToOpen = true;
                tooltip.style("opacity", 1.0).html("");
                tooltip.style("opacity", 0.0);
                d3.select(this).select("path").transition().duration(1000).attr("d", self.arc);
		});

        self.g.append("path").attr("d", self.arc).style("fill", function (d, i) {
            var colorToReturn;
            colorToReturn = colorScale(i);

            if (piesArray.Colors) {
                if (piesArray.Colors[i]) {
                    colorToReturn = piesArray.Colors[i];
                }
            }
            return colorToReturn;

        });

        if (showLabels) {
            var labelr = self.radius + 5;

            self.g.append("svg:text")
            .attr("class", "text text_pie_" + self.idName)
			.attr("transform", function (d, i) {
                var sumatotal = 0;
                for (var ij = 0; ij < pies.length; ij++) {
                    sumatotal = parseInt(sumatotal) + parseInt(pies[ij]);
                }

                var average = Math.round((pies[i] * 100 / sumatotal), 2);

                if (average < 3) {
                    var c = arc.centroid(d), x = c[0], y = c[1], // pythagorean theorem for hypotenuse
                        h = Math.sqrt(x * x + y * y);

                    return "translate(" + (x / h * labelr) + ',' + (y / h * labelr) + ")";
                } else {
                    return "translate(" + self.arc.centroid(d) + ") rotate(" + angle(d) + ") ";
                }                  
			})
			.attr("font-size", self.font_size)
			.attr("stroke", "rgb(0, 0, 0)")
			.attr("stroke-width", "0px")
			.style("text-anchor", "middle")
			.text(function (d, i) {
				
                var sumatotal = 0;
                for (var ij = 0; ij < pies.length; ij++) {
                	if (pies[ij] != null) {                	
                    	sumatotal = parseInt(sumatotal) + parseInt(pies[ij]);
                   }
                }

                var average = Math.round((pies[i] * 100 / sumatotal), 2);
                var number = pies[i];
                number = (parseFloat(number * 100) / 100).toFixed(2);
				
                var formatdecimal = 0;
                formatdecimal = Math.round(number / 100) + 1;

                if (formatdecimal < 2) {
                    formatdecimal = 2;
                } else if (formatdecimal > 4) {
                    formatdecimal = 4;
                }

                var si = d3.format('.' + formatdecimal + 's');
				
				if (formatdecimal > 2) {
                	if (number != "0.00") {
                    	number = si(number);
                	}
				}
				
                //var textToReturn = number + " (" + average + "%)";

				if (isNaN(average)) {                    	
                    var textToReturn = number;
                }
                else {
                	var textToReturn = number + " (" + average + "%)";
                }
				

                if (average < 3) {
                    return ("");
                } else {
                    return (textToReturn);
                }

			});
        }


        if (showLegend) {
            if (piesArray['Units'].length > 0) {
                self.svg.append("text")
                    .attr("y", self.radius)
                    .attr("dy", ".35em")
                    .attr("text-anchor", "center")
                    .attr("class", "link superior legend value")
                    .attr("font-size", self.font_size)
                    .style("stroke", function (d, i) {
                        return 'black';
                    }).text(function (d, i) {
                        var resTRext = piesArray['Key'].split("_");
                        var labelY = "";

                        var arrayLabelsToPlot = [];
                        for (var ij = 0; ij < piesArray['Units'].length; ij++) {
                            var a = arrayLabelsToPlot.indexOf(piesArray['Units'][ij]);

                            if (a == -1) {
                                arrayLabelsToPlot.push(piesArray['Units'][ij]);
                                if (labelY != "") {

                                    labelY = labelY + ",";
                                }
                                labelY = labelY + " " + piesArray['Units'][ij];
                            }
                        }
                        
                        if (labelY != "  ") {
                            return resTRext + " (" + labelY + " )";
                        } else {
                            return resTRext;
                        }

                    })

            }

            var legend = self.svg.selectAll(".legend_pie_" + self.idName)
                .data(pie(pies)).enter().append("svg:g")
                .attr("transform", function (d, i) {
                    var posFinal = 0 - (self.height / 2);
                    posFinal = posFinal + i * 20
                    return "translate(0, " + posFinal + ")";
                });

            legend.append("rect")
                .attr("x", self.radius + 5).attr("width", 5).attr("height", 5).style("fill", function (d, i) {


                    var colorToReturn;
                    colorToReturn = colorScale(i);
                    if (piesArray.Colors) {
                        if (piesArray.Colors[i]) {
                            colorToReturn = piesArray.Colors[i];
                        }
                    }

                    return colorToReturn;

                });

            legend.append("text")
                .attr("x", self.radius + 5 + 5 + 5)
                .attr("y", 9)
                .attr("font-size", self.font_size)
                .attr("dy", "-.30em")                
                .style("fill", function (d, i) {

                    var colorToReturn;
                    colorToReturn = colorScale(i);
                    if (piesArray.Colors) {
                        if (piesArray.Colors[i]) {
                            colorToReturn = piesArray.Colors[i];
                        }
                    }

                    return colorToReturn;
                }).text(function (d, i) {
                    var sumatotal = 0;
                    for (var ij = 0; ij < pies.length; ij++) {
                    	if (pies[ij] != null) {
                    		sumatotal = parseInt(sumatotal) + parseInt(pies[ij]);	
                    	}                        
                    }
                    var average = Math.round((pies[i] * 100 / sumatotal), 2);
                    var number = pies[i];

                    if (number != null) {
                    	number = (parseFloat(number * 100) / 100).toFixed(2);
                    }
                    
                    
                    var formatdecimal = 0;
                    formatdecimal = Math.round(number / 100) + 1;

                    if (formatdecimal < 2) {
                        formatdecimal = 2;
                    } else if (formatdecimal > 4) {
                        formatdecimal = 4;
                    }

                    var si = d3.format('.' + formatdecimal + 's');
					
					if (formatdecimal > 2) {
                    	if (number != "0.00") {
                        	number = si(number);
                    	}
					}
                   
                    var resTRext = pieslabels[i];
                    var length = 42;
                    if (resTRext.length > length) {
						resTRext = resTRext.substring(0, length) + "...]";
					}
                            
                    //var textToReturn = pieslabels[i] + " (" + number + " - " + average + "%)";
                    
                    if (isNaN(average)) {
                    	var textToReturn = resTRext + " (" + number + ")";
                    }
                    else {
                    	if (number == null) {
                    		number = 'no data';
                    	}
                    	var textToReturn = resTRext + " (" + number + " - " + average + "%)";
                    }
                    
                    return textToReturn;
                })
                .on("mouseover", function (d, i) {
                	
                	var sumatotal = 0;
                    for (var ij = 0; ij < pies.length; ij++) {
                        sumatotal = parseInt(sumatotal) + parseInt(pies[ij]);
                    }
                    var average = Math.round((pies[i] * 100 / sumatotal), 2);
                    var number = pies[i];
                    number = (parseFloat(number * 100) / 100).toFixed(2);
                    var formatdecimal = 0;
                    formatdecimal = Math.round(number / 100) + 1;

                    if (formatdecimal < 2) {
                        formatdecimal = 2;
                    } else if (formatdecimal > 4) {
                        formatdecimal = 4;
                    }

                    var si = d3.format('.' + formatdecimal + 's');
					
					if (formatdecimal > 2) {
                    	if (number != "0.00") {
                        	number = si(number);
                    	}                   
					}
					
					if (isNaN(average)) {
                    	var str = pieslabels[i] + " (" + number + ")";
                    }
                    else {
                    	var str = pieslabels[i] + " (" + number + " - " + average + "%)";
                    }
                    
					tooltip.style("opacity", 1.0).html('<div class="tooltip-arrow"></div><div class="tooltip-inner ng-binding" ng-bind="content">' + str + '</div>');
				})
				.on("mouseout", function () {
					tooltip.style("opacity", 1.0).html("");
					tooltip.style("opacity", 0.0);
                })                
                ;
        }
    }


    self.init = function () {

        var mousemove = function () {
            tooltip.style("left", (d3.event.pageX + 20) + "px")
            .style("top", (d3.event.pageY - 12) + "px");
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
            self.width = self.maxWidth;
            self.height = self.maxHeight;
            self.radius = self.maxRadius;
            self.innerRadious = self.maxInnerRadious;
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
            self.radius = self.maxRadius * newScale;
            self.innerRadious = self.maxInnerRadious * newScale;
            self.font_size = self.maxFont_size * newScale;
            self.margin = {
                'top': self.maxMargin.top * newScale,
                'right': self.maxMargin.right * newScale,
                'bottom': self.maxMargin.bottom * newScale,
                'left': self.maxMargin.left * newScale
            };

        }

        self.svg = d3.select(self.parentSelect)
        .append("svg").attr("class", "pc_chart")
        .attr("id", "graph_" + self.idName)
        .attr("width", self.width + self.margin.right + self.margin.left)
        .attr("height", self.height + self.margin.top + self.margin.bottom)
        .on("mousemove", mousemove)
        .append("g")
        .attr("transform", "translate(" + (self.width + self.margin.right + self.margin.left) / 2 + "," + (self.height + self.margin.top + self.margin.bottom) / 2 + ")");
    }

    self.render = function (piesArray) {

        self.piesArray = piesArray;

        if (Object.keys(piesArray).length === 0) {
            self.svg.append("text")
            .text("No data to plot.")
            .attr("class", "nodatatoplot")
            .attr("x", self.margin.left)
            .attr("y", self.margin.top);

        } else {
            self.drawArcs(piesArray);
        }

    }

    self.init();
    return self;
}


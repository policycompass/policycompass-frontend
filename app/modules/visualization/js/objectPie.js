"use strict";
var policycompass = policycompass || {'version':0.1, 'controller':{}, 'viz': {} ,'extras': {}};

		      	// Computes the angle of an arc, converting from radians to degrees.
    function angle(d) {
      var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
      return a > 90 ? a - 180 : a;
    }

policycompass.viz.pie = function(options)
{

    // Object

	var self = {};
    // Get options data

	for (var key in options){
        self[key] = options[key];
	}
	
	self.clicToOpen = true;
	
    self.parentSelect = "#"+self.idName;
    //console.log("self.parentSelect="+self.parentSelect);
    
    self.drawArcs = function (piesArray) 
    {
    	//console.log("drawArcs");
		var showLegend = self.showLegend;
		var showLabels = self.showLabels;
	
		var pies = piesArray.Values;
		var pieslabels = piesArray.Labels;
		
		//console.log(pies);		
  		var pie = d3.layout.pie()
  			.sort(null)
  			.value(function(d) {
  				//console.log(d);  				
  				return d;
  			});
  		/*		
		var arc = d3.svg.arc()
  			.innerRadius(self.radius - 100)
  			.outerRadius(self.radius - 20);
  		*/
  		//var arc = d3.svg.arc()
  		var arc = self.arc = d3.svg.arc()
  			.outerRadius(self.radius - self.margin)  			
  			.innerRadius(self.innerRadious);
 
  
		//var myBars = self.svg.selectAll("rect").data(bars);
		var colorScale = d3.scale.category20();

		//var arcOver 
		self.arcOver = d3.svg.arc() 
			.outerRadius(self.radius + self.margin/4)
			.innerRadius(self.innerRadious);
			; 
       
		//var g 
		self.g = self.svg.selectAll(".arc_pie_"+self.idName)
			.data(pie(pies))
			.enter().append("svg:g")
			.attr("id", function(d,i) { return "arc_pie_"+self.idName+"_"+i;})
			.attr("class", "arc arc_pie_"+self.idName)
			.on("click", function(d, i) { 
				//console.log(this);
				if (self.clicToOpen)
				{
					//console.log("true");
					d3.select(this).select("path").transition()
						.duration(1000)
						.attr("d", self.arcOver);	
					self.clicToOpen = false;
				}
				else {
					d3.select(this).select("path").transition()
               		.duration(1000)
               		.attr("d", self.arc);
               		self.clicToOpen = true;
				}
			})			
			.on("mouseover", function(d, i) {
				
				var resSplit = pieslabels[i].split("-");
				var monthNames = [ "", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
		    				
				var startDateToPlot = monthNames[parseInt(resSplit[1])]+" "+parseInt(resSplit[2])+", "+resSplit[0];
				
				
				//tooltip.style("opacity",1.0).html(pieslabels[i]+"<br />"+pies[i]);
				tooltip.style("opacity",1.0).html(startDateToPlot+"<br />"+pies[i]);
				})
				
        	.on("mouseout", function(d, i) {
        		self.clicToOpen = true;
        		tooltip.style("opacity",0.0);
				d3.select(this).select("path").transition()
               		.duration(1000)
               		.attr("d", self.arc);              
			});
		//console.log(g);	
		
		self.g.append("path")
			.attr("d", self.arc)		      
		    .style("fill", function(d,i) {return colorScale(i);});
		
		if (showLabels)
		{
			
		  	self.g.append("svg:text")
		  	  .attr("class", "text text_pie_"+self.idName) 
		      .attr("transform", function(d) {return "translate(" + self.arc.centroid(d) + ") rotate("+angle(d)+") ";})	      
		      .attr("dy", ".35em")
		      .style("text-anchor", "middle")
		      .text(function(d,i) {
		      	//var textToReturn = pieslabels[i]+": "+pies[i];
		      	var textToReturn = pies[i];		      	 
		      	return (textToReturn); 
		      	});		
		      

      		      	

      	
		}

		if (showLegend)
		{
			var legend = self.svg.selectAll(".legend_pie_"+self.idName)
			//.data(months.slice().reverse())
				.data(pie(pies))
				.enter().append("svg:g")		    		
				//.attr("class", "legend_pie_"+self.idName)
				//.attr("transform", function(d, i) {return "translate(0,"  + (i * 20) + ")";});
				.attr("transform", function(d, i) {		      			
					var posFinal = 0-(self.height/2);
					posFinal = posFinal + i * 20		      			
					return "translate(0, "+posFinal+")";		      			
				});
		
			legend.append("rect")
		  		//.attr("class", "rect_pie_"+self.idName) 
		    	.attr("x", self.radius + 5)	   		      		 	
		    	.attr("width", 18)
		    	.attr("height", 18)
		    	.style("fill", function(d,i) {return colorScale(i);});
		
		  	legend.append("text")
		  		//.attr("class", "text_pie_"+self.idName) 
		    	.attr("x", self.radius + 5 + 18+ 5)
		    	.attr("y", 9)
		    	.attr("dy", ".35em")
		    	//.style("text-anchor", "end")
		    	.text(function(d,i) {
					var textToReturn = pieslabels[i];
					//textToReturn = textToReturn+": "+pies[i];
					return textToReturn;
				});
				
								
			}
	}
    

    self.init = function () {
		//console.log("self.init "+self.idName);
		self.svg = d3.select(self.parentSelect).append("svg")
					.attr("id", "graph_"+self.idName)
                    .attr("width", self.width+self.margin*2)
                    .attr("height", self.height+self.margin*2)
                    .on("mousemove", mousemove)
                    //.on("mouseover", console.log("aaaaaaa"))
                    .style("float","left")
                    .append("g")
                    	.attr("transform", "translate(" + (self.width+self.margin*2) / 2 + "," + (self.height+self.margin*2) / 2 + ")")
                    ;
	}

    self.render = function(piesArray){
		
		//console.log(piesArray);
		
		if (Object.keys(piesArray).length === 0)
		{
			console.log("No data");
			
			self.svg.append("text")
              .text("No data to plot. Add metrics")
              .attr("class", "nodatatoplot")
              .attr("x", self.margin.left)
              .attr("y", self.margin.top)
			
		}
		else
		{
			//console.log("bbbbb");
			self.drawArcs(piesArray);
		}			
		
	}


    self.init();

    return self;


}


/******************/
  
 
 
/*****************/
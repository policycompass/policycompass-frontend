"use strict";

function piechartdisplay()
{
	var selectedValue = $('#dateselector').val();
	if (isNaN(selectedValue))
	{
		$('.pie_'+self.visualizationid).show();
	}
	else
	{
		$('.pie_'+self.visualizationid).hide();	
		$('#pie_'+self.visualizationid+'_'+selectedValue).show();
		
	}
	
	
}
				
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
    

	self.maxWidth = self.width;
	self.cntResizes = 0;
	d3.select(window).on('resize', resize);
	
	function resize() {		
		self.cntResizes = self.cntResizes+1;
		if (self.cntResizes>1)
		{
			var element=document.getElementById(self.parentSelect.replace("#",''));
			element.innerHTML = "";		
			self.init();	
			self.render(self.piesArray);
		}
		else
		{
			self.init();
		}
	}
	    
    //console.log("self.parentSelect="+self.parentSelect);
    
    self.drawArcs = function (piesArray) 
    {
    	//console.log("drawArcs");
    	
    	var resSplitidName = self.idName.split("_");
    	//console.log("idName="+self.idName);
    	//console.log(piesArray);
    	
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
  			.outerRadius(self.radius - self.margin.top)  			
  			.innerRadius(self.innerRadious);
 
  
		//var myBars = self.svg.selectAll("rect").data(bars);
		var colorScale = d3.scale.category20();

		//var arcOver 
		self.arcOver = d3.svg.arc() 
			.outerRadius(self.radius + self.margin.top/4)
			.innerRadius(self.innerRadious);
			; 
       
       
       
		//var g 
		self.g = self.svg.selectAll(".arc_pie_"+self.idName)
			.data(pie(pies))
			.enter().append("svg:g")
			.attr("id", function(d,i) { return "arc_pie_"+self.idName+"_"+i;})
			.attr("class", "arc arc_pie_"+self.idName)
			.attr("stroke", "rgb(255, 255, 255)")
			.attr("stroke-width", "2px")
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
		    				
				//var startDateToPlot = monthNames[parseInt(resSplit[1])]+" "+parseInt(resSplit[2])+", "+resSplit[0];
				var startDateToPlot = pieslabels[i];

				var sumatotal=0;
		      	for (var ij=0; ij<pies.length; ij++){
		      		sumatotal = parseInt(sumatotal) + parseInt(pies[ij]); 
		      	}
		      	
		      	//console.log("sumatotal="+sumatotal);
		      	var average = Math.round((pies[i]*100/sumatotal),2);
		      	var number = pies[i];
		      	//number =  Math.round(number, 2);

		      	number = (parseFloat(number * 100) / 100).toFixed(2);
		      	
		      	var formatdecimal = 0;

        		formatdecimal = Math.round(number/100)+1;
        
        		if (formatdecimal<2)
        		{
        			formatdecimal =2;
        		}
        		else if (formatdecimal>4)
        		{
        			formatdecimal =4;
        		} 
		      	
		      	var si = d3.format('.'+formatdecimal+'s');
		      	
		      	number = si(number);
		      	
		      	var textToReturn = number + " ("+average+"%)";
		      					
				//tooltip.style("opacity",1.0).html(pieslabels[i]+"<br />"+pies[i]);
				tooltip.style("opacity",1.0).html(startDateToPlot+"<br />"+textToReturn);
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
		    .style("fill", function(d,i) {
		    	//console.log("i="+i);
					var colorToReturn;		        	  
					colorToReturn = colorScale(i);
					if (piesArray.Colors)
					{
		        	   	if (piesArray.Colors[i])
		        	   	{
		        	   		colorToReturn = piesArray.Colors[i]; 
		        	 	}
		        	}
		        	return colorToReturn;
		    	
		    	//return colorScale(i);
		    	
		    });
		
		if (showLabels)
		{
			var labelr = self.radius + 5;
			
		  	self.g.append("svg:text")
		  	  .attr("class", "text text_pie_"+self.idName)
		  	  //.style("stroke", function(d,i) {return colorScale(i);})
		  	 /* 
.attr("transform", function(d) {
        var c = arc.centroid(d),
            x = c[0],
            y = c[1],
            // pythagorean theorem for hypotenuse
            h = Math.sqrt(x*x + y*y);
            
            console.log("x="+x);
            console.log("y="+y);
			console.log("h="+h);

        return "translate(" + (x/h * labelr) +  ',' +
           (y/h * labelr) +  ")"; 
    })		*/  	  
		  	  
		  	   
		      .attr("transform", function(d,i) {
		      	
		      	var sumatotal=0;
		      	for (var ij=0; ij<pies.length; ij++){
		      		sumatotal = parseInt(sumatotal) + parseInt(pies[ij]); 
		      	}
		      	
		      	var average = Math.round((pies[i]*100/sumatotal),2);

		      	if (average<3)
		      	{
		      		 var c = arc.centroid(d),
		             x = c[0],
        			 y = c[1],
            		// pythagorean theorem for hypotenuse
            		h = Math.sqrt(x*x + y*y);
            
        			return "translate(" + (x/h * labelr) +  ',' + (y/h * labelr) +  ")";
		      	}		
		      	else
		      	{
		      		return "translate(" + self.arc.centroid(d) + ") rotate("+angle(d)+") ";	
		      	}
		      	//console.log((d));
		      	
		      	
		      	})	
		         
		      //.attr("dy", ".35em")
		      .attr("font-size", self.font_size)
		      
	   			.attr("stroke", "rgb(0, 0, 0)")
				.attr("stroke-width", "0px")


		      .style("text-anchor", "middle")
		      .text(function(d,i) {
		      	//var textToReturn = pieslabels[i]+": "+pies[i];
		      	var sumatotal=0;
		      	for (var ij=0; ij<pies.length; ij++){
		      		sumatotal = parseInt(sumatotal) + parseInt(pies[ij]); 
		      	}
		      	
		      	//console.log("sumatotal="+sumatotal);
		      	var average = Math.round((pies[i]*100/sumatotal),2);
		      	var number = pies[i];
		      	//number =  Math.round(number, 2);		      	
		      	number = (parseFloat(number * 100) / 100).toFixed(2);
		      	
		      	var formatdecimal = 0;

        		formatdecimal = Math.round(number/100)+1;
        
        		if (formatdecimal<2)
        		{
        			formatdecimal =2;
        		}
        		else if (formatdecimal>4)
        		{
        			formatdecimal =4;
        		} 
		      	
		      	var si = d3.format('.'+formatdecimal+'s');
		      	
		      	number = si(number);
		      	
		      	var textToReturn = number + " ("+average+"%)";	
		      	
		      	if (average<3)
		      	{
		      		//console.log("average="+average);
		      		return ("");
		      	}	
		      	else
		      	{
		      		return (textToReturn);	
		      	}      	 
		      	 
		      	});		
      	
		}



		    	
		if (showLegend)
		{
			//console.log(piesArray['Units'].length)
			if (piesArray['Units'].length>0)
			{
				self.svg.append("text")
		    		//.attr("x", -self.radius/2)		    	
		    		//.attr("x", self.radius)
		    		.attr("y", self.radius)
		    		.attr("dy", ".35em")
					.attr("text-anchor","center")
					.attr("class", "link superior legend value")				
					.attr("font-size", self.font_size)
					.style("stroke", function(d,i) {return 'black';})												      					
					.text(function(d,i) {
						var resTRext = piesArray['Key'].split("_");
						var labelY = "";
						
						var arrayLabelsToPlot=[];
						for (var ij=0; ij<piesArray['Units'].length; ij++){
							//console.log(ij);
							
							var a = arrayLabelsToPlot.indexOf(piesArray['Units'][ij]);
							
							if (a==-1)
							{
								arrayLabelsToPlot.push(piesArray['Units'][ij]);
								if (labelY!="")
								{
									
									labelY = labelY +",";
								}
								labelY = labelY +" "+piesArray['Units'][ij];	
							}
							
						}
						
						/*
						if (self.labelY[0])
						{
							var labelY = " ("+self.labelY[resSplitidName[1]]+")";
						}
						 */
						
						//return resTRext[0]+" ("+labelY+" )";
						return "("+labelY+" )";
						})
		    	
		   	}
		   
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
		    	.attr("width", 5)
		    	.attr("height", 5)
		    	.style("fill", function(d,i) {
		    		

		    		var colorToReturn;		        	  
					colorToReturn = colorScale(i);
					if (piesArray.Colors)
					{
		        	   	if (piesArray.Colors[i])
		        	   	{
		        	   		colorToReturn = piesArray.Colors[i]; 
		        	 	}
		        	}
		    		
		    		return colorToReturn;
		    		
		    		//return colorScale(i);
		    		
		    		});
		
		  	legend.append("text")
		  		//.attr("class", "text_pie_"+self.idName) 
		    	.attr("x", self.radius + 5 + 5 + 5)
		    	.attr("y", 9)
		    	.attr("font-size", self.font_size)		
		    	//.attr("dy", ".35em")
		    	.attr("dy", "-.30em")
		    	//.style("text-anchor", "end")
		    	//.style("stroke", function(d,i) {return colorScale(i);})
		    	.style("fill", function (d, i) { 
		    		
		    		var colorToReturn;		        	  
					colorToReturn = colorScale(i);
					if (piesArray.Colors)
					{
		        	   	if (piesArray.Colors[i])
		        	   	{
		        	   		colorToReturn = piesArray.Colors[i]; 
		        	 	}
		        	}
		    		
		    		return colorToReturn;
		    		//return colorScale(i); 
		    		
		    		
		    		})		    	
		    	.text(function(d,i) {
					var textToReturn = pieslabels[i];
					//textToReturn = textToReturn+": "+pies[i];
					return textToReturn;
				});
				
								
			}
	}
    

    self.init = function () {
    	
    	
    		var mousemove = function() 
			{
					//console.log(d3.event.pageX);
				tooltip
					.style("left", (d3.event.pageX +20) + "px")
					.style("top", (d3.event.pageY - 12) + "px");
										
			};
			
		//console.log("self.init "+self.idName);
		//console.log(self.parentSelect);
		self.parentSelect = self.parentSelect.replace("undefined","");
		//console.log(self.parentSelect);

		var selection = d3.select(self.parentSelect); 
		var clientwidth = selection[0][0].clientWidth;
		
		if (self.maxWidth<clientwidth)
		{
			self.width = self.maxWidth;
		}
		else
		{			
			self.width=clientwidth-20;	
		}
		//console.log(self.parentSelect);
				
		self.svg = d3.select(self.parentSelect).append("svg")
					.attr("class","pc_chart")
					.attr("id", "graph_"+self.idName)
                    .attr("width", self.width+self.margin.right+self.margin.left)
                    .attr("height", self.height+self.margin.top+self.margin.bottom)
                    .on("mousemove", mousemove)
                    //.on("mouseover", console.log("aaaaaaa"))
                    //.style("float","left")
                    .append("g")
                    	.attr("transform", "translate(" + (self.width+self.margin.right+self.margin.left) / 2 + "," + (self.height+self.margin.top+self.margin.bottom) / 2 + ")")
                    ;
	}

    self.render = function(piesArray){
    	
    	self.piesArray = piesArray;
		
//		console.log(piesArray);
		
		if (Object.keys(piesArray).length === 0)
		{
			//console.log("No data");
			
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
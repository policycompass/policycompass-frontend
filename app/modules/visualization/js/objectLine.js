"use strict";
var policycompass = policycompass || {'version':0.1, 'controller':{}, 'viz': {} ,'extras': {}};


policycompass.viz.line = function(options)
{

    // Object

    var self = {};

    // Get options data

    for (var key in options){
        
        self[key] = options[key];
	}

    self.parentSelect = "#"+self.idName;
    

	
    
	function make_x_axis() {
		//console.log("self.x="+self.x);        
    	return d3.svg.axis()
        	.scale(self.x)
         	.orient("bottom")
         	.ticks(10)
	}

	function make_y_axis() {
    	return d3.svg.axis()
	        .scale(self.y)
    	    .orient("left")
        	.ticks(10)
	}

	function mouseover() {
			
		posMouse = d3.mouse(this);
		posX = posMouse[0];
		posY = posMouse[1];
	    posX = xInversa(posX);
	    posY = yInversa(posY);
	    //console.log("posX="+posX);
	    //console.log("posY="+posY);
		

		    				
	    tooltip.style("opacity",1.0).html("key=<br/>pos x="+posX+"<br/>pos y="+posY);
		    
	}

	function mouseout() {
		tooltip.style("opacity",0.0);
		
	}   
    

	function mouseoutLegend() {
		self.showLegendOpened=0;
		tooltipLegend.style("opacity",0.0);
		
	}   


    
	function renderLine(posX, posY) {
		//console.log("renderLine 1");
		// posX = xInversa(posX);
		// posY = yInversa(posY);
	    //console.log("posX="+posX);
		//console.log("posY="+posY);
		//The data for our line
 		var lineData = [ 
 			{"x": 0, "y": posY},  
 			{"x": posX, "y": posY},
			{"x": posX, "y": posY}, 
			{"x": posX, "y": self.height}
        ];
 
		//This is the accessor function we talked about above
		var lineFunction = d3.svg.line()
			.x(function(d) {return d.x;})
			.y(function(d) {return d.y;})
			.interpolate("linear")
			;

		//The SVG Container
		var svgContainer = self.svg;

		//The line SVG Path we draw
		var lineGraph = svgContainer.append("path")
			.attr("d", lineFunction(lineData))
			.attr("stroke", "blue")
			.attr("stroke-width", 2)
			.attr("fill", "none")
			;
			
		/*
			self.svg.selectAll("posmouse").data(dataForCircles);
			myDiscoLinesY.enter().append("line")
				.attr("class","posmouse")
				.style("stroke", function(d,i) {return colorScale("99");})
				.attr("opacity", 0.5)
				.attr("x1", function(d,i){return 0;})
				.attr("y1", function(d,i){return self.y(d.posY);})
				.attr("x2", function(d,i){return self.x(d.posX);})
				.attr("y2", function(d,i){return self.y(d.posY);})
		*/
	}
    
	self.drawLines = function (lines, eventsData) {
		//console.log("cnt="+lines.length);
        //console.log("self.showYAxesTogether="+self.showYAxesTogether);
        //console.log("self.margin.right="+self.margin.right);
        if (!self.showYAxesTogether)
        {
        	//self.margin.right = self.margin.right * lines.length;
        	//self.width = self.width - (self.margin.right * (lines.length-1));
        	var widthTempoarl = self.width - (self.distanceXaxes * (lines.length-1));
        	if (widthTempoarl<(self.width/3))
        	{
        		self.width = self.width/3;
        	}
        	else
        	{
        		self.width = widthTempoarl;
        	}
        	//self.width = self.width - (18 * (lines.length-1));
			self.svg.attr("width", self.width + self.margin.left + self.margin.right);
			        	
        }

			
			
		/*
    	
        */
		//console.log("lines");
		//console.log(lines);
		/*
		var showLegend = document.getElementById("showLegend").checked;
		var showLines = document.getElementById("showLines").checked;
		var showPoints = document.getElementById("showPoints").checked;
		var showLabels = document.getElementById("showLabels").checked;
		var showGrid = document.getElementById("showGrid").checked;
		*/
		var showLegend = self.showLegend;
		var showLines = self.showLines;
		var showPoints = self.showPoints;
		var showLabels = self.showLabels;
		var showGrid = self.showGrid;
		//console.log("lines.length="+lines.length);
		//var colorScale = d3.scale.category20c();
		var colorScale = d3.scale.category20();
//		var colorScale = d3.scale.linear()  
//			.domain([0,1])
//			.range(['#FFF', '#933'])
		
		var colorScaleForHE = d3.scale.category20();
		
		var parseDate = d3.time.format("%Y-%m-%d").parse;

		var valuesX = [];
		var valuesY = [];
		//console.log("--------------");
		self.arrayMaxVy = [];
		self.arrayMinVy = [];
		lines.forEach(function(d,i) {
			//console.log(d.Values);
			//console.log(d.ValueY);
			//console.log("d.Position="+d.Position)
			self.arrayMaxVy.push(d3.max(d3.values(d.Values)));
			var vMinValueD3 = d3.min(d3.values(d.Values));
			//vMinValueD3 = 0;
			self.arrayMinVy.push(vMinValueD3);
			
			//obj = d.Values;
			var obj = d.ValueY;
			//obj = d;
			for (var i in obj) {
   				   //result = "." + i + " = " + obj[i] + "\n"; 
   				   //console.log(result);
   				   //valuesY.push(parseInt(obj[i]));
   				   //valuesY.push(parseInt(obj[i]));
   				   
   				   var twoPlacedFloat = parseFloat(obj[i]);
   				   //var twoPlacedFloat = parseFloat(obj[i]).toFixed(2);
   				   
   				   valuesY.push(twoPlacedFloat)
   				   
   			}    
   			obj = d.ValueX;
			//obj = d;
			for (var i in obj) {
   				   //result = "." + i + " = " + obj[i] + "\n"; 
   				   //console.log(result);
   				   //valuesX.push(parseInt(obj[i]));
   				   valuesX.push((obj[i]));
   				   //valuesX[i]=obj[i];
   			}   
		});
		
		//console.log("--------------");
		//console.log(self.arrayMaxVy);
		//console.log(self.arrayMinVy);
		//console.log("--------------");
		
		//console.log("valuesY="+valuesY);
		//console.log("lines="+lines);
		//console.log("lines[0].Values="+lines[0].Values);
		if (!lines[0].Values)
		{
			lines[0].Values=1;
		}
		//console.log(".....");
		//console.log(lines[0].Values);
		//console.log(".....");
		//console.log(lines[0].Values.length);
		//console.log(".....");
		//console.log(valuesY);
		self.maxVy = d3.max(d3.values(valuesY));
		self.minVy = d3.min(d3.values(valuesY));
		
		//console.log("self.maxVy="+self.maxVy);
		//console.log("self.minVy="+self.minVy);
		
		//self.minVy = 0;
		//console.log(valuesY);
		self.minVx = d3.min(d3.values(valuesX));;
		//self.minVx = 0;
		self.maxVx = d3.max(d3.values(valuesX));

		function getDate(d) {
    		return new Date(d);
		}
		
		//console.log("valuesX");
		//console.log(valuesX);
		

var dateRE = /^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/;
function dmyOrdA(a, b){
a = a.replace(dateRE,"$3$2$1");
b = b.replace(dateRE,"$3$2$1");
if (a>b) return 1;
if (a <b) return -1;
return 0;}
function dmyOrdD(a, b){
a = a.replace(dateRE,"$3$2$1");
b = b.replace(dateRE,"$3$2$1");
if (a>b) return -1;
if (a <b) return 1;
return 0;}
function mdyOrdA(a, b){
a = a.replace(dateRE,"$3$1$2");
b = b.replace(dateRE,"$3$1$2");
if (a>b) return 1;
if (a <b) return -1;
return 0;}
function mdyOrdD(a, b){
a = a.replace(dateRE,"$3$1$2");
b = b.replace(dateRE,"$3$1$2");
if (a>b) return -1;
if (a <b) return 1;
return 0;}
		
		//valuesX.sort(dmyOrdA);
		valuesX.sort(mdyOrdA);
		
		//console.log(valuesX);
		
		
		
		//console.log(valuesX);
		
		self.minDate = getDate(valuesX[0]),
		self.maxDate = getDate(valuesX[valuesX.length-1]);
       	
       	//console.log(valuesX[0]);
		//console.log("self.minDate="+self.minDate);
		
		//console.log(valuesX[valuesX.length-1]);
       	//console.log("self.maxDate="+self.maxDate);
       	

		//console.log("self.minDate="+self.minDate);
        //self.x = d3.scale.linear().domain([0,lines[0].Values.length-1]).range([0,self.width]).clamp(true);
        //self.xScale = d3.scale.linear().domain([self.minVx, self.maxVx]).range([0, self.width]).clamp(true);
        self.xScale = d3.time.scale().domain([self.minDate, self.maxDate]).range([0, self.width]).clamp(true);
        
        //self.xScaleInversa = d3.scale.linear().domain([0, self.width]).range([self.minVx, self.maxVx]).clamp(true);
        self.xScaleInversa = d3.time.scale().domain([0, self.width]).range([self.minDate, self.maxDate]).clamp(true);
        
        //self.xScaleX = d3.scale.linear().domain([self.minVx, self.maxVx]).range([0, lines[0].Values.length-1]).clamp(true);
        self.xScaleX = d3.time.scale().domain([self.minDate, self.maxDate]).range([0, self.maxDate]).clamp(true);
        
        //self.xScaleXInversa = d3.scale.linear().domain([0, lines[0].Values.length-1]).range([self.minVx, self.maxVx]).clamp(true);
        self.xScaleXInversa = d3.time.scale().domain([0, self.maxDate]).range([self.minDate, self.maxDate]).clamp(true);
        
        //self.x = d3.scale.linear().domain([0,lines[0].Values.length-1]).range([0,self.width]).clamp(true);
        self.x = d3.time.scale().domain([0, self.maxDate]).range([0, self.width]);
        
        
        //self.xInversa = d3.scale.linear().domain([0, self.width]).range([self.minVx, self.maxVx]).clamp(true);
        //self.xInversa = d3.scale.linear().domain([0,self.width]).range([0,lines[0].Values.length-1]).clamp(true);
        self.xInversa = d3.time.scale().domain([0,self.width]).range([0,self.maxDate]).clamp(true);
        
        //self.minVy = 0;
        //console.log("self.maxVy="+self.maxVy);
        //console.log("self.minVy="+self.minVy);  
        //self.y = d3.scale.linear().domain([0, self.maxVy]).range([self.height, 0]).clamp(true);
        //self.yInversa = d3.scale.linear().domain([self.height, 0]).range([0, self.maxVy]).clamp(true);
        var minYToPlot = 0;
        var maxYToPlot = 0;
        self.yArray = [];
        self.yArrayInversa = [];
        
        lines.forEach(function(d,i) 
        {
	        if (self.showYAxesTogether)
	        {
	        	minYToPlot = self.minVy;
	        	maxYToPlot = self.maxVy;
			}
	        else
	        {
	        	minYToPlot = self.arrayMinVy[i];
	        	maxYToPlot = self.arrayMaxVy[i];
			}
	        
        	self.yArray.push(d3.scale.linear().domain([minYToPlot, maxYToPlot]).range([self.height, 0]).clamp(true));
       		self.yArrayInversa.push(d3.scale.linear().domain([self.height, 0]).range([minYToPlot, maxYToPlot]).clamp(true));
		});
        
        //console.log("self.minVy="+self.minVy);
        //console.log("self.maxVy="+self.maxVy);
        
        self.y = d3.scale.linear().domain([self.minVy, self.maxVy]).range([self.height, 0]).clamp(true);
        self.yInversa = d3.scale.linear().domain([self.height, 0]).range([self.minVy, self.maxVy]).clamp(true);
        
        
		/* 
        self.xInversa = d3.scale.linear().domain([0,self.width]).range([0,lines[0].Values.length-1]).clamp(true);
       	self.yInversa = d3.scale.linear().domain([self.height, 0]).range([0,self.maxVy]).clamp(true);
       	*/  	
		//var x = d3.scale.linear()
    	//	.range([0, self.width])		
		//var y = d3.scale.linear()
    	//	.range([self.height, 0]);

		var xAxis = d3.svg.axis()
    		.scale(self.xScale)
    		.orient("bottom")
    		//.ticks(d3.time.months, 1)
    		//.ticks(d3.time.weeks, 2)
    		.tickFormat(d3.time.format("%d-%m-%Y"));
		
		var yAxis = d3.svg.axis()
    		.scale(self.y)
    		//.scale(self.yArray)
    		.orient("left");

		var lineFunction = d3.svg.line()		
    		.x(function(d,i) {
    			//console.log(i);
    			//console.log("........");
    			//console.log(d);
    			//xScale
    			//return self.x(d.posX);
    			//console.log("d.posX="+d.posX)
    			 //console.log(d.xOriginal);
    			//return self.x(d.posX);
    			return self.xScale(getDate(d.xOriginal));
    			})
    		.y(function(d) {
    			//console.log("-----")	
    			//console.log(cntLineasPintadas);	
    			//console.log("-->"+d.posY+"----"+self.y(d.posY))
    			//return self.y(d.posY);    			 
    			return self.yArray[self.cntLineasPintadas](d.posY);
    			//return 2;
    			})
    		.interpolate("linear");
    		
    			;


		/** Start to plot mouse pointer */
		/* x line */
		self.hoverLineX = self.svg.append("line")
			.attr("class","hover-line-vertical")
			.style("stroke", "red")
			.attr("opacity", 0.5)
               .attr("x1", 0)
               .attr("y1", 0)
               .attr("x2", 0)
               .attr("y2", self.height)
	       
	    self.hoverLineX.classed("hide", true);
	    /* y line */   
		self.hoverLineY = self.svg.append("line")
			.attr("class","hover-line-horitzontal")
			.style("stroke", "red")
			.attr("opacity", 0.5)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", self.width)
            .attr("y2", 0)
                         
		self.hoverLineY.classed("hide", true);
        /* en plot mouse pointer*/  

		if (showLabels)
		{
			self.svg.append("g")
	      		.attr("class", "x axis")
	      		.attr("transform", "translate(0," + self.height + ")")      		
	      		.call(xAxis)	
	      		.attr("font-size", 11)
	      		.selectAll("text")  
            		.style("text-anchor", "end")
            		//.attr("dx", "-.8em")
            		//.attr("dy", ".15em")
            		.attr("transform", function(d) {
                	return "rotate(-25)" 
				})				
				;
			
			if (self.showYAxesTogether)
			{
				
				//console.log("self.labelY.length="+self.labelY.length);
//				for (index = 0; index < self.labelY.length; ++index) {
				var keyIndex;

		  		self.svg.append("g")
		      		.attr("class", "y axis")
		      		.call(yAxis)
		      		.attr("font-size", 11);	
			     
			    var arrayYaxisProcessed = [];
				var cnt_keyIndex = 0;
				for (keyIndex in self.labelY) {
					var posa = arrayYaxisProcessed.indexOf(self.labelY[keyIndex]);
					
					if (posa>=0) 
					{
				    	// Exists
				    	//console.log("Exists");
					} 
					else {
    					// Does not exist 
    					arrayYaxisProcessed.push(self.labelY[keyIndex]);
    				}
    				
				}

				if (arrayYaxisProcessed.length==1)
				{
					self.svg.append("g")									      		      		
				    		.append("text")
				    			.attr("font-size", 11)
				      			.attr("transform", "rotate(-90)")
				      			.attr("y", 1)
				      			//.attr("dy", ".71em")
				      			.attr("dy", "15px")
				      			//.attr("x", 50*(keyIndex))
				      			.style("text-anchor", "end")
				      			.text(self.labelY[0]);					
				}
				else
				{
					for (keyIndex in self.labelY) {
					//for (keyIndex in arrayYaxisProcessed) {
				  		self.svg.append("g")									      		      		
				    		.append("text")
				    			.attr("font-size", 11)
				      			.attr("transform", "rotate(-90)")
				      			.attr("y", 15*(keyIndex))
				      			//.attr("dy", ".71em")
				      			.attr("dy", "15px")
				      			//.attr("x", 50*(keyIndex))
				      			.style("stroke", function(d,i) {
					      			return colorScale(lines[keyIndex].Key);
					      		})
				      			.style("text-anchor", "end")
				      			.text(self.labelY[keyIndex]);
	
					}
				}
				

									
			}
			
		}

		

		if (showGrid)
		{
			self.svg.append("g")         
	        	.attr("class", "grid")
	        	.attr("transform", "translate(0," + self.height + ")")
	        	.call(make_x_axis()
	            	.tickSize(-self.height, 0, 0)
	            	.tickFormat("")
	        	)

	
	    	self.svg.append("g")         
		        .attr("class", "grid")
	    	    .call(make_y_axis()
	            .tickSize(-self.width, 0, 0)
	            .tickFormat("")
			)
		}

		/*************Ini plot historical events *******/

		var dataForCircles = [];
		for (var i in eventsData) {
      		//dataForCircles[eventsData[i].posX]=eventsData[i].posY;
      		//console.log(eventsData[i]);
      		 var arrayTemporal = [];
      		 arrayTemporal['index']=i;
      		 arrayTemporal['color']=eventsData[i].color;
      		 arrayTemporal['title']=eventsData[i].title;
      		 arrayTemporal['startDate']=eventsData[i].startDate;
      		 arrayTemporal['endDate']=eventsData[i].endDate;
      			 
      		 //arrayTemporal['posY']=eventsData[i].posY;
      		 arrayTemporal['posY']=0;
      		 arrayTemporal['desc']=eventsData[i].desc;
      		 dataForCircles[i]=arrayTemporal;
   		} 

		var historicalEvents = self.svg.selectAll("rectagles").data(dataForCircles);
		
	//	console.log("d.startDate="+d.startDate);
	//	console.log("getDate(d.startDate)="+getDate(d.startDate));
	//	console.log("x="+self.xScale(getDate(d.startDate));
		
		historicalEvents.enter().append("rect")
			.attr("class","lineXDisco")
			//.style("stroke", function(d,i) {return colorScale("event");})
			//.style("stroke", "grey")
			.style("stroke", function(d,i) {
				//console.log("d.index"+d.index);				
					var colorToPlot = colorScaleForHE(d.index);
					if (d.color)
					{
						colorToPlot = d.color;
					}
					return colorToPlot;
				}
				)												
			//.style("stroke", "red")			
			.style("fill", function(d,i) {
				//console.log("d.index"+d.index);				
					var colorToPlot = colorScaleForHE(d.index);
					if (d.color)
					{
						colorToPlot = d.color;
					}
					return colorToPlot;
				}
				)									
			.attr("opacity", 0.5)
            .attr("x", function(d,i){
            	//console.log(i);
				//console.log(d.startDate);
				//console.log(self.xScale(d.startDate));
				var posXToPlot = self.xScale(getDate(d.startDate));
				//console.log("posXToPlot="+posXToPlot);
				return posXToPlot;
			})
			.attr("y", 0)
			.attr("width",function(d,i){
				//console.log(d.startDate);
				//console.log(d.endDate);
				var dif = "1";
				if (d.endDate!="")
				{
					dif = self.xScale(getDate(d.endDate)) - self.xScale(getDate(d.startDate));					
				}
				else
				{
					dif=1;
				}
				if (dif==0)
				{
					dif=1;
				}
				//console.log("dif="+dif);
				return dif;
			})
			.attr("height", self.height)                        
			.on("mouseover", function (d,i) {
				d3.select(this).style("stroke-width", 2);
				//d3.select(this).classed("pointOn", true);
				var textTooltip="";
				
				var resSplit = d.startDate.split("-");
				var monthNames = [ "", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
		    				
				var startDateToPlot = monthNames[parseInt(resSplit[1])]+" "+parseInt(resSplit[2])+", "+resSplit[0];
				
				
				//textTooltip = d.title+": "+d.startDate;
				textTooltip = d.title+"<br /> From: "+startDateToPlot;
				if (d.endDate!="")
				{
					var resSplit = d.endDate.split("-");
					var endDateToPlot = monthNames[parseInt(resSplit[1])]+" "+parseInt(resSplit[2])+", "+resSplit[0];
					//textTooltip = textTooltip+" - "+d.endDate;
					textTooltip = textTooltip+" <br /> To: "+endDateToPlot;
					
				}
				if (d.desc!="")
				{
					textTooltip = textTooltip+"<br/> Desc.: "+d.desc;	
				}
				
				var posXToPlot = self.xScale(getDate(d.startDate));
				if (posXToPlot>0)
				{
					
					tooltip.style("opacity",1.0).html(textTooltip);
					//d3.tooltip().placement("right")	
				}
				    
			})
			.on("mouseout", function(d,i) {
				//d3.select(this).classed("pointOn",false);
				mouseout();  
				d3.select(this).style("stroke-width", 1);
			})
   
			/******** end plot historical events ***********/
      		
        self.legendText = "";
        var cntiMultiple = 0;
        var incremetY = 0;
		var cnti=0;
		lines.forEach(function(d,i) {
    		self.cntLineasPintadas = i;
    		cnti = cnti+1;
    		//console.log("forEach");
    		//console.log(d);
    		
    		//var linesArray = [];
    		//var linesObject = new Object();
    		var linesArray = [];
    		var linesArrayX = [];
    		var linesArrayXY = [];
			var evaluate = 0;
    		if('ValueY' in d)
    		{
    			//if (isArray(d.Values))
    			
    			//if (isArray(d.ValueY))
    			//{
    				//linesObject=d.values;
    				//linesArray=d.Values;
    				//linesArray=d.ValueY;
    				linesArray = d.ValueY;
    				linesArrayX = d.ValueX;
    				linesArrayXY = d.XY;
    			//}
    			//else
    			//{
    				//linesObject[0]=d.values;
    				//linesArray[0]=d.Values;
    			//	linesArray[0] = d.ValueY;
    			//	linesArrayX[0] = d.ValueX;    	
    			//	linesArrayXY[0] = d.XY;			
    			//}
    			
    			/*
    			
    				arrayPosXPosY = [];
    				arrayPosXPosY['x'] = d.ValueX;
    				arrayPosXPosY['y'] = d.ValueY;
    				linesArray=arrayPosXPosY;
    			*/
    			
    			evaluate = 1;	
    			//console.log(linesObject);
    			//console.log(linesArray);
    		}

			key=d.Key;
			
			//to create n y axes
			if ((!self.showYAxesTogether) && (showLabels))
			{
				//console.log(linesArray);
				//maxAxis = d3.max(d3.values(linesArray));
				//minAxis = d3.min(d3.values(linesArray));
				//console.log(maxAxis);		
				//var y1 = d3.scale.linear().domain([minAxis, maxAxis]).range([self.height, 0]); // in real world the domain would be dynamically calculated from the data
				// create left yAxis
				//var yAxisLeft = d3.svg.axis().scale(y1).ticks(10).orient("left");
				
				var transform="";
				if (cnti===1)
				{
					transform = "translate(0,0)";
					var yAxisLeft = d3.svg.axis().scale(self.yArray[i]).ticks(10).orient("left");
				}
				else
				{
					var posFinalXAxeY = self.width;
					//console.log(posFinalXAxeY)
					posFinalXAxeY = posFinalXAxeY + self.distanceXaxes*(i-1)
					//posFinalXAxeY = posFinalXAxeY + self.margin.right*(i-1)
					//console.log(posFinalXAxeY)
					transform = "translate("+posFinalXAxeY+",0)";
					var yAxisLeft = d3.svg.axis().scale(self.yArray[i]).ticks(10).orient("right");
				}
				
				//console.log(self.labelY);
				//console.log("cnti="+cnti);
				//console.log("self.labelY[cnti-1]="+self.labelY[cnti-1]);
				var paddingText = "";
				if (cnti==1) 
				{
					paddingText="15px";
				}
				else
				{
					paddingText="-8px";
				}
				self.svg.append("svg:g")
				      .attr("class", "y axis axisLeft")
				      .attr("transform", transform)
				      .style("stroke", function(d,i) {
				      	//console.log("----->key="+key);
				      	return colorScale(key);
				      	})
				      //.style("stroke-width", 2)				      
				      .attr("font-size", 11)
				      .call(yAxisLeft)
				      .append("text")
		      			.attr("transform", "rotate(-90)")		      			
		      			//.attr("dy", ".71em")
		      			.attr("dy", paddingText)
		      			.style("text-anchor", "end")
		      			.text(self.labelY[cnti-1])
				      ;
				      
				      
				      //.call(self.yArray[self.cntLineasPintadas]);
				      
				      
				 /*****************************/
				
				
				
				      
			}
    		
    		//var data = [];
    		var data = new Object();
    		
    		if (evaluate===1)
    		{
    			//console.log("linesArray");
    			//console.log(linesArray);
    			data = linesArray.map(function(d,i) {
    			
    			//console.log("**********");
    			//console.log(linesArray[i]);
    			//console.log("x="+linesArrayX[i]);
    			//console.log(self.x(linesArrayX[i]));
    			//console.log("inversa="+self.xInversa(linesArrayX[i]));
    			//console.log("scale="+self.xScale(linesArrayX[i]));
    			//console.log("xScaleX="+self.xScaleX(linesArrayX[i]));
    			//console.log(i);
    			//console.log(d);
    			
    			var posXToPrint=linesArrayX[i];
    			//console.log("posXToPrint="+posXToPrint);    			

    			posXToPrint = self.xScaleX(posXToPrint);   			
    			//console.log("posXToPrint="+posXToPrint);
    			
    			posXToPrint = self.x(posXToPrint);
    			//console.log("posXToPrint="+posXToPrint);
    			
    			posXToPrint = self.xInversa(posXToPrint)
    			//console.log("posXToPrint="+posXToPrint);
    			//console.log("---cnti="+cnti);
      			return {
         		//posX: posXToPrint,
         		posX: posXToPrint,
         		posY: d,
         		key: key,
         		xOriginal:linesArrayX[i]
      			};      
  				});
    			
    		}

			/*
			self.x.domain(d3.extent(data, function(d) {
        		//console.log(d.posX)
        	 	return d.posX; 
			}));
        	*/

			self.x.domain(d3.extent(data, function(d,i) {
				//console.log("i="+i);
				//console.log("d=");
				//console.log(d);        	
				//console.log("d.posX="+d.posX); 
				//console.log("d.xOriginal="+d.xOriginal);
				//console.log("self.xScale(d.xOriginal)="+self.xScale(d.xOriginal));
				//console.log("self.xScaleX(d.xOriginal)="+self.xScaleX(d.xOriginal));				
				//console.log("self.xScaleInversa(d.xOriginal)="+self.xScaleInversa(d.xOriginal));
				//(d.xOriginal)
        		//console.log(d.posX)
        		
        		
        	 	//return d.posX;
        	 	return d.xOriginal;
        	 	//return 250;
 
			}));

        	
        	//self.y.domain([self.minVy, self.maxVy]);
        	/*	 
  			y.domain(d3.extent(data, function(d) {
  			//console.log(d.posY)
  			return d.posY; 
  			}));
  			*/
  			
			if (showLines)
			{
				
				//console.log("key="+key);
				//console.log(data);
				
	  			var path = self.svg.append("path")
		      		.datum(data)
		      		//.attr("class", "line line--hover class_"+key.replace(/\s+/g, '')) 
		      		.attr("class", "line line--hover class_"+key.replace(/\W/g, ''))	      		
		      		//.attr("id", 'tag_'+key.replace(/\s+/g, '')) // assign ID     	
		      		.attr("id", 'tag_'+key.replace(/\W/g, '')) // assign ID
	    	  		.style("stroke-width", 2)
		      		.style("stroke", function(d,i) {return colorScale(key);})
		      		.attr("d", lineFunction)
	    	  		//.on("mouseover", mouseover)
	      			.on("mouseover", function (d,i) {
	      				//console.log(d);
	      				d3.select(this).style("stroke-width", 4);
	      				//console.log(d[i])	      			
								  			
						//posMouse = d3.mouse(this);
						//posX = posMouse[0];
						//posY = posMouse[1];						    		
			    		//posX = getDate(self.xInversa(posX));			    		
			    		//posY = self.yInversa(posY);
			    		//tooltip.style("opacity",1.0).html("****<br/>key="+d[0].key+"<br/>pos x="+posX+"<br/>pos y="+posY);		    		
									    		
	      			})
	      			.on("mouseout", function() {
	      				d3.select(this).style("stroke-width", 2);
	      				mouseout();
	      			})      			      		
	      			.on("click", function(d,i) {	
						///posMouse = d3.mouse(this);
						///posX = posMouse[0];
						///posY = posMouse[1];		
						//console.log("posX="+posX);
						//console.log("self.xInversa(posX)="+self.xInversa(posX));
						//console.log("self.x(posX)="+self.x(posX));
						
						//console.log(self.xScaleXInversa(self.xInversa(posX)));
						
						//console.log("posY="+posY);	
			    		//posX = posX;
			    		//posX = self.x(posX);
			    		//posX = self.xInversa(posX);
			    		///posX = self.xScaleXInversa(self.xInversa(posX));	
			    		///posY = self.yInversa(posY);
			    		//console.log("posX="+posX);
						//console.log("posY="+posY);			    	      			
	      				$('input[name="posx"]').val(posX);
						$('input[name="posy"]').val(posY);		
	      				$('#basic-modal-content').modal();
	      				
	      			})
	      			;	

					var totalLength = path.node().getTotalLength();    	      			
								
					path
      					.attr("stroke-dasharray", totalLength + " " + totalLength)
      					.attr("stroke-dashoffset", totalLength)
      					.transition()
        					.duration(2000)
        					.ease("linear")
        					.attr("stroke-dashoffset", 0);
	      				
			}
        	var resTRext = key.split("_");
        	
            self.legendText = self.legendText + '<div style="margin-top: 2px; width: 5px; background: '+colorScale(key)+'; height: 5px; float: left;"> </div>&nbsp;<font color="'+colorScale(key)+'">'+resTRext[0]+'</font><br/>';
	    	if (showLegend)
	    	//if (1==1) 
	    	{
	    		var valueX =  ((self.width/(lines.length/self.legendsColumn)) * (cntiMultiple));
	    		if (cnti%self.legendsColumn == 0)
                {
					cntiMultiple=cntiMultiple+1;
				}

				var valueY = (self.height) + self.margin.top + 30 + (incremetY)*20;
				if (cnti%self.legendsColumn == 0)
                {
                    //console.log("---key="+key);
                	incremetY = 0;                    		
                }
                else
            	{
                	incremetY = incremetY + 1;
				}
     	
				self.svg.append("rect")
		    	.attr("x", valueX-10)
				.attr("y", valueY-5) 	
		    	.attr("width", 5)
		    	.attr("height", 5)
		    	.style("fill", function(d,i) {return colorScale(key);});


  				self.svg.append("text")
                    //.attr("x", function(d,i){return self.width + 10 ;})
                    .attr("x", function(d,i){
                    	//console.log("cnti="+cnti+"--key="+key);
                    	return valueX ;}
                    	)
					//.attr("y", function(d,i){return (0) + (20 * cnti-1) ;})
					//.attr("y", function(d,i){return (self.height) + (self.margin.top+(self.margin.bottom/2))+2 ;})
					.attr("y", function(d,i){
						//console.log("--->cnti="+cnti+"--key="+key);
						return  valueY;}
						)
					.attr("text-anchor","center")
					.attr("text-decoration","none")					
					.attr("class", "link superior legend value")				
					.attr("font-size", 11)
					.style("stroke", function(d,i) {
						//console.log("key="+key);
						return colorScale(key);})										
					.on("mouseover", function (d,i) {
						if (self.modeGraph=='view')
						{
							var str = d3.select(this).text();
							
							if(d3.select(this).attr("text-decoration")=='none')
							{
								tooltip.style("opacity",1.0).html("Click over to hide "+str);	
							}
							else
							{
								tooltip.style("opacity",1.0).html("Click over to show "+str);
							}
							
						}
												
      					})
					.on("mouseout", function() {                    						
						mouseout();
						})
					      					
					.text(function(d,i) {
						var resTRext = key.split("_");
						//return "Click to hide "+resTRext[0];})
						return resTRext[0];})
					
					.on("click", function() {
						//console.log("-----key="+d.Key.replace(/\s+/g, ''))
                		// Determine if current line is visible 
                		if (self.modeGraph=='view')
						{                		
	                		var active   = d.active ? false : true,
	                		newOpacity = active ? 0 : 1; 
	                		// Hide or show the elements based on the ID
	                		//d3.select("#tag"+key.replace(/\s+/g, ''))
	                		
	                		//d3.selectAll(".class_"+d.Key.replace(/\s+/g, ''))
	                		d3.selectAll(".class_"+d.Key.replace(/\W/g, ''))
	                    	.transition().duration(100) 
	                    	.style("opacity", newOpacity); 
	                		// Update whether or not the elements are active
	                		d.active = active;
	                		
	                		//var currentText= d3.select(this).text();
	                		//console.log(currentText);
	                		var str = d3.select(this).text();
							var res = "";
							
	                		if (active) {
	                			res = 'Click to display '+str;
	                			res = str.replace("hide", "display");
	                		}
	                		else {
	                			res = str.replace("display", "hide");
	                			
	                		}
	                		
	                		//console.log(d3.select(this).attr("text-anchor"));
	                		//console.log(d3.select(this).attr("text-decoration"));
	                		
	                		if(d3.select(this).attr("text-decoration")=='none')
	                		{
	                			d3.select(this).attr("text-decoration","line-through");	
	                			tooltip.style("opacity",1.0).html("Click over to show "+str);
	                		}
	                		else
	                		{
	                			d3.select(this).attr("text-decoration","none");
	                			tooltip.style("opacity",1.0).html("Click over to hide "+str);
	                		}
	                		
	                		
	                		//console.log(d3.select(this).attr("text-decoration"));
	                		
	                		d3.select(this).text(res);
	                		
                		}
                	})  
                	
			}
  		});
			/*
			self.showLegendOpened = 0;
			if (showLegend) 
	    	{
  				self.svg.append("text")
                    .attr("x", function(d,i){return self.width + 10 ;})                    
					.attr("y", function(d,i){return (0) + (0) ;})
					.attr("text-anchor","center")
					.attr("class", "link superior legend value")				
					.attr("font-size", 11)
					.style("stroke", function(d,i) {return 'black';})									
					.on("click", function (openedLabels) {

						
						if (self.modeGraph=='view')
						{
							var str = d3.select(this).text();
							var res = "";
							
							
	                		
	                		d3.select(this).text(res);						
							
							if (self.showLegendOpened!=1)
							{
								tooltipLegend
									.style("left", (d3.event.pageX +20) + "px")
									.style("top", (d3.event.pageY - 12) + "px");
									
								var tooltipLegendText="";
								tooltipLegendText = "<div>"+self.legendText+"</div>";			
								tooltipLegend .style("opacity",1.0);//.html(tooltipLegendText);	
								
								tooltipLegend .html(tooltipLegendText);
								
								self.showLegendOpened=1;
							}
							else
							{
								self.showLegendOpened=0;
								tooltipLegend .style("opacity",0);
							}
							
							if (self.showLegendOpened!=1) {
	                			res = 'Click to display color legends';
	                			res = str.replace("hide", "display");
	                		}
	                		else {
	                			res = str.replace("display", "hide");
	                		}
	                		
							d3.select(this).text(res);
						}
										
      				})      				
					.on("mouseout", function() {                    						
						//mouseout();
						//mouseoutLegend();
						})		
		      					
					.html(function(d,i) {
						var resTRext = key.split("_");
						var textToPlot;
						if (self.modeGraph=='view')
						{
							var textToPlot= "Click to display color legends";
						}
						else
						{
							var textToPlot= ""
						}
						
						return textToPlot;
						})
											
			}
			*/
		if (showPoints)
		{
			lines.forEach(function(d,i) {
			    var keyCircle = d.Key;
			    var cntLine = i;
				//var myCircles = self.svg.selectAll("circles").data(d.Values);
				var myCircles = self.svg.selectAll("circles").data(d.ValueY);
				//console.log("d.XY="+d.XY);
				var myCircles = self.svg.selectAll("circles").data(d.XY);
				
				myCircles.enter().append("circle")
                    .attr("cx", function(d,i){	                    	
                    	//console.log(d);
                    	var res = d.split("|");
                    	var resX=res[0];	                    	
                    	//console.log("resY="+res[1]);
                    	//console.log("resX="+resX);
                    	//console.log("self.xScale(resX)="+self.xScale(resX));
                    	//console.log("self.x(self.xScale(resX))="+self.x(self.xScale(resX)));
                    	//console.log("self.xInversa(resX)="+self.xInversa(resX));
                    	//console.log("self.xScaleX(resX)="+self.x(self.xScaleX(resX)));
                    	//console.log("self.xScaleXInversa="+self.xScaleXInversa(resX));
                    	//return self.x(resX);
                    	return (self.xScale(getDate(resX)));
                    	//return 200;
                    	})	                    	
                    .attr("cy", function(d,i){
                    	var res = d.split("|");
                    	var resY=res[1];
                    	//console.log("resY="+resY);
                    	//console.log("cntLine="+cntLine);
                    	//console.log("i="+i);
                    	
                    	return self.yArray[cntLine](resY);})
                    .attr("r", 0)
                    //.attr("class", "pointIn class_"+keyCircle.replace(/\s+/g, ''))
                    .attr("class", "pointIn class_"+keyCircle.replace(/\W/g, ''))                     
                    .style("stroke-width", self.radius)
                    .style("stroke", function(d,i) {return colorScale(keyCircle);})
                    //.attr("opacity", 1.0)
                    .on("mouseover", function (d,i) {
      					d3.select(this).classed("pointOn", true);     
      					
      					 var circle = d3.select(this);
						 circle.transition()
							.attr("r", self.radius * 2);	
							var posMouse = d3.mouse(this);
							//var posX = posMouse[0];
							//var posY = posMouse[1];			
		    				//posX = self.xInversa(posX);
		    				//posY = self.yInversa(posY);
		    				
		    				//posX = self.x(posX);
		    				//posX = self.xScaleXInversa(i);
		    				var res = d.split("|");
                    		var resX=res[0];
                    		var resY=res[1];
		    			
		    				//console.log("posX="+posX);
		    				//console.log("posY="+posY);		    	
		    				//tooltip.style("opacity",1.0).html("key="+keyCircle+"<br/>pos x="+resX+"<br/>pos y="+resY); 
		    				var resSplit = resX.split("-");
		    				var monthNames = [ "", "January", "February", "March", "April", "May", "June",
    						"July", "August", "September", "October", "November", "December" ];
		    				
		    				var endDateToPlot = monthNames[parseInt(resSplit[1])]+" "+parseInt(resSplit[2])+", "+resSplit[0];
		    				   
		    				//tooltip.style("opacity",1.0).html(resX+" <br /> "+resY+"<br />"+endDateToPlot);
		    				
		    				var twoPlacedFloat = parseFloat(resY);
		    				//var twoPlacedFloat = parseFloat(resY).toFixed(2);
		    				
		    				var resSplit = keyCircle.split("_");
		    				
		    				tooltip.style("opacity",1.0).html("<font color='"+colorScale(keyCircle)+"'>"+resSplit[0]+"<br/>"+endDateToPlot+" <br /> "+twoPlacedFloat+"</font>");
		    				
			    			//renderLine((self.x(i)), (self.y(d))); 
      				})
                    //.on("mouseover", function(d,i){console.log(d3.select(this));d3.select(this).classed("circuloOn", true);})
                    .on("mouseout", function(d,i) {
                    	d3.select(this).classed("pointOn",false);
      					var circle = d3.select(this);
						circle.transition()
							.attr("r", self.radius);							
						mouseout();
					})
                    .on("click", function(d,i){
                    	//console.log(d);                   	
					})
					.transition()
						.attr("r", self.radius)
						.duration(2000)
						
					;						
			});
		}    
		
		
		
		
		self.svg
  			.attr("transform", "translate(0, "+self.height+") scale(1, 0)")
  			.transition().duration(500)
  			.attr("transform", "translate("+self.margin.left+", "+self.margin.top+") scale(1, 1)")
  			;
             
	
	}



    
	/* function to plot the pointer mouse */
	var handleMouseOverGraph = function(posMouse) 
	{	
		var mouseX = posMouse[0];
		var mouseY = posMouse[1];
		//console.log(mouseX);
		//console.log(self.margin);
		if (self.hoverLineX)
		{
			if (mouseX-self.margin.left >= 0 && mouseX <= self.width+self.margin.left && mouseY-self.margin.top >= 0 && mouseY - self.margin.top - self.margin.bottom <= self.height - self.margin.bottom) 
			{
				// show the hover line
				self.hoverLineX.classed("hide", false);
				self.hoverLineX.attr("x1", mouseX-self.margin.left).attr("x2", mouseX-self.margin.left);		
				self.hoverLineY.classed("hide", false);
				self.hoverLineY.attr("y1", mouseY-self.margin.top).attr("y2", mouseY-self.margin.top);			
			}
			else
			{			
				self.hoverLineX.classed("hide", true);
				self.hoverLineY.classed("hide", true);			
			}
		}
	}

	/*** funtion to init. graph ***/	   
    self.init = function () {


       // console.log($scope.mode);
       	
		self.svg = d3.select(self.parentSelect).append("svg")
			.attr("width", self.width + self.margin.left + self.margin.right)
			.attr("height", self.height + self.margin.top + self.margin.bottom)
			.on("mousemove", function(d,i) {
				var posMouse = d3.mouse(this);
				var posX = posMouse[0];
				var posY = posMouse[1];				
				handleMouseOverGraph(posMouse);		
				mousemove();							
			})			
      		.on("click", function(d,i) {
				var posMouse = d3.mouse(this);
				var posX = posMouse[0];
				var posY = posMouse[1];		
				var maxPosX = self.width + self.margin.left;
				var posXinvers = "";
				if (posX>maxPosX)
				{					
					posXinvers = ""
				}
				else
				{
					if (self.xScale)
					{
						posXinvers = self.xScale.invert(posX-self.margin.left);
						//posXinvers = self.xScaleInversa(posX-self.margin.left);
						var format = d3.time.format("%m-%d-%Y");
						posXinvers= format(posXinvers);
						posXinvers = posXinvers.replace(/-/g,"/");
					}
				}				
      			//$('input[name="startDate"]').val(posXinvers);      			
      			$('input[name="startDatePosX"]').val(posXinvers);      		
      			//showModal();	
				//dateToSet = posXinvers;
				//console.log("dateToSet="+dateToSet);
      			//$('#basic-modal-content').modal();
      		})      		
			.append("g")
				.attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");
	}


	/* function to Plot data into the graph*/
	self.render = function(dataToPlot, eventsData, modeGraph) {
		
		//console.log("dataToPlot");
		
		//console.log(dataToPlot);		
		//console.log("eventsData");
		//console.log(eventsData);
		self.modeGraph = modeGraph;

								
		//console.log(eventsData);
		if (Object.keys(dataToPlot).length === 0)
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
			//self.legendsColumn = Math.ceil(Object.keys(dataToPlot).length/9);
			//self.legendsColumn = Math.ceil(3/9);
			//console.log(self.legendsColumn);
			var dataToPlotUpdate = dataToPlot;
			self.drawLines(dataToPlotUpdate, eventsData);			
		}
	}


    self.init();

    return self;


}
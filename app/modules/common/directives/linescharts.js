angular.module('pcApp.common.directives.linescharts', [

])		
//esemple of use:
//<div class="pcLinesChart" dataset="dataset" labels="labelYAxe" small="list"  mode="view" chartid="2" show-Legend="showLegend" show-Labels="showLabels"	show-Lines="showLines" show-Areas="showAreas" show-Points="showPoints" show-Grid="showGrid"	show-Together="showYAxes"></div>
//dataset -> array. Content expected
//array contetn like
/*
$scope.dataset (mandatory) =[{"Key":"USA_0","Labels":["1989-01-01","2003-01-01","2004-01-01"],"ValueX":["1989-01-01","2003-01-01","2004-01-01"],"ValueY":[99,33,53],"Type":"metric"},{"Key":"Germany_1","Labels":["2000-01-01","2004-01-01","2010-01-01"],"ValueX":["2000-01-01","2004-01-01","2010-01-01"],"ValueY":[14,66,33],"Type":"metric"},{"Key":"Canada_2","Labels":["2001-01-01","2003-01-01","2004-01-01"],"ValueX":["2001-01-01","2003-01-01","2004-01-01"],"ValueY":[33,54,12],"Type":"metric"},{"Key":"Spain_3","Labels":["2002-01-01","2003-01-01","2004-01-01","2005-01-01"],"ValueX":["2002-01-01","2003-01-01","2004-01-01","2005-01-01"],"ValueY":[23,55,88,36],"Type":"metric"},{"Key":"Andorra_4","Labels":["2003-01-01","2004-01-01"],"ValueX":["2003-01-01","2004-01-01"],"ValueY":[6,23],"Type":"metric"},{"Key":"Spain_5","Labels":["1989-01-01","2011-01-01","2012-01-01"],"ValueX":["1989-01-01","2011-01-01","2012-01-01"],"ValueY":[33,1,2],"Type":"metric"}];
*/
//a row per line to plot	
/*events (optional) = array of events to plot (used only for visualisations)*/
/*chartid (mandatory) = unique id for the visualisation*/
/*small (mandatory) = boolean, true or false to plot image size */ 
/*showLegend, showLabels, showLines, showAreas, showPoints, showGrid, showTogether boolean to configure the template */

.directive('pcLinesChart', ['$log', 'API_CONF', function ($log,  API_CONF) {
	
    return {
        restrict: 'C',
        scope: {
        	dataset: '=dataset',          
        	events: '=events',
        	chartid: '=chartid',
        	small: '=small',
        	mode: '=mode',
        	showLegend: '=showLegend',
        	showLabels: '=showLabels',
        	showLines: '=showLines',
        	showAreas: '=showAreas',
        	showPoints: '=showPoints',
        	showGrid: '=showGrid',
        	showTogether: '=showTogether'
        }, 
		compile: function(element, attributes){ 
         return {
             pre: function(scope, element, attributes, controller, transcludeFn){

             },
             post: function(scope, element, attributes, controller, transcludeFn){

             }
         }
     	},             
        controller: function($scope, $element, $attrs, $location, dialogs){
                                    

			tooltip =  d3.select("body").append("div")
    		.attr("id","tooltip")
    		.html("")
    		.attr("class", "tooltip")
    		.style("opacity", 0);

			tooltipLegend =  d3.select("body").append("div")
    		.attr("id","tooltipLegend")
    		.html("")
    		.attr("class", "tooltipLegend")
    		.style("opacity", 0);
    	
    		var openedLabels = 0;
 		
			mousemove = function() 
			{
					//console.log(d3.event.pageX);
				tooltip
					.style("left", (d3.event.pageX +20) + "px")
					.style("top", (d3.event.pageY - 12) + "px");
										
			};
                                    
			$scope.$watch('showLegend', function(showLegend) {
				if ($scope.numbers1)
				{
					$scope.directivePlotLineChart();	
				}				
            });

			$scope.$watch('showLabels', function(showLabels) {
				if ($scope.numbers1)
				{
					$scope.directivePlotLineChart();
				}				
            });            

			$scope.$watch('showLines', function(showLabels) {
				if ($scope.numbers1)
				{
					$scope.directivePlotLineChart();
				}				
            });  

			$scope.$watch('showAreas', function(showAreas) {
				if ($scope.numbers1)
				{
					$scope.directivePlotLineChart();
				}				
            }); 
                    	
			$scope.$watch('showPoints', function(showPoints) {
				if ($scope.numbers1)
				{
					$scope.directivePlotLineChart();
				}				
            });         	

			$scope.$watch('showGrid', function(showGrid) {
				if ($scope.numbers1)
				{
					$scope.directivePlotLineChart();
				}				
            });
                    	            
			$scope.$watch('showTogether', function(showTogether) {
				if ($scope.numbers1)
				{
					$scope.directivePlotLineChart();
				}
				
            });
                                	            
			$scope.$watch('dataset', function(dataset) {
				numbers1=dataset;
				$scope.numbers1=dataset;
				if ($scope.numbers1)
				{
					$scope.directivePlotLineChart();
				}
				
            });
			  
                                	
            //console.log($scope.chartid);
            
			$scope.directivePlotLineChart = function () {				
				//console.log("directivePlotLineChart");
           				
				//console.log($scope.chartid);
				$scope.iddiv="";
				if (document.getElementById("directive_container_lineschart_"+$scope.chartid) !=null)
				{
					document.getElementById("directive_container_lineschart_"+$scope.chartid).innerHTML = "";
					$scope.iddiv="directive_container_lineschart_"+$scope.chartid;
				} 
				else
				{
					document.getElementById("directive_container_lineschart_").innerHTML = "";
					$scope.iddiv="directive_container_lineschart_";
				}
							
				var legendsColumn = 0;
				if ($scope.showLegend)
				{
					legendsColumn = Math.ceil($scope.dataset.length/9);
				}
				else
				{
					legendsColumn = 0;
				}	

				if ($scope.numbers1)
				{					
				    //console.log(numbers1);
					//if ($scope.list) 
					if ($scope.small)
					{
						legendsColumn = 0;
					}
					
					var margin = {top: 20, right: 20, bottom: 55+(legendsColumn)*20, left: 44},
					//width = 700,
					width = 980,
					//width = 1050,
					//height = 200;
					height = 326,
					font_size = 11,
					radiouspoint = 4,
					dymarging = 15,
					offsetYaxesR = 10,
					offsetYaxesL = -20,
					distanceXaxes = 45
					;
					
					//if ($scope.list)
					if ($scope.small)
					{
						margin.top = margin.top / 5;
						margin.right = margin.right / 5;
						margin.bottom = margin.bottom / 5;
						margin.left = margin.left / 5;
						width = width / 5;
						height = height/ 5;
						font_size = font_size / 5;
						radiouspoint = radiouspoint / 5;
						dymarging = dymarging / 5;
						offsetYaxesR = offsetYaxesR / 5;
						offsetYaxesL = offsetYaxesL / 5;
						distanceXaxes = distanceXaxes / 5;
						$scope.showLegend = false;	
										
					}
					//console.log("height="+height);
					
					var barLine = policycompass.viz.line(
						{
	                		'idName': $scope.iddiv,
	                		'width': width,
	                		'height': height,
	                		'margin': margin,
	                		'labelX': "label X",
	                		'labelY': $scope.labelYAxe,
	                		'radius': radiouspoint,
	                		'dymarging': dymarging,
	                		'offsetYaxesR': offsetYaxesR,
	                		'offsetYaxesL': offsetYaxesL,
	                		'distanceXaxes': distanceXaxes,
	                		'font_size': font_size,
							'showYAxesTogether': $scope.showTogether,	                		
	                		'showLegend': $scope.showLegend,							
							'showLines': $scope.showLines,	
							'showAreas': $scope.showAreas,													
							'showPoints': $scope.showPoints,							
							'showLabels': $scope.showLabels,							
							'showGrid': $scope.showGrid,
							'legendsColumn': legendsColumn
						});
	                
	                if ($scope.dataset.length>0)
	                {
	                	
	                	barLine.render($scope.dataset, $scope.events, $scope.mode);
	                }
					
				}
			
        	}
        },

        template: '<div id="directive_container_lineschart_{{chartid}}" class="container_graph directive_container_chart_{{chartid}}">' +        
        '<div class="loading-container">'+
			'<div ng-hide="small">'+
				'<div class="loading"></div>'+
				'<div id="loading-text">loading</div>'+
			'</div>'+
			'<div ng-show="small">'+
				'<div class="loading loading-small"></div>'+
				'<div id="loading-small-text">loading</div>'+
			'</div>'+
		'</div>'+		
        '</div>'
        
    };
}])


;
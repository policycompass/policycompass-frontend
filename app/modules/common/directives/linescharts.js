angular.module('pcApp.common.directives.linescharts', [

])		
//esemple of use:
//<div class="pcLinesChart" dataset="dataset" labels="labels" small="list"  mode="mode" chartid="2" show-Legend="showLegend" show-Labels="showLabels"	show-Lines="showLines" show-Areas="showAreas" show-Points="showPoints" show-Grid="showGrid"	show-Together="showYAxes" show-Percentatge="showAsPercentatge" xaxeformat="xaxeformat" hideyaxeunits="hideyaxeunits"></div>
//dataset -> array. Content expected
//array contetn like
/*
$scope.dataset (mandatory) =[{"Key":"USA_0","Labels":["1989-01-01","2003-01-01","2004-01-01"],"ValueX":["1989-01-01","2003-01-01","2004-01-01"],"ValueY":[99,33,53],"Type":"metric"},{"Key":"Germany_1","Labels":["2000-01-01","2004-01-01","2010-01-01"],"ValueX":["2000-01-01","2004-01-01","2010-01-01"],"ValueY":[14,66,33],"Type":"metric"},{"Key":"Canada_2","Labels":["2001-01-01","2003-01-01","2004-01-01"],"ValueX":["2001-01-01","2003-01-01","2004-01-01"],"ValueY":[33,54,12],"Type":"metric"},{"Key":"Spain_3","Labels":["2002-01-01","2003-01-01","2004-01-01","2005-01-01"],"ValueX":["2002-01-01","2003-01-01","2004-01-01","2005-01-01"],"ValueY":[23,55,88,36],"Type":"metric"},{"Key":"Andorra_4","Labels":["2003-01-01","2004-01-01"],"ValueX":["2003-01-01","2004-01-01"],"ValueY":[6,23],"Type":"metric"},{"Key":"Spain_5","Labels":["1989-01-01","2011-01-01","2012-01-01"],"ValueX":["1989-01-01","2011-01-01","2012-01-01"],"ValueY":[33,1,2],"Type":"metric"}];
*/
//a row per line to plot	
/*labels (mandatory) = array with label per line*/
/*events (optional) = array of events to plot (used only for visualisations)*/
/*chartid (mandatory) = unique id for the visualisation*/
/*small (mandatory) = boolean, true or false to plot image size */
/*xaxeformat => 'sequence' to plot sequencial x axe 'time' to plot xaxe time */ 
/*showLegend, showLabels, showLines, showAreas, showPoints, showGrid, showTogether, showPercentatge boolean to configure the template */
/*hideyaxeunits => used to plot units or not into the y axe. Example if hideyaxeunits=true 0.4 = 0.4 if hideyaxeunits=false 0.4 = 0.4m*/
//if mode = 'view' the legends can be clickable to hide/show lines
/*
 in your controller:
	$scope.dataset =[
 	{"Key":"USA_0","ValueX":["1","2","3"],"ValueY":[99,33,53],"Type":"metric"},
 	{"Key":"Germany_1","ValueX":["1","2","3"],"ValueY":[14,66,33],"Type":"metric"},
 	{"Key":"Canada_2","ValueX":["1","2","3"],"ValueY":[33,54,12],"Type":"metric"},
 	{"Key":"Spain_3","ValueX":["1","2","3"],"ValueY":[23,55,88],"Type":"metric"},
 	{"Key":"Andorra_4","ValueX":["1","2","3"],"ValueY":[6,23,21],"Type":"metric"},
 	{"Key":"Spain_5","ValueX":["1","2","3"],"ValueY":[33,1,2],"Type":"metric"}];

	$scope.labels = ["Dollar","Dollar","Dollar","Dollar","Dollar","kg"];

	$scope.showLegend = true;
	$scope.showLabels = true;
	$scope.showLines = true;
	$scope.showAreas = true;
	$scope.showPoints = true;
	$scope.showGrid = true;
	$scope.showYAxes = true;
	$scope.showAsPercentatge = false;
	$scope.xaxeformat = 'sequence'
	$scope.mode= 'view';
	$scope.chartid= '2'; 	
	$scope.hideyaxeunits=true;
	$scope.resolution = day,month, year
 */
.directive('pcLinesChart', ['$log', 'API_CONF', function ($log,  API_CONF) {
	
    return {
        restrict: 'C',
        scope: {
        	labels: '=labels',
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
        	showTogether: '=showTogether',
        	showPercentatge: '=showPercentatge',
        	xaxeformat: '=xaxeformat',
        	hideyaxeunits: '=hideyaxeunits',  
        	resolution: '=resolution',
        }, 
		compile: function(element, attributes){ 
         return {
             pre: function(scope, element, attributes, controller, transcludeFn){

             },
             post: function(scope, element, attributes, controller, transcludeFn){

             }
         }
     	},             
        controller: function($scope, $element, $attrs, $location, dialogs, $timeout){
            
       		$scope.sem = [];

			tooltip =  d3.select("body").append("div")
    		.attr("id","tooltip")
    		.html("")
    		.attr("class", "visualization-tooltip")
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

/*
			$scope.$watch('resolution', function(resolution) {
				if (($scope.numbers1) && ($scope.chartid))
				{
					//$scope.directivePlotLineChart();	
					$timeout($scope.directivePlotLineChart, 0);
				}				
            });
*/
/*            
			$scope.$watch('viewyaxeunits', function(xaxeformat) {
				if (($scope.numbers1) && ($scope.chartid))
				{
					//$scope.directivePlotLineChart();	
					$timeout($scope.directivePlotLineChart, 0);
				}				
            });
*/
/*            
			$scope.$watch('xaxeformat', function(xaxeformat) {
				if (($scope.numbers1) && ($scope.chartid))
				{
					//$scope.directivePlotLineChart();	
					$timeout($scope.directivePlotLineChart, 0);
				}				
            });
*/
			
			$scope.sem['labels']=false;
			$scope.$watch('labels', function(labels) {
				$scope.sem['labels']=true;
				if (($scope.numbers1) && ($scope.chartid))
				{					
					//$scope.directivePlotLineChart();					
					//$timeout($scope.directivePlotLineChart, 0);
					$scope.origin = 'labels';	
					$timeout($scope.directivePlotLineChart, 0, false);
					//$scope.directivePlotLineChart();
				}				
            });
            
            $scope.sem['showLegend']=false;
			$scope.$watch('showLegend', function(showLegend) {
				$scope.sem['showLegend']=true;
				if (($scope.numbers1) && ($scope.chartid))
				{
					//$scope.directivePlotLineChart();
					//$timeout($scope.directivePlotLineChart, 0);
					$scope.origin = 'showLegend';	
					$timeout($scope.directivePlotLineChart, 0, false);
					//$scope.directivePlotLineChart();
				}				
            });

			$scope.sem['showLabels']=false;
			$scope.$watch('showLabels', function(showLabels) {
				$scope.sem['showLabels']=true;
				if (($scope.numbers1) && ($scope.chartid))
				{
					//$scope.directivePlotLineChart();
					//$timeout($scope.directivePlotLineChart, 0);
					$scope.origin = 'showLabels';
					$timeout($scope.directivePlotLineChart, 0, false);
					//$scope.directivePlotLineChart();
				}				
            });            
			
			$scope.sem['showLines']=false;
			$scope.$watch('showLines', function(showLabels) {
				$scope.sem['showLines']=true;
				if (($scope.numbers1) && ($scope.chartid))
				{
					//$scope.directivePlotLineChart();
					//$timeout($scope.directivePlotLineChart, 0);
					$scope.origin = 'showLines';
					$timeout($scope.directivePlotLineChart, 0, false);
					//$scope.directivePlotLineChart();
				}				
            });  
			
			$scope.sem['showAreas']=false;
			$scope.$watch('showAreas', function(showAreas) {
				$scope.sem['showAreas']=true;
				if (($scope.numbers1) && ($scope.chartid))
				{
					//$scope.directivePlotLineChart();
					//$timeout($scope.directivePlotLineChart, 0);
					$scope.origin = 'showAreas';
					$timeout($scope.directivePlotLineChart, 0, false);
					//$scope.directivePlotLineChart();
				}				
            }); 
            
            $scope.sem['showPoints']=false;
			$scope.$watch('showPoints', function(showPoints) {
				$scope.sem['showPoints']=true;
				if (($scope.numbers1) && ($scope.chartid))
				{
					//$scope.directivePlotLineChart();
					//$timeout($scope.directivePlotLineChart, 0);
					$scope.origin = 'showPoints';
					$timeout($scope.directivePlotLineChart, 0, false);
					//$scope.directivePlotLineChart();
				}				
            });         	
			
			$scope.sem['showGrid']=false;
			$scope.$watch('showGrid', function(showGrid) {
				$scope.sem['showGrid']=true;
				if (($scope.numbers1) && ($scope.chartid))
				{
					//$scope.directivePlotLineChart();
					//$timeout($scope.directivePlotLineChart, 0);
					$scope.origin = 'showGrid';
					$timeout($scope.directivePlotLineChart, 0, false);
					//$scope.directivePlotLineChart();
				}				
            });
                    
            $scope.sem['showTogether']=false;	            
			$scope.$watch('showTogether', function(showTogether) {
				$scope.sem['showTogether']=true;
				if (($scope.numbers1) && ($scope.chartid))
				{
					//$scope.directivePlotLineChart();
					//$timeout($scope.directivePlotLineChart, 0);
					$scope.origin = 'showTogether';
					$timeout($scope.directivePlotLineChart, 0, false);
					//$scope.directivePlotLineChart();
				}
				
            });
                        
            $scope.sem['showPercentatge']=false;	
            $scope.$watch('showPercentatge', function(showPercentatge) {
            	$scope.sem['showPercentatge']=true;
				if (($scope.numbers1) && ($scope.chartid))
				{
					//$scope.directivePlotLineChart();
					//$timeout($scope.directivePlotLineChart, 0);
					$scope.origin = 'showPercentatge';
					$timeout($scope.directivePlotLineChart, 0, false);
					//$scope.directivePlotLineChart();
				}
				
            });
			
			$scope.sem['chartid']=false;
			$scope.$watch('chartid', function(chartid) {				
				$scope.chartid=chartid;
				$scope.sem['chartid']=true;
				if (($scope.numbers1) && ($scope.chartid))
				{					
					//$scope.directivePlotLineChart();
					//$timeout($scope.directivePlotLineChart, 0);
					$scope.origin = 'chartid';
					$timeout($scope.directivePlotLineChart, 0, false);
					//$scope.directivePlotLineChart();
				}
				
            });
			
			$scope.sem['events']=false;
        	$scope.$watchCollection('events', function(events) {
        		$scope.sem['events']=true;
				if (($scope.numbers1) && ($scope.chartid))
				{
					//$scope.directivePlotLineChart();
					//$timeout($scope.directivePlotLineChart, 0);
					$scope.origin = 'events';
					$timeout($scope.directivePlotLineChart, 0, false);
					//$scope.directivePlotLineChart();
				}

        	});
        	            
            $scope.sem['dataset']=false;         	            
			$scope.$watchCollection('dataset', function(dataset) {
				
				numbers1=dataset;
				$scope.numbers1=dataset;
				if (($scope.numbers1) && ($scope.chartid))
				{
					$scope.sem['dataset']=true;
					$scope.origin = 'dataset';
					//console.log(dataset);
					//$timeout($scope.directivePlotLineChart, 0);
					//if (($scope.xaxeformat=='sequence') || ($scope.small==true))
					//{
						$timeout($scope.directivePlotLineChart, 0, false);
					//}
										
					//$scope.directivePlotLineChart();
					//$scope.directivePlotLineChart();
				}
				
            });
            //console.log($scope.chartid);
            
			$scope.directivePlotLineChart = function () {				
				//console.log("directivePlotLineChart");
           		//console.log("origin="+$scope.origin);
				//console.log("$scope.chartid="+$scope.chartid);
				$scope.iddiv="";
				/*
				if ($scope.xaxeformat=='sequence')
				{			
					document.getElementById("sequence").innerHTML = "";
					$scope.iddiv="sequence";
				}
				else 
				*/
				if (document.getElementById("directive_container_lineschart_"+$scope.chartid) !=null)
				{
					document.getElementById("directive_container_lineschart_"+$scope.chartid).innerHTML = "";
					$scope.iddiv="directive_container_lineschart_"+$scope.chartid;
				} 
				else if (document.getElementById("directive_container_lineschart_") !=null)
				{
					document.getElementById("directive_container_lineschart_").innerHTML = "";
					$scope.iddiv="directive_container_lineschart_";
				}				
				else if ($scope.chartid)
				{					
					//document.getElementById("directive_container_lineschart_"+$scope.chartid).innerHTML = "";
					$scope.iddiv="directive_container_lineschart_"+$scope.chartid;
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
					
					
	                
	                if ($scope.dataset.length>0)
	                {
	                	var dataToSend2 = []
	                	dataToSend2 = $scope.dataset;
	                	plotChart=false;
	                	
	                	if ($scope.xaxeformat=='sequence')
	                	{
	                		plotChart=true;
	                	}
	                	else
	                	{
	                		if (isNaN($scope.events[$scope.events.length-1]))
	                		{
	                			plotChart=true;
	                		}
	                	}
	                	
	                	if (($scope.xaxeformat!='sequence') && (!$scope.resolution))
	                	{
	                		plotChart=false;
	                	}
	                	
	                	
	                	
						for (k in $scope.sem)
						{
							//console.log($scope.sem[k]);
							if ($scope.sem[k]==false)
							{
								plotChart=false;
							}
						}	                	
	                	
	                	if (plotChart)
	                	{

							//console.log("Plot chart!!!");
							
							var barLine = policycompass.viz.line(
							{
	                		'idName': $scope.iddiv,
	                		'width': width,
	                		'height': height,
	                		'margin': margin,
	                		'labelX': "label X",
	                		'labelY': $scope.labels,
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
							'legendsColumn': legendsColumn,
							'showAsPercentatge': $scope.showPercentatge,
							'xaxeformat': $scope.xaxeformat,
							'hideyaxeunits': $scope.hideyaxeunits,
							'resolution': $scope.resolution,
							});
							
							         		
	                		barLine.render(dataToSend2, $scope.events, $scope.mode);
	                	}
	                }
					
				}
			
        	}
        },

        template: '' +
        '<div id="directive_container_lineschart_{{chartid}}" class="{{xaxeformat}} pcchart container_graph directive_container_chart directive_container_chart_{{chartid}}">' +        
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
        '</div>'+
        '<div ng-hide="small" id="showFilterContainer" class="showFilterContainer">' +
        '<div id="showFilter" class="showFilter on_check">' +
        '<label class="checkbox-inline"><input ng-model="showLegend" type="checkbox" name="showLegend" class="checkbox filterCheckBox"> Show Legend</label>' +
        '<label class="checkbox-inline"><input ng-model="showLines"  type="checkbox" name="showLines"  class="checkbox filterCheckBox"> Show Lines</label>' +
        '<label class="checkbox-inline"><input ng-model="showAreas"  type="checkbox" name="showAreas"  class="checkbox filterCheckBox"> Show Areas</label>' +
        '<label class="checkbox-inline"><input ng-model="showPoints" type="checkbox" name="showPoints" class="checkbox filterCheckBox"> Show Points</label>' +
        '<label class="checkbox-inline"><input ng-model="showLabels" type="checkbox" name="showLabels" class="checkbox filterCheckBox"> Show Labels</label>' +
		'<label class="checkbox-inline"><input ng-model="showGrid"   type="checkbox" name="showGrid"   class="checkbox filterCheckBox"> Show Grid</label>' +
		'<label class="checkbox-inline"><input ng-model="showTogether"  type="checkbox" name="showTogether"  class="checkbox filterCheckBox"> Show only one Y axe</label>' +
        '<label class="checkbox-inline"><input ng-model="showPercentatge" type="checkbox" name="showPercentatge" class="checkbox filterCheckBox"> Show as %</label>' +
        '</div>' +
        '</div>'        
    };
}])


;
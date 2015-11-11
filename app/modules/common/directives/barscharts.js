angular.module('pcApp.common.directives.barscharts', [

])
//example of use:
//<div class="pcBarsChart" dataset="dataset" chartid="3"  mode="view" show-Legend="showLegend" show-Labels="showLabels"></div>
//dataset -> array. Content expected
//array contetn like
/*
$scope.dataset  (mandatory) = [{"Category":"1","From":20950114,"Key":"Air pollution emissions for the national territory","labelY":["Euro"],"To":"2003-01-01","Value":20950114,"ValueX":"2003-01-01","ValueY":20950114,"XY":"2003-01-01|20950114"},{"Category":"1","From":19841774,"Key":"Air pollution emissions for the national territory","labelY":["Euro"],"To":"2004-01-01","Value":19841774,"ValueX":"2004-01-01","ValueY":19841774,"XY":"2004-01-01|19841774"},{"Category":"1","From":20188596,"Key":"Air pollution emissions for the national territory","labelY":["Euro"],"To":"2005-01-01","Value":20188596,"ValueX":"2005-01-01","ValueY":20188596,"XY":"2005-01-01|20188596"},{"Category":"1","From":19996685,"Key":"Air pollution emissions for the national territory","labelY":["Euro"],"To":"2006-01-01","Value":19996685,"ValueX":"2006-01-01","ValueY":19996685,"XY":"2006-01-01|19996685"},{"Category":"1","From":19835473,"Key":"Air pollution emissions for the national territory","labelY":["Euro"],"To":"2007-01-01","Value":19835473,"ValueX":"2007-01-01","ValueY":19835473,"XY":"2007-01-01|19835473"},{"Category":"1","From":16486870,"Key":"Air pollution emissions for the national territory","labelY":["Euro"],"To":"2008-01-01","Value":16486870,"ValueX":"2008-01-01","ValueY":16486870,"XY":"2008-01-01|16486870"},{"Category":"1","From":14773675,"Key":"Air pollution emissions for the national territory","labelY":["Euro"],"To":"2009-01-01","Value":14773675,"ValueX":"2009-01-01","ValueY":14773675,"XY":"2009-01-01|14773675"},{"Category":"1","From":12656697,"Key":"Air pollution emissions for the national territory","labelY":["Euro"],"To":"2010-01-01","Value":12656697,"ValueX":"2010-01-01","ValueY":12656697,"XY":"2010-01-01|12656697"},{"Category":"1","From":13229593,"Key":"Air pollution emissions for the national territory","labelY":["Euro"],"To":"2011-01-01","Value":13229593,"ValueX":"2011-01-01","ValueY":13229593,"XY":"2011-01-01|13229593"},{"Category":"1","From":13195719,"Key":"Air pollution emissions for the national territory","labelY":["Euro"],"To":"2012-01-01","Value":13195719,"ValueX":"2012-01-01","ValueY":13195719,"XY":"2012-01-01|13195719"}]
*/
//a row per line to plot	
/*chartid (mandatory) = unique id for the visualisation*/
/*small (mandatory) = boolean, true or false to plot image size */ 
/*showLegend, showLabels boolean to configure the template */ 

.directive('pcBarsChart', ['$log', 'API_CONF', function ($log,  API_CONF) {
	
    return {
        restrict: 'C',
        scope: {
        	dataset: '=dataset',          
        	chartid: '=chartid',
        	small: '=small',
        	showLabels: '=showLabels',
        	showLegend: '=showLegend',
        	showGrid: '=showGrid',
        	resolution: '=resolution',
        	labelyaxe: '=labelyaxe',
        	showPercentatge: '=showPercentatge',
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
			
			//$scope.cntloading = 0;
			
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
			$scope.$watch('labelyaxe', function(labelyaxe) {
				if (($scope.dataset) && ($scope.chartid))
				{
					$scope.directivePlotBarChart('labelyaxe');
				}				
            });
			*/
			/*
			$scope.$watch('resolution', function(resolution) {
				if (($scope.dataset) && ($scope.chartid))
				{
					$scope.directivePlotBarChart('resolution');
				}				
            });
            */
           
           
           	$scope.watcherPercentatge = false;
			$scope.$watch('showPercentatge', function(showPercentatge) {
				//console.log("whatch showPercentatge");
				$scope.watcherPercentatge = true;
				if (($scope.dataset) && ($scope.chartid))
				{
					$scope.directivePlotBarChart('showPercentatge');
				}				
            });
            
            $scope.watcherLabel = false;
			$scope.$watch('showLabels', function(showLabels) {
				//console.log("whatch showLabels");
				$scope.watcherLabel = true;
				if (($scope.dataset) && ($scope.chartid))
				{
					$scope.directivePlotBarChart('showLabels');
				}				
            });
			
			$scope.watcherLegend = false;
			$scope.$watch('showLegend', function(showLegend) {
				//console.log("whatch showLegend");
				$scope.watcherLegend = true;
				if (($scope.dataset) && ($scope.chartid))
				{
					$scope.directivePlotBarChart('showLegend');
				}				
            });
			
			$scope.watcherGrid = false;
			$scope.$watch('showGrid', function(showGrid) {
				//console.log("whatch showGrid");
				$scope.watcherGrid = true;
				if (($scope.dataset) && ($scope.chartid))
				{
					$scope.directivePlotBarChart('showGrid');
				}				
            });
            
            $scope.watcherDataset = false;
			$scope.$watch('dataset', function(dataset) {
                //console.log("whatch dataset");
                $scope.watcherDataset = true;
                
				numbers1=dataset;
				$scope.numbers1=dataset;
				if ($scope.numbers1)
				{
					$scope.directivePlotBarChart('dataset');
				}
				
            }); 
                    	
			/*
			setTimeout(function () {
                
                numbers1=$scope.dataset;
				$scope.numbers1=$scope.dataset;
				if ($scope.numbers1)
				{
					$scope.directivePlotBarChart();
				}
                
            }, 8000);
            */
            //console.log($scope.chartid);
            
			$scope.directivePlotBarChart = function (origin) {
				
				
				$scope.iddiv="";
				if (document.getElementById("directive_container_barschart_"+$scope.chartid) !=null)
				{
					document.getElementById("directive_container_barschart_"+$scope.chartid).innerHTML = "";
					$scope.iddiv="directive_container_barschart_"+$scope.chartid;	
				} 
				//else if ($scope.chartid)
				//{
				//	document.getElementById("directive_container_barschart_"+$scope.chartid).innerHTML = "";					
				//}
				else
				{
					document.getElementById("directive_container_barschart_").innerHTML = "";
					$scope.iddiv="directive_container_barschart_";
				}
				
				//var datasetToSend = $scope.numbers1;
				var datasetToSend = $scope.dataset;
				//console.log("----numbers1----");
				//console.log(numbers1);
				var legendsColumn = 0;
				
				//console.log($scope.dataset);
				
				if ($scope.showLegend)
				{
					//legendsColumn = Math.ceil($scope.numbers1.length/9);
					legendsColumn = Math.ceil($scope.dataset.length/9);
				}
				else
				{
					legendsColumn = 0;
				}	
				//legendsColumn = 10;
				//console.log(datasetToSend);
	        	
	        	if ($scope.list)
	        	{
	        		legendsColumn = 0;
	        	}
	        	
				var margin = {top: 20, right: 20, bottom: 55+(legendsColumn)*20, left: 44};
				var width = 980;// - margin.left - margin.right;
	    		//var width = 400 - margin.left - margin.right;
	    		//var height = 300 - margin.top - margin.bottom;
				var height = 326;
				
				var font_size = 11;
				
				//if ($scope.list)				
				if ($scope.small)
				{						
						width = width / 5;
						height = height / 5;
						margin.top = margin.top / 5;
						margin.right = margin.right / 5;
						margin.bottom = margin.bottom / 5;
						margin.left = margin.left / 5;
						font_size = font_size / 5;
						$scope.showLegend = false;					
				}
				
				if(datasetToSend)
				{
					if (datasetToSend.length>0)
					{
						//console.log("origin="+origin);
						//console.log("scope.cntloading="+$scope.cntloading);

						if (($scope.watcherDataset) && ($scope.watcherLabel) && ($scope.watcherLegend) && ($scope.watcherGrid) && ($scope.watcherDataset) && ($scope.watcherPercentatge))
						 {
						var barObj = policycompass.viz.barsMultiple(
						{
	                		'idName': $scope.iddiv,
	            			'width': width,
	            			'height':height,
	            			'margin': margin,
	            			'labelX': "",
	            			//'labelY': labelYAxe,
	            			//'radius': 4,
	            			'font_size': font_size,
	            			'showLegend': $scope.showLegend,
							'showLabels': $scope.showLabels,
							'showGrid': $scope.showGrid,
							'legendsColumn': legendsColumn,
							'resolution': $scope.resolution,
							'labelY': $scope.labelyaxe,
							'showAsPercentatge': $scope.showPercentatge,					
	            		});
	            						
							var eventsArray = [];
							//barObj.render(datasetToSend, $scope.eventsToPlot);
							barObj.render(datasetToSend, eventsArray);
							
							//$scope.cntloading = $scope.cntloading+1;
						}

					}
				}
        	
        		$scope.loading=false;
        	}
        	
        },

        template: ''+
        '<div id="directive_container_barschart_{{chartid}}" class="container_graph directive_container_chart_{{chartid}}">'+
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
        '<label class="checkbox-inline"><input ng-model="showLabels" type="checkbox" name="showLabels" class="checkbox filterCheckBox"> Show Labels</label>' +
        '<label class="checkbox-inline"><input ng-model="showGrid"   type="checkbox" name="showGrid"   class="checkbox filterCheckBox"> Show Grid</label>' +
        '<label class="checkbox-inline"><input ng-model="showPercentatge" type="checkbox" name="showPercentatge" class="checkbox filterCheckBox"> Show as %</label>' +
        '</div>' +
        '</div>'
    };
}])


;
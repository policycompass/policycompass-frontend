angular.module('pcApp.common.directives.mapscharts', [

])		
//exemple of use:
/*
*/
.directive('pcMapsChart', ['$log', 'API_CONF', function ($log,  API_CONF) {
	
    return {
        restrict: 'C',
        scope: {
        	chartid: '=chartid',
        	dataset: '=dataset',
        	small: '=small',
        	mode: '=mode',
        	showLegend: '=showLegend',
        	showZoom: '=showZoom',
        	showBubbles: '=showBubbles',
        	projection: '=projection',
        	fromcountry: '=fromcountry',
        	tocountry: '=tocountry',
        	scaleColor: '=scaleColor'        	
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
                                    
           // console.log("controller pcMapsChart");


            $scope.$watch('fromcountry', function(fromcountry) {
				if ($scope.numbers1)
				{
					$scope.directivePlotMapChart();	
				}				
            });
            
            
            $scope.$watch('tocountry', function(tocountry) {
				if ($scope.numbers1)
				{
					$scope.directivePlotMapChart();	
				}				
            });
                        
            $scope.$watch('showZoom', function(showZoom) {
				if ($scope.numbers1)
				{
					$scope.directivePlotMapChart();	
				}				
            });

            $scope.$watch('showBubbles', function(showBubbles) {
				if ($scope.numbers1)
				{
					$scope.directivePlotMapChart();	
				}				
            });
                   

            $scope.$watch('scaleColor', function(scaleColor) {
				if ($scope.numbers1)
				{
					$scope.directivePlotMapChart();	
				}				
            });
                   
			$scope.$watch('showLegend', function(showLegend) {
				if ($scope.numbers1)
				{
					$scope.directivePlotMapChart();	
				}				
            });

                                	            
			$scope.$watch('dataset', function(dataset) {
				numbers1=dataset;
				$scope.numbers1=dataset;
				if ($scope.numbers1)
				{
					$scope.directivePlotMapChart();
				}
				
            });
			  
                                	
            //console.log($scope.chartid);
            
			$scope.directivePlotMapChart = function () {				
				//console.log("directivePlotMapChart --- $scope.chartid="+$scope.chartid);
           				
				//console.log("$scope.chartid="+$scope.chartid);
				
				$scope.iddiv="";
				
				if (document.getElementById("directive_container_mapchart_"+$scope.chartid) !=null)
				{
					document.getElementById("directive_container_mapchart_"+$scope.chartid).innerHTML = "";
					$scope.iddiv="directive_container_mapchart_"+$scope.chartid;
				} 
				else if (document.getElementById("directive_container_mapchart_") !=null)
				{
					document.getElementById("directive_container_mapchart_").innerHTML = "";
					$scope.iddiv="directive_container_mapchart_";
				}
				else if ($scope.chartid)
				{
					document.getElementById("directive_container_mapchart_").innerHTML = "";
					$scope.iddiv="directive_container_mapchart_"+$scope.chartid;
				}
					
				//console.log("$scope.iddiv="+$scope.iddiv);
				var initialZoomMap = 2;
				if (document.getElementById('initialZoom').value>0)
				{
					initialZoomMap = document.getElementById('initialZoom').value;
				}
				
				if (document.getElementById('initialLat').value)
				{
					var initialLat = document.getElementById('initialLat').value;
				}
				
				if (document.getElementById('initialLng').value)
				{
					var initialLng = document.getElementById('initialLng').value;
				}

													
				if ($scope.numbers1)
				{

					var margin = {top: 20, right: 20, bottom: 55, left: 44},
					width = 980,
					height = 426,
					font_size = 11;
					
					var from_country = '';
					var to_country = '';
						
					if ($scope.small)
					{
							margin.top = margin.top / 5;
							margin.right = margin.right / 5;
							margin.bottom = margin.bottom / 5;
							margin.left = margin.left / 5;
							width = width / 5;
							height = height / 5;
							font_size = font_size / 5;							
							$scope.showLegend = false;	
							$scope.showZoom = false;
							$scope.showBubbles = false;
							$scope.showMovement = false;	
							from_country = $scope.fromcountry;				
					}
					else
					{
						from_country = $scope.fromcountry;
						//to_country = $scope.tocountry;
						to_country = $scope.fromcountry;
					}
					
					//console.log("$scope.fromcountry="+$scope.fromcountry);
					//console.log("$scope.tocountry="+$scope.tocountry);
//					console.log("$scope.showLegend="+$scope.showLegend);
//					console.log("$scope.showZoom="+$scope.showZoom);
//					console.log("$scope.projection="+$scope.projection);
					//var mapObj = policycompass.viz.mapW(
					//var mapObj = policycompass.viz.mapW_datamaps(
					var mapObj = policycompass.viz.mapLeaflet(
					{
						'idName': $scope.iddiv,
						'width': width,
						'height': height,
						'margin': margin,
						'font_size': font_size,
						'small': $scope.small,
						'legend': $scope.showLegend,
						'scaleColor' : $scope.scaleColor,
						'projection': $scope.projection,
						'showZoom': $scope.showZoom,
						'initialLat': initialLat,
						'initialLng': initialLng,
						'initialZoom': initialZoomMap,
						'showBubbles': $scope.showBubbles,
						'showMovement': $scope.showMovemen,
						'data': $scope.dataset,
						'from_country': from_country,
						'to_country': to_country				
					});
					
				}
			
        	}
        	
        	//$scope.directivePlotMapChart();
        },


        template: '' +
        '<div id="directive_container_mapchart_{{chartid}}" class="pcchart container_graph directive_container_chart directive_container_mapchart_{{chartid}}">' +        
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
        '<input type="hidden" name="initialZoom" id="initialZoom" value="2">' +
        '<input type="hidden" name="initialLat" id="initialLat" value="49.009952">' +
        '<input type="hidden" name="initialLng" id="initialLng" value="2.548635">' +        
        '<label class="checkbox-inline"><input ng-model="showZoom" type="checkbox" name="showZoom" class="checkbox filterCheckBox"> Enable Zoom</label>' +
        '<label class="checkbox-inline"><input ng-model="showBubbles" type="checkbox" name="showBubbles" class="checkbox filterCheckBox"> View as bubble marker</label>' +        
        '<label ng-show="showLegend" class="checkbox-inline">'+
        //'<input type="color" name="color" ng-model="scaleColor"  /> ' +
        '<spectrum name="color" ng-model="scaleColor" ng-model-onblur options="{showInput: true, showAlpha: false, allowEmpty: false, preferredFormat:hex}"></spectrum>'+
        ' Scale Colour </label>' +
        '</div>' +
        '</div>'
    };
}])

;
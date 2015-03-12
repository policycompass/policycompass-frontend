angular.module('pcApp.common.directives.piecharts', [

])
//exemple of use:
//<div class="pcPieChart" dataset="dataset" chartid="1" show-Legend="showLegend"  mode="view" show-Labels="showLabels"></div>
//dataset -> array. Content expected
//array contetn like
/*
$scope.dataset (mandatory) = [{"Key":"2003-01-01","Labels":["Hungary","European Union (28 countries)","Turkey","Switzerland","Norway","Liechtenstein","Iceland","United Kingdom","Sweden","Finland","Belgium","Slovakia","Slovenia","Romania","Portugal","Poland","Austria","Netherlands","Malta","Luxembourg","Bulgaria","Lithuania","Latvia","Cyprus","Italy","Croatia","France","Spain","Greece","Ireland","Czech Republic","Estonia","Germany (until 1990 former territory of the FRG)","Denmark"],"Values":["24801.0","10206834.0","1888557.0","16609.0","31491.0","43.0","38315.0","1047432.0","115284.0","121394.0","16715.0","105496.0","61582.0","577561.0","196085.0","1287019.0","32459.0","12713.0","65748.0","2727.0","82399.0","40022.0","15578.0","44847.0","638741.0","68223.0","650218.0","1876624.0","749417.0","83599.0","23213.0","104211.0","658425.0","65732.0"],"Units":["Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro"]},{"Key":"2004-01-01","Labels":["Hungary","European Union (28 countries)","Turkey","Switzerland","Norway","Liechtenstein","Iceland","United Kingdom","Sweden","Finland","Belgium","Slovakia","Slovenia","Romania","Portugal","Poland","Austria","Netherlands","Malta","Luxembourg","Bulgaria","Lithuania","Latvia","Cyprus","Italy","Croatia","France","Spain","Greece","Ireland","Czech Republic","Estonia","Germany (until 1990 former territory of the FRG)","Denmark"],"Values":["150553.0","9739980.0","1880246.0","1678.0","33005.0","36.0","33458.0","906942.0","126104.0","102345.0","169722.0","96188.0","51001.0","550723.0","200216.0","1249318.0","27943.0","127424.0","27191.0","2605.0","78907.0","40949.0","14273.0","38408.0","609159.0","5777.0","652368.0","1924619.0","7473.0","75572.0","227285.0","9403.0","626168.0","54735.0"],"Units":["Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro"]},{"Key":"2005-01-01","Labels":["Hungary","European Union (28 countries)","Turkey","Switzerland","Norway","Liechtenstein","Iceland","United Kingdom","Sweden","Finland","Belgium","Slovakia","Slovenia","Romania","Portugal","Poland","Austria","Netherlands","Malta","Luxembourg","Bulgaria","Lithuania","Latvia","Cyprus","Italy","Croatia","France","Spain","Greece","Ireland","Czech Republic","Estonia","Germany (until 1990 former territory of the FRG)","Denmark"],"Values":["42887.0","9331801.0","2105958.0","17365.0","32738.0","36.0","39161.0","794945.0","125063.0","87327.0","156227.0","89007.0","40789.0","642584.0","197198.0","1217696.0","27767.0","12827.0","21815.0","2507.0","776489.0","43077.0","16537.0","35506.0","532522.0","64566.0","61647.0","1930310.0","716982.0","73869.0","218643.0","80659.0","592477.0","59614.0"],"Units":["Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro"]},{"Key":"2006-01-01","Labels":["Hungary","European Union (28 countries)","Turkey","Switzerland","Norway","Liechtenstein","Iceland","United Kingdom","Sweden","Finland","Belgium","Slovakia","Slovenia","Romania","Portugal","Poland","Austria","Netherlands","Malta","Luxembourg","Bulgaria","Lithuania","Latvia","Cyprus","Italy","Croatia","France","Spain","Greece","Ireland","Czech Republic","Estonia","Germany (until 1990 former territory of the FRG)","Denmark"],"Values":["40807.0","9201175.0","2270163.0","16278.0","26384.0","38.0","4533.0","777189.0","113217.0","103898.0","14661.0","87751.0","16515.0","652925.0","175404.0","1292751.0","28497.0","131015.0","23214.0","2895.0","763116.0","43712.0","13582.0","28997.0","520084.0","60518.0","57396.0","1845480.0","723589.0","64642.0","211235.0","753.0","604743.0","79528.0"],"Units":["Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro"]},{"Key":"2007-01-01","Labels":["Hungary","European Union (28 countries)","Turkey","Switzerland","Norway","Liechtenstein","Iceland","United Kingdom","Sweden","Finland","Belgium","Slovakia","Slovenia","Romania","Portugal","Poland","Austria","Netherlands","Malta","Luxembourg","Bulgaria","Lithuania","Latvia","Cyprus","Italy","Croatia","France","Spain","Greece","Ireland","Czech Republic","Estonia","Germany (until 1990 former territory of the FRG)","Denmark"],"Values":["36374.0","8897733.0","2647622.0","14358.0","25734.0","27.0","59584.0","731309.0","89712.0","97902.0","135953.0","70557.0","14654.0","534933.0","17038.0","1229641.0","25458.0","120197.0","25309.0","2466.0","819711.0","34325.0","9583.0","26919.0","486834.0","67952.0","563334.0","1825121.0","740527.0","59273.0","217031.0","94794.0","61553.0","51955.0"],"Units":["Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro"]},{"Key":"2008-01-01","Labels":["Hungary","European Union (28 countries)","Turkey","Switzerland","Norway","Liechtenstein","Iceland","United Kingdom","Sweden","Finland","Belgium","Slovakia","Slovenia","Romania","Portugal","Poland","Austria","Netherlands","Malta","Luxembourg","Bulgaria","Lithuania","Latvia","Cyprus","Italy","Croatia","France","Spain","Greece","Ireland","Czech Republic","Estonia","Germany (until 1990 former territory of the FRG)","Denmark"],"Values":["36616.0","7216673.0","2561445.0","14961.0","26209.0","32.0","76152.0","635585.0","8183.0","83155.0","105865.0","69404.0","12876.0","525771.0","123053.0","1007757.0","23105.0","94895.0","24453.0","2339.0","569371.0","33178.0","9706.0","24045.0","442423.0","58028.0","455914.0","1200074.0","644521.0","48591.0","174433.0","76572.0","61292.0","40193.0"],"Units":["Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro"]},{"Key":"2009-01-01","Labels":["Hungary","European Union (28 countries)","Turkey","Switzerland","Norway","Liechtenstein","Iceland","United Kingdom","Sweden","Finland","Belgium","Slovakia","Slovenia","Romania","Portugal","Poland","Austria","Netherlands","Malta","Luxembourg","Bulgaria","Lithuania","Latvia","Cyprus","Italy","Croatia","France","Spain","Greece","Ireland","Czech Republic","Estonia","Germany (until 1990 former territory of the FRG)","Denmark"],"Values":["30856.0","6307010.0","2664987.0","12981.0","20269.0","35.0","70135.0","523679.0","83579.0","67233.0","83017.0","64082.0","10527.0","443579.0","862.0","868616.0","17642.0","80169.0","21677.0","2314.0","439684.0","3183.0","10939.0","19284.0","368889.0","59759.0","412936.0","1145134.0","592781.0","34921.0","173562.0","61332.0","54974.0","23048.0"],"Units":["Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro"]},{"Key":"2010-01-01","Labels":["Hungary","European Union (28 countries)","Turkey","Switzerland","Norway","Liechtenstein","Iceland","United Kingdom","Sweden","Finland","Belgium","Slovakia","Slovenia","Romania","Portugal","Poland","Austria","Netherlands","Malta","Luxembourg","Bulgaria","Lithuania","Latvia","Cyprus","Italy","Croatia","France","Spain","Greece","Ireland","Czech Republic","Estonia","Germany (until 1990 former territory of the FRG)","Denmark"],"Values":["32347.0","5930091.0","2558842.0","13703.0","24273.0","31.0","7505.0","513131.0","70111.0","72852.0","65344.0","69392.0","9879.0","350336.0","76026.0","93608.0","19235.0","7234.0","24814.0","2278.0","386949.0","31514.0","9153.0","23301.0","344992.0","35636.0","383.0","1074754.0","438526.0","29246.0","170382.0","89436.0","57516.0","23877.0"],"Units":["Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro"]},{"Key":"2011-01-01","Labels":["Hungary","European Union (28 countries)","Turkey","Switzerland","Norway","Liechtenstein","Iceland","United Kingdom","Sweden","Finland","Belgium","Slovakia","Slovenia","Romania","Portugal","Poland","Austria","Netherlands","Malta","Luxembourg","Bulgaria","Lithuania","Latvia","Cyprus","Italy","Croatia","France","Spain","Greece","Ireland","Czech Republic","Estonia","Germany (until 1990 former territory of the FRG)","Denmark"],"Values":["35327.0","5893977.0","2652867.0","11952.0","23202.0","30.0","81997.0","47547.0","57138.0","66332.0","57256.0","68483.0","10989.0","321565.0","76129.0","897936.0","18711.0","61726.0","21992.0","1828.0","51478.0","28738.0","7558.0","22025.0","327682.0","34102.0","349015.0","1139483.0","4416.0","25854.0","163634.0","77868.0","567149.0","23607.0"],"Units":["Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro"]},{"Key":"2012-01-01","Labels":["Hungary","European Union (28 countries)","Turkey","Switzerland","Norway","Liechtenstein","Iceland","United Kingdom","Sweden","Finland","Belgium","Slovakia","Slovenia","Romania","Portugal","Poland","Austria","Netherlands","Malta","Luxembourg","Bulgaria","Lithuania","Latvia","Cyprus","Italy","Croatia","France","Spain","Greece","Ireland","Czech Republic","Estonia","Germany (until 1990 former territory of the FRG)","Denmark"],"Values":["31836.0","5376508.0","2739335.0","12143.0","21141.0","32.0","85539.0","514149.0","55205.0","5438.0","51611.0","58523.0","10234.0","259666.0","73982.0","853913.0","17899.0","60734.0","21809.0","2066.0","328815.0","36399.0","7461.0","17273.0","283476.0","25691.0","3293.0","1082838.0","391236.0","24472.0","157972.0","4504.0","562121.0","18405.0"],"Units":["Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro","Euro"]}];
*/
//a row per option to plot	
/*chartid (mandatory) = unique id for the visualisation*/
/*small (mandatory) = boolean, true or false to plot image size */ 
/*labels = used to plot Y labels content*/
/*showLegend, showLabels boolean to configure the template */ 

.directive('pcPieChart', ['$log', 'API_CONF', function ($log,  API_CONF) {
	
    return {
        restrict: 'C',
        scope: {
        	dataset: '=dataset',          
        	chartid: '=chartid',
        	small: '=small',
        	showLabels: '=showLabels',
        	showLegend: '=showLegend'
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
			//console.log("controller pie chart");
			//console.log($scope.metricsList);
			//console.log("scope.chartid="+$scope.chartid);

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

            			
			$scope.$watch('showLabels', function(showLabels) {
				if (($scope.numbers2) && ($scope.chartid))
				{
					$scope.directivePlotPieChart();
				}				
            });

			$scope.$watch('showLegend', function(showLegend) {
				if (($scope.numbers2) && ($scope.chartid))
				{
					$scope.directivePlotPieChart();
				}				
            });
                        			
			$scope.$watch('dataset', function(dataset) {
               			
				
                numbers2=dataset;
				$scope.numbers2=dataset;
				//console.log(numbers2);
				if (($scope.numbers2) && ($scope.chartid))
				{
					//console.log("dins")
					numbers2.sort(function(a, b) {
						var dateA=new Date(a.Key), dateB=new Date(b.Key)
 						return dateA-dateB //sort by date ascending
					});
				
					//var dataset = numbers2;
					$scope.dataset= numbers2;
					$scope.numbers2=numbers2;
					
					$scope.selectedAll = false;
					//console.log($scope.selectedAll);
					//$scope.dateselector = $scope.numbers2[0].Key;
					//console.log($scope.numbers2.length);
					if ($scope.numbers2.length>0)
					{
						//console.log($scope.numbers2[0].Key);
						$scope.form = {dateselector : $scope.numbers2[0].Key};
						//$scope.selection = {Keys: {$scope.numbers2[0].Key: true}};
						
						var $arrayTmp = {};
						
						for (var l in $scope.numbers2) {						
							//console.log(l);
							if (l==0)
							{
								$arrayTmp[$scope.numbers2[l].Key]=true;							
							}
							else
							{
								$arrayTmp[$scope.numbers2[l].Key]=false;
							}
						}
						
						$scope.selection = {Keys: $arrayTmp};
						//console.log($scope.selection);
						//$scope.selection = {Keys: {"50d5ad": true}};
					}
				
				
					//console.log($scope.form.dateselector);
					//console.log(dataset)
			
					$scope.directivePlotPieChart();

				}
				
            });
			/*
			setTimeout(function () {
                
                numbers2=$scope.dataset;
				$scope.numbers2=$scope.dataset;
				//console.log(numbers2);
				if (numbers2)
				{
					//console.log("dins")
					numbers2.sort(function(a, b) {
						var dateA=new Date(a.Key), dateB=new Date(b.Key)
 						return dateA-dateB //sort by date ascending
					});
				
					//var dataset = numbers2;
					$scope.dataset= numbers2;
					$scope.numbers2=numbers2;
					
					$scope.selectedAll = false;
					//console.log($scope.selectedAll);
					//$scope.dateselector = $scope.numbers2[0].Key;
					//console.log($scope.numbers2.length);
					if ($scope.numbers2.length>0)
					{
						//console.log($scope.numbers2[0].Key);
						$scope.form = {dateselector : $scope.numbers2[0].Key};
						//$scope.selection = {Keys: {$scope.numbers2[0].Key: true}};
						
						var $arrayTmp = {};
						
						for (var l in $scope.numbers2) {						
							//console.log(l);
							if (l==0)
							{
								$arrayTmp[$scope.numbers2[l].Key]=true;							
							}
							else
							{
								$arrayTmp[$scope.numbers2[l].Key]=false;
							}
						}
						
						$scope.selection = {Keys: $arrayTmp};
						//console.log($scope.selection);
						//$scope.selection = {Keys: {"50d5ad": true}};
					}
				
				
					//console.log($scope.form.dateselector);
					//console.log(dataset)
			
					$scope.directivePlotPieChart();

				}
                
            }, 8000);
*/

			$scope.directivePlotPieChart = function () {

				
				var margin = {top: 20, right: 20, bottom: 40, left: 20};
				var width = 980,
				height = 326,
				//radius = Math.min(width, height) / 2;
				radius = 180,
				innerRadious = 50,
				font_size = 11;
							
				var cntPies = 0;
						
				//if ($scope.list)
				if ($scope.small)
				{
					radius = radius / 5;
					width = width / 5;
					height = height / 5;
					margin.top = margin.top / 5;
					margin.right = margin.right / 5;
					margin.bottom = margin.bottom / 5 + 3;
					margin.left = margin.left / 5;
					innerRadious = innerRadious / 5;
					font_size = font_size / 5;
					$scope.showLegend = false;						
				}
				
				//$scope.chartid	
				
				$scope.iddiv="";
				if (document.getElementById("directive_container_piechart_"+$scope.chartid) !=null)
				{
					document.getElementById("directive_container_piechart_"+$scope.chartid).innerHTML = "";	
					$scope.iddiv="directive_container_lineschart_"+$scope.chartid;
				} 		
				//else if ($scope.chartid)
				////if ($scope.visualization.id)
				//{
				//	//document.getElementById("directive_container_piechart_"+$scope.visualization.id).innerHTML = "";
				//	document.getElementById("directive_container_piechart_"+$scope.chartid).innerHTML = "";
				//}
				else
				{
					document.getElementById("directive_container_piechart_").innerHTML = "";
					$scope.iddiv="directive_container_lineschart_";
				}
						
				//console.log($scope.iddiv);
				
				$scope.dataset.forEach(function(d,i) {
					//console.log("1er foreach i="+i);
					if (i==0)
					{
						$style='';
					}
					else
					{
						$style='style="display: none;"';
					}
					
					//if ($scope.visualization.id)
					
					//if ($scope.chartid)
					
					if (document.getElementById("directive_container_piechart_"+$scope.chartid) !=null)
					{ 
						//onsole.log("1");
						document.getElementById("directive_container_piechart_"+$scope.chartid).innerHTML = document.getElementById("directive_container_piechart_"+$scope.chartid).innerHTML + "<div class='pie_"+$scope.chartid+"' id='pie_"+$scope.chartid+"_"+i+"' "+$style+"></div>"						
					}
					else
					{
						//console.log("2");
						document.getElementById("directive_container_piechart_").innerHTML = document.getElementById("directive_container_piechart_").innerHTML + "<div class='pie_' id='pie__"+i+"' "+$style+"></div>"
					}
					
					//document.getElementById($scope.iddiv).innerHTML = document.getElementById($scope.iddiv).innerHTML + "<div class='pie_' id='pie__"+i+"' "+$style+"></div>"
				
				});
							
							
				$scope.dataset.forEach(function(d,i) 
				{
					//console.log("2n foreach i="+i);
					
					//datasetToSend = d.values;
					//if (cntPies>0)
					if (1==1)
					{
						var datasetToSend = d;
						//console.log(labelYAxe);
						
						var pieObj = policycompass.viz.pie(
						{
							'idName':"pie_"+$scope.chartid+"_"+i,
							'visualizationid':$scope.visualization,
							'idPie': cntPies,
							'width': width,
							'height':height,
							'margin': margin,
							'radius':radius,
							'innerRadious': innerRadious,
							'font_size': font_size,
							'showLegend': $scope.showLegend,
							'showLabels': $scope.showLabels
						});
		
			        	pieObj.render(datasetToSend);
					}				
					cntPies = cntPies +1;	
			});
			}
        },

        template: '<div id="directive_container_piechart_{{chartid}}" class="container_graph directive_container_chart_{{chartid}}">' +
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
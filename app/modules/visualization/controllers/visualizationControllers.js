angular.module('pcApp.visualization.controllers.visualization', [
    'pcApp.visualization.services.visualization',
    'pcApp.references.services.reference',
    'pcApp.config'
])


.factory('helper', [function() {
    return {
    	
    	baseVisualizationsCreateController: function($scope, $route, $routeParams, $modal, Event, Metric, Visualization, $location, helper, $log, API_CONF) {
    	
    		//funtion to reset the form, used into the Revert button
			$scope.revertVisualization = function()	{	
				var answer = confirm("Are you sure?")
				if (answer)
				{
					if ($scope.mode=='create')
					{
						$route.reload();
					}
					else{
						$location.path($scope.resetlocation);
					}
				}	
	
			};  


			//function to select the Map or graph button   
			$scope.selectTabParent = function(setTab) {
				$scope.tabParent = setTab;
				$scope.tabSon = 0;
			};
			
			//funtion used to check if a button is checked (butotns Map or graph)
			$scope.isSelectedParent = function(checkTab) {
				return $scope.tabParent === checkTab;
			};
			
			//function to select the type of graph (line, pie, chart) button 
			$scope.selectTabSon = function(setTab) {
				$scope.typeToPlot=setTab;
				$scope.tabSon = setTab;
				//rePlotGraph();
			};

			//funtion to check if a type of graph is selected (line, pie, chart buttons)
			$scope.isSelectedSon = function(checkTab) {
				return $scope.tabSon === checkTab;			
			};
			
			//funtion used into the button "Add metric" (diply list of metrics availables
			$scope.addMetrictoList= function() {	
				$('#addmetricsbutton').toggleClass('active');
        		$('#metrics-list').toggle('slow');	
			}

			//funtion used when a metic is selected. Add a metric into the list	
			$scope.addFilterMetric = function(idMetric) {
				//console.log("---addFilterMetric--")
				var containerLink = document.getElementById("metric-list-item-item-"+idMetric);		
    			$(containerLink).addClass('active');
    			var str =  $(containerLink).attr("name");
    			$('#' + str + '').addClass('active');	
    	
    			var containerId = document.getElementById("MetricSelectediId_"+idMetric).value;	
    			var containerIndex = document.getElementById("MetricSelectediIndex_"+idMetric).value;
		
				$scope.MetricSelectediId_[idMetric]=idMetric;

				var myText = "from";
				$scope.MetricSelectorLabelColumn_[containerIndex]=myText;
		
				var myText = "value";
				$scope.MetricSelectorDataColumn_[containerIndex]=myText;
			
				var myText = "grouping column";
				$scope.MetricselectorGroupingData_[containerIndex]=myText;
		
				selectedText = "---";
				var myObject = {
					'id':idMetric,
					'name':selectedText,
					'column':'from',
					'value':'value',
					'group':'grouping column'
				};
		
				//console.log("a1");
					
				$scope.ListMetricsFilter.push(myObject);			
				$scope.rePlotGraph();
			};

			//function used to display contetn of a metric
			$scope.displaycontentMetric = function(idMetric) {
				var containerLink = document.getElementById("edit-metric-button-"+idMetric);
		 		$(containerLink).parent().next().toggle(200);	 
			};
	
			//funtioon used to delete a metric from the list of señected metrics
			$scope.deleteMetricFromList = function(idMetric) {	
				var answer = confirm("Are you sure to delete this row?")
				if (answer)
				{
					var containerLink = document.getElementById("delete-metric-button-"+idMetric);		
					$(containerLink).parent().parent().removeClass('active');
					var str =  $(containerLink).parent().parent().attr("id");
	    			$(".metric-list-item[name='"+ str +"']").removeClass('active');		
					$scope.MetricSelectediId_[idMetric]= "";
					$scope.rePlotGraph();
				}		
			};

			//funtion used to recover the metrics list
			$scope.metrics = Metric.query(
				null,
				function(metricList) {
				},
				function(error) {
					alert(error.data.message);
				}
			);
			
			//funtion used to recover the events list
			$scope.events = Event.query(
            	null,
            	function (eventList) {
            	},
            	function (error) {
                	alert(error.data.message);
            	}
    		);

			//funtion to delete an historical event of the array
			$scope.deleteContainerHistoricalEvent = function(divNameIn, index) {				
				var answer = confirm("Are you sure to delete this row?")

				if (answer)
				{
					$scope.eventsToPlot.splice((index-1), 1);
					$scope.rePlotGraph();
				}
			}
			
			
			
			$scope.name = 'Add an event';
      
    		$scope.showModal = function() {        
				//console.log("show modal");        
        		var s= document.getElementById("startDatePosX");
        		//console.log("s.value="+s.value);        
	    		dateRec = s.value;
    			//console.log("dateRec="+dateRec+"--now="+Date.now());
    			if (dateRec)
    			{
    				//dateRec = '2014-01-01';
    				//console.log("dateRec="+dateRec);
    				dateRec = dateRec.replace(/-/g,"/");
    				var res = dateRec.split("/");
    				var newDate = res[2]+"-"+res[0]+"-"+res[1];
    				//console.log("newDate="+newDate);
    				$scope.startDate = (newDate);
    			}
    			else
    			{
    				//$scope.startDate = $filter("date")(Date.now(), 'yyyy-MM-dd');	
    				$scope.startDate = "";
    			}

        		//$scope.startDate = '01-01-2011';
        		//$scope.startDate = s.value;

		        $scope.opts = {
        			backdrop: true,
        			backdropClick: false,
        			dialogFade: true,
        			keyboard: true,        
        			templateUrl : 'modules/visualization/partials/addEvent.html',
			        controller : 'ModalInstanceCtrl',
        			resolve: {}, // empty storage
        			scope: $scope
          		};

		        $scope.opts.resolve.item = function() {
            		return angular.copy({name:$scope.name, startDate:$scope.startDate}); // pass name to Dialog
        		}
        
          		var modalInstance = $modal.open($scope.opts);
          
          		modalInstance.result.then(function(){
	            	//on ok button press
    	        	//console.log('on ok button press');
        	    	//console.log($scope.eventsToPlot);
            		//console.log(modalInstance);
          			},function(){
            		//on cancel button press
            		//console.log("Modal Closed");
          			});
      		};  
      

			//funtion used in the select field. Onchenge value
			$scope.changeselectHE = function(idselected) 
			{
				//console.log("Factory. Id="+idselected);
				$scope.historicalevent_id = idselected['id'];
				$scope.historicalevent_title = idselected['title'];
				$scope.historicalevent_startDate = idselected['startEventDate'];
				$scope.historicalevent_endDate = idselected['endEventDate'];
				$scope.historicalevent_description = idselected['description'];
			};
	
	
			//funtion to add historical event to the array - uses in the modal window
			$scope.addAnotherHistoricalEvent = function(divName) {		
				var idRec = $scope.historicalevent_id;
				//console.log("idRec=>"+idRec);			
				var titleRec = $scope.historicalevent_title;	
				//console.log("titleRec=>"+titleRec);			
				var dateStartRec = $scope.historicalevent_startDate;
				//console.log("dateStartRec=>"+dateStartRec);			
				var dateEndRec = $scope.historicalevent_endDate;
				//console.log("dateEndRec=>"+dateEndRec);
			
				//var res = dateStartRec.split("-");
				var posI=0;
				if ($scope.idHE.length==0)
				{
					posI=1;
				}			
				else
				{
					posI=$scope.idHE.length;
				}
				//console.log("$scope.idHE.length="+$scope.idHE.length);
				$scope.idHE[posI] =idRec;
				$scope.titleHE[posI] =titleRec;
				$scope.startDateHE[posI] =dateStartRec;
				$scope.endDateHE[posI] =dateEndRec;
			
				$scope.descHE[posI] = $('#descriptionHEToAdd').val();
						
				var datosInT =  {
					id : idRec,
					title : titleRec,
					startDate : dateStartRec,
					endDate : dateEndRec,
					desc : $('#descriptionHEToAdd').val()
				}
	
				$scope.eventsToPlot.push(datosInT);			
			
				$scope.historicalevent_id = '';
				$scope.historicalevent_title = '';
				$scope.historicalevent_startDate = '';
				$scope.historicalevent_endDate = '';
				$scope.historicalevent_description = '';
			
				//console.log("list events");
				//console.log($scope.eventsToPlot);
				//rePlotGraph();
				
			};				

			
		$scope.rePlotGraph = function() {
			//console.log("----rePlotGraph---");
			var arrayJsonFiles = [];
			var datosTemporales = new Object();
			var elems = $scope.MetricSelectediId_;
			var elemsIndex = $scope.MetricSelectediIndex_;
		
    		var cntMetrics = 0;
    		var arrayJsonFiles = [];
    		var arrayKeys = [];
    		var arrayXAxis = [];
    		var arrayYAxis = [];
    		var arrayGrouping = [];
    
			for (i in elems) 
			{
				if (!isNaN(i))
				{
					if (elems[i]>0)
					{
						var jsonFile = elems[i];
						var jsonFileName = jsonFile;
						jsonFile = "json/"+jsonFile;
						var resIdMetric = elems[i];
						jsonFile = API_CONF.METRICS_MANAGER_URL + "/metrics/"+resIdMetric;

						if (jsonFile)
						{
							var str = elems[i];
							var puntero = elemsIndex[i];
							var res = $scope.MetricSelectorLabelColumn_[puntero];
							var valueXAxis = res;
							
							res = $scope.MetricSelectorDataColumn_[puntero];										
							var valueYAxis = res;
	
							res = $scope.MetricselectorGroupingData_[puntero];
							var valueGroup = res;

							if (valueGroup)
							{
								arrayKeys.push(jsonFileName);
								arrayXAxis.push(valueXAxis);
								arrayYAxis.push(valueYAxis);
								arrayGrouping.push(valueGroup);	
								arrayJsonFiles.push(jsonFile);
								cntMetrics = cntMetrics+1;
							}				

						}
						else {
							//console.log("jsonFile KO");
						}
					}
				}
			}

			var elemsHE_startDate = document.getElementsByName("startDateHE[]");
			var elemsHE_endDate = document.getElementsByName("endDateHE[]");
			var elemsHE_desc = document.getElementsByName("descHE[]");
			var elemsHE_title = document.getElementsByName("titleHE[]");

			var q = queue();
  			arrayJsonFiles.forEach(function(d,i) 
  			{
  				//console.log("-- arrayJsonFiles.forEach -- i="+i+".d="+d);
  				q = q.defer(d3.json, d);  		
	  		});

  			q.await($scope.plotGraph);
  		  			
		};


	
		$scope.plotGraph = function() {
	
			//console.log("#############");
			//console.log(arguments);
			//console.log("#############");
			var numbers1 = [];
			
			var cntNumbers =0;
			var control=0;
			if ($scope.metricsFilter.length==0)
			{
				control=0;
			}
			else {
				control=1;
			}
	
			if (control==1)
			{			
				for (var i=1; i<arguments.length; i++)
				{
					//console.log(".i="+i);
					//console.log(arguments)
					if (!isNaN(i)) 
					{
						//selectorLabel = document.getElementById("selectorLabelColumn_"+i).value;
						//selectorLabel = document.getElementById("MetricSelectorLabelColumn_"+arguments[i].id).value;
						selectorLabel = $scope.MetricSelectorLabelColumn_[arguments[i].id]
						
						
						//selectorLabel = $scope.MetricSelectorLabelColumn_[2];
						//console.log("selectorLabel "+i+"= "+selectorLabel)
						//selectorLabel = selectorLabel.toLowerCase();
					 	//selectorDataColumn = document.getElementById("selectorDataColumn_"+i).value;
					 	//selectorDataColumn = document.getElementById("MetricSelectorDataColumn_"+arguments[i].id).value;
					 	selectorDataColumn = $scope.MetricSelectorDataColumn_[arguments[i].id];
					 	
					 	//selectorDataColumn = $scope.MetricSelectorDataColumn_[2];
						//selectorDataColumn = selectorDataColumn.toLowerCase();
						//console.log("selectorLabel="+selectorLabel)
						//console.log("selectorDataColumn="+selectorDataColumn)					
						//console.log(arguments[i]['data']['table']);
	
						if (($scope.typeToPlot==='graph_line') || ($scope.typeToPlot==='graph_pie') || ($scope.typeToPlot==='graph_bars'))
						{
							//var arrayValues = [];
							//var arrayLabels = [];
							//var arrayValuesXY = [];
	
							var arrayValues = [];
							var arrayLabels  = [];
							var arrayValuesXY  = [];
	
							var numbers1T = {"Key":arguments[i].title};
							var cntPosArray=0;
							for (var j=0; j<arguments[i]['data']['table'].length; j++)
							{
								//console.log("..i="+i+"----j="+j);
								var object_size = 0;
								the_object = arguments[i]['data']['table'][j];
								var indexRow = "";
								for (key in the_object)	{
									//console.log("key=>"+key);
									if ((key!='from') && (key!='to') && (key!='value') && (key!='row'))
									{
										indexRow = arguments[i]['data']['table'][j][key];
									}
		    						if (the_object.hasOwnProperty(key)) {
		      							object_size++;
		    						}
		  						}
		  						
		  						if (indexRow=="")
		  						{
		  							indexRow = arguments[i].title;
		  						}
	
								if(typeof arrayValues[indexRow] == 'undefined') {
								    // does not exist
								    arrayValues[indexRow]= new Array();
								    arrayLabels[indexRow]= new Array();
								    arrayValuesXY[indexRow]= new Array();
								}
								else {
		    						// does exist
								}
	
								arrayValues[indexRow].push(arguments[i]['data']['table'][j][selectorDataColumn]);						
								arrayLabels[indexRow].push(arguments[i]['data']['table'][j][selectorLabel]);
								arrayValuesXY[indexRow].push(arguments[i]['data']['table'][j][selectorLabel]+"|"+arguments[i]['data']['table'][j][selectorDataColumn]);
								cntPosArray = cntPosArray +1;
	
							}

							the_object = arrayValues;
							
							for (key in the_object)	{
								//console.log("***key="+key);	
								if ($scope.typeToPlot==='graph_bars')
								{
									for (var j=0; j<arrayValues[key].length; j++)
									{
										var ObjectData = {
										'Category': "1", 
										'From':arrayValues[key][j], 
										'Key':key, 
										"To":arrayLabels[key][j], 
										"Value":arrayValues[key][j],
										"ValueX":arrayLabels[key][j],
										"ValueY":arrayValues[key][j], 
										"XY":arrayValuesXY[key][j]
										};
										numbers1.push(ObjectData);
									}
								}
								else
								{			
									var ObjectTemporal = new Object();			
									ObjectTemporal['Key']=key;
									ObjectTemporal['Values']=arrayValues[key];
									ObjectTemporal['Labels']=arrayLabels[key];
									ObjectTemporal['ValueX']=arrayLabels[key];
									ObjectTemporal['ValueY']=arrayValues[key];
									ObjectTemporal['XY']=arrayValuesXY[key];
									ObjectTemporal['Type']='metric';
									//console.log("ObjectTemporal="+ObjectTemporal);
									numbers1[cntNumbers]=ObjectTemporal;
									cntNumbers = cntNumbers+1;
								}
	
							}
	
	
						}
		        	}
		       }
	
			} // end if control==1
			document.getElementById("container_graph").innerHTML = "";
			//var numbers1 = [];
	        		 
			//console.log("######plotGraph########");
			//console.log("typeToPlot="+$scope.typeToPlot);
			if ($scope.typeToPlot==='map_1')
			{
				document.getElementById("container_graph").innerHTML = "";
	
				var mapObj = policycompass.viz.mapW(
				{
					'idName':"container_graph",
					'width': 800,
					'height':400
				})
	
			}
			else if ($scope.typeToPlot==='graph_line')
			{
	
				document.getElementById("container_graph").innerHTML = "";
	                	
				if (numbers1)
				{
					var margin = {top: 20, right: 80, bottom: 50, left: 50},
					width = 700,
					height = 200;
					var barLine = policycompass.viz.line(
						{
	                		'idName':"container_graph",
	                		'width': width,
	                		'height': height,
	                		'margin': margin,
	                		'labelX': "label X",
	                		'labelY': "label Y",
	                		'radius': 4,
							'showYAxesTogether': document.getElementById("showYAxes").checked,
	                		'showLegend': document.getElementById("showLegend").checked,
							'showLines': document.getElementById("showLines").checked,
							'showPoints': document.getElementById("showPoints").checked,
							'showLabels': document.getElementById("showLabels").checked,
							'showGrid': document.getElementById("showGrid").checked
							//'arrayKeys': arrayKeys,
							//'arrayXAxis': arrayXAxis,
							//'arrayYAxis': arrayYAxis,
							//'arrayGrouping': arrayGrouping
						});
	                
	                if (numbers1.length>0)
	                {
	                	barLine.render(numbers1, $scope.eventsToPlot);
	                }
					
				}
			}				
			else if ($scope.typeToPlot==='graph_pie')
			{
	
				var dataset = numbers1;
	
	
				var width = 600,
				height = 400,
				//radius = Math.min(width, height) / 2;
				radius = 200;
	
				dataset.forEach(function(d,i) {						
					document.getElementById("container_graph").innerHTML = document.getElementById("container_graph").innerHTML + "<div class='pie' id='pie_"+i+"'></div>"
					//datasetToSend = d.values;
					var datasetToSend = d;
					var pieObj = policycompass.viz.pie(
					{
						'idName':"pie_"+i,
						'width': width,
						'height':height,
						'margin': 20,
						'radius':radius,
						'showLegend': document.getElementById("showLegend").checked,
						'showLines': document.getElementById("showLines").checked,
						'showPoints': document.getElementById("showPoints").checked,
						'showLabels': document.getElementById("showLabels").checked,
						'showGrid': document.getElementById("showGrid").checked
						//'arrayKeys': arrayKeys,
						//'arrayXAxis': arrayXAxis,
						//'arrayYAxis': arrayYAxis,
						//'arrayGrouping': arrayGrouping
					});
	
		        	pieObj.render(datasetToSend);
	
	
				});
	
			} 
			else if ($scope.typeToPlot==='graph_bars')
			{
				document.getElementById("container_graph").innerHTML = "";
		
				var datasetToSend = numbers1;
	
				//console.log(datasetToSend);
	        			
				var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    		width = 400 - margin.left - margin.right,
	    		height = 300 - margin.top - margin.bottom;
	
				var barObj = policycompass.viz.barsMultiple(
				{
	                'idName':"container_graph",
	            	'width': width,
	            	'height':height,
	            	'margin': margin,
	            	'labelX': "label X",
	            	'labelY': "label Y",
	            	'radius': 4,
	            	'showLegend': document.getElementById("showLegend").checked,
					'showLines': document.getElementById("showLines").checked,
					'showPoints': document.getElementById("showPoints").checked,
					'showLabels': document.getElementById("showLabels").checked,
					'showGrid': document.getElementById("showGrid").checked
					//'arrayKeys': arrayKeys,
					//'arrayXAxis': arrayXAxis,
					//'arrayYAxis': arrayYAxis,
					//'arrayGrouping': arrayGrouping
	            });
				//console.log("----------------->>>>>datasetToSend");
				//console.log(datasetToSend.length);
				
				if (datasetToSend.length>0)
				{
					var eventsArray = [];
					//barObj.render(datasetToSend, $scope.eventsToPlot);
					barObj.render(datasetToSend, eventsArray);
				}
			}
	
	
		};
    	
    	}
    	
    }
}])


.controller('VisualizationsDetailController', [
	'$scope', 
	'$routeParams', 
	'$location', 
	'Visualization', 
	function($scope, $routeParams, $location, Visualization) {
	
	//this.message = "Hello VisualizationsDetailController";
	//alert("Hello VisualizationsDetailController");
	//alert($routeParams.visualizationId);
    $scope.test = "hallo---";
	$scope.visualization = Visualization.get({id: $routeParams.visualizationId},
			function(visualizationList) {
			},
			function(error) {
				alert(error.data.message);
			}
	);

    $scope.deleteVisualization = function(visualization) {
        visualization.$delete(
            {},
            function(){
                $location.path('/visualizations');
            }
        );
    };


}])

//controler to list visualizations
.controller('VisualizationsController', [
	'$scope', 
	'Visualization', 
	'$log', 
	function($scope, Visualization, $log) {
	
	//$log.info("Test VisualizationsController..");
	$scope.visualizations = Visualization.query(
			null,
			function(visualizationList) {
			//function(metricList) {				
				//$log.info(visualizationList);
			},
			function(error) {
				alert(error.data.message);
			}
	);

}])

//controler to view the detail of a visualization
.controller('VisualizationDetailController', [
	'$scope', 
	'$routeParams', 
	'$location', 
	'Visualization', 
	function($scope, $routeParams, $location, Visualization) {
	
	//this.message = "test visu";
    //$scope.test = "test visu";
    
	$scope.visualization = Visualization.get({id: $routeParams.visualizationId},
			function(visualizationList) {
			},
			function(error) {
				alert(error.data.message);
			}
	);

    $scope.deleteVisualization = function(visualization) {
        visualization.$delete(
            {},
            function(){
                $location.path('/visualization');
            }
        );
    };


}])


.controller('VisualizationsEditController', [
	'$scope', 
	'$route',
	'$routeParams',
	'$modal', 
	'Event', 
	'Metric', 
	'Visualization', 
	'$location', 
	'helper',
	'$log', 
	'API_CONF',
	function($scope, $route, $routeParams, $modal, Event, Metric, Visualization, $location, helper, $log, API_CONF) {

	//console.log("controller VisualizationsEditController");
	$scope.mode = "edit";
	
	//funtion to reset form
	
	$scope.resetlocation = '/visualizations/'+$routeParams.visualizationId+'/edit/';
	
	helper.baseVisualizationsCreateController($scope, $route, $routeParams, $modal, Event, Metric, Visualization, $location, helper, $log, API_CONF);
	

	$scope.visualization = Visualization.get({id: $routeParams.visualizationId},
        function(visualization) {
        },
        function(error) {
            alert(error.data.message);
        }
    );
    
	$scope.visualization.$promise.then(function(metric){
            $scope.visualization.language = $scope.visualization.language_id;

    });
        
	$scope.tabParent = 2;
	$scope.tabSon = 'graph_line';
	$scope.typeToPlot= 'graph_line';


	$scope.ListMetricsFilter = [];
	$scope.metricsFilter = $scope.ListMetricsFilter;
	
	
	
	$scope.eventsToPlot = [];
	
	var datosInT =  {
				id : 1,
				title : 'test',
				startDate : '2014-06-30T22:00:00Z',
				endDate : '2014-07-02T22:00:00Z',
				desc : 'hooola'
			}
	
	$scope.eventsToPlot.push(datosInT);		
	
	
	$scope.MetricSelectediId_ = [];
	$scope.MetricSelectediIndex_ = [];
	$scope.MetricSelectorLabelColumn_ = [];
	$scope.MetricSelectorDataColumn_ = [];
	$scope.MetricselectorGroupingData_ = [];
	$scope.idHE = [];
	$scope.titleHE = [];
	$scope.startDateHE = [];
	$scope.endDateHE = [];
	$scope.descHE = [];	
	

	$scope.MetricSelectediId_[1]=1;
	$scope.MetricSelectediIndex_[1]=1;
	$scope.MetricSelectorLabelColumn_[1]='to';
	$scope.MetricSelectorDataColumn_[1] ='value';
	$scope.MetricselectorGroupingData_[1] = 'grouping column';

	selectedText = " ";
	var myObject = {
		'id':1,
		'name':'test',
		'column':'to',
		'value':'value',
		'group':'grouping column'
	};
		
	//console.log("a1");					
	$scope.ListMetricsFilter.push(myObject);	
		

	//$scope.plotGraph();
	$scope.rePlotGraph();
			
}])



//controler to create a new visualization
.controller('VisualizationsCreateController', [
	'$scope', 
	'$route',
	'$routeParams',
	'$modal', 
	'Event', 
	'Metric', 
	'Visualization', 
	'$location', 
	'helper',
	'$log', 
	'API_CONF',
function($scope, $route, $routeParams, $modal, Event, Metric, Visualization, $location, helper, $log, API_CONF) {
	console.log('VisualizationsCreateController');
	$scope.mode = "create";
	$scope.resetlocation = "/visualizations/create/";
	
	helper.baseVisualizationsCreateController($scope, $route, $routeParams, $modal, Event, Metric, Visualization, $location, helper, $log, API_CONF);
	
	$scope.tabParent = 0;
	$scope.tabSon = 0;


	$scope.eventsToPlot = [];		
		
	
	$scope.MetricSelectediId_ = [];
	$scope.MetricSelectediIndex_ = [];
	$scope.MetricSelectorLabelColumn_ = [];
	$scope.MetricSelectorDataColumn_ = [];
	$scope.MetricselectorGroupingData_ = [];
	$scope.idHE = [];
	$scope.titleHE = [];
	$scope.startDateHE = [];
	$scope.endDateHE = [];
	$scope.descHE = [];
	
	$scope.visualization = {};

	this.historicalevent_he_id = '';
	this.historicalevent_he_title = '';
	this.historicalevent_he_startdate = '';
	this.historicalevent_he_enddate = '';
	this.historicalevent_he_description = '';
	
	$scope.createVisualization = function() {
        $scope.visualization.user_id = 1;        				     
        $scope.visualization.views_count = 0;
        $scope.visualization.visualization_type_id = 1;
        $scope.visualization.status_flag_id = 0;

    	
        var dataConfig = [];
        dataConfig['graphSelected'] = $scope.typeToPlot;
        dataConfig['showLegend'] = $scope.showLegend;
        dataConfig['showLines'] = $scope.showLines;
        dataConfig['showPoints'] = $scope.showPoints;
        dataConfig['showLabels'] = $scope.showLabels;
        dataConfig['showGrid'] = $scope.showGrid;
        dataConfig['showYAxesTogether'] = $scope.showYAxesTogether;
        
        var dataMetrics = [];
        
		for (i in $scope.MetricSelectediIndex_)
		{
			//console.log("i="+i+"---$scope.MetricSelectediIndex_["+i+"]="+$scope.MetricSelectediIndex_[i])
			if (!isNaN($scope.MetricSelectediId_[i]))
			{
				console.log("$scope.MetricSelectediId_["+i+"]="+$scope.MetricSelectediId_[i]);
				var myindex = $scope.MetricSelectediIndex_[i];
				//console.log("myindex="+myindex);				
				var selectorLabel = $scope.MetricSelectorLabelColumn_[myindex];
				//console.log("selectorLabel="+selectorLabel);
				var selectorDataColumn = $scope.MetricSelectorDataColumn_[myindex];
				//console.log("selectorDataColumn="+selectorDataColumn);
				var selectorGroupingData = $scope.MetricselectorGroupingData_[myindex];
				//console.log("selectorGroupingData="+selectorGroupingData);										
				var visualization_query_data = 'Label:'+selectorLabel+',Column:'+selectorDataColumn+',Grouping:'+selectorGroupingData;
				//console.log("visualization_query_data="+visualization_query_data);
				
				var rowMetric = {
                    metric: $scope.MetricSelectediId_[i],
                    visualization_query: visualization_query_data
                	};
             	
             	dataMetrics.push(rowMetric);   				
			}
		}
        
        var dataHE = [];
        
        for (i in $scope.idHE)
        {
			if (!isNaN($scope.idHE[i]))
			{
				var rowHE = {
                    historical_event: $scope.idHE[i],
                    description: $scope.descHE[i]
                };
				dataHE.push(rowHE);
			}
        }
               
        $scope.visualization.configdata = {
            dataConfig: dataConfig,
            dataMetrics: dataMetrics,
            dataHE: dataHE
        };

        var data = [];
        var extra = [];
		$scope.visualization.data = {
            table: data,
            extra_columns: extra,
            dataConfig: dataConfig,
            dataMetrics: dataMetrics,
            dataHE: dataHE
        };

		//console.log("------------------");
		//console.log($scope.visualization);
		//console.log("------------------");
		
		Visualization.save($scope.visualization,function(value, responseHeaders){
			$location.path('/visualizations/' + value.id);
		},
		function(err) {
            throw { message: err.data};
		}

		);

	};

	$scope.ListMetricsFilter = [];
	$scope.metricsFilter = $scope.ListMetricsFilter;


}])


.controller('ModalInstanceCtrl', [
	'$scope', 
	'$modalInstance', 
	'$modal', 
	'item',
	function($scope, $modalInstance, $modal, item) {
    
	$scope.item = item;
      
	$scope.ok = function () {
		$modalInstance.close();
	};
      
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}])
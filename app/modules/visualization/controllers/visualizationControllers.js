angular.module('pcApp.visualization.controllers.visualization', [
    'pcApp.visualization.services.visualization',
    'pcApp.references.services.reference',
    'pcApp.config'
])



.factory('VisualizationsControllerHelper', [function() {
    return {
    	
    	baseVisualizationsCreateController: function($scope, $route, $routeParams, $modal, Event, Metric, Visualization, $location, helper, $log, API_CONF) {



		tooltip =  d3.select("body").append("div")
    		.attr("id","tooltip")
    		.html("")
    		.attr("class", "tooltip")
    		.style("opacity", 0);

		mousemove = function() 
		{
			//	console.log(d3.event.pageX);
			tooltip
				.style("left", (d3.event.pageX +20) + "px")
				.style("top", (d3.event.pageY - 12) + "px");
		};     

    	
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
    	
    			//var containerId = document.getElementById("MetricSelectediId_"+idMetric).value;	
    			//var containerIndex = document.getElementById("MetricSelectediIndex_"+idMetric).value;
				var containerId = idMetric;
				var containerIndex = idMetric;
				
				$scope.MetricSelectediId_[idMetric]=idMetric;
				$scope.MetricSelectediIndex_[idMetric]=idMetric;

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
				
				$scope.correctmetrics = 1;
						
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
					
					
					var cntMetricsInArray=0;
					
					for (x=0;x<$scope.MetricSelectediId_.length; x++) {
						//console.log("x="+x);
						
						
						if (!isNaN($scope.MetricSelectediId_[x]) && ($scope.MetricSelectediId_[x]!=""))
						{
							cntMetricsInArray = cntMetricsInArray+1;
							console.log("$scope.MetricSelectediId_[x]="+$scope.MetricSelectediId_[x]);
						}
						
						
					}
					//console.log("cntMetricsInArray="+cntMetricsInArray);
					
					if (cntMetricsInArray==0)
					{
						$scope.correctmetrics = "";
					}
					
					$scope.rePlotGraph();
					
				}		
			};

			//funtion used to recover the metrics list
			/*
			$scope.metrics = Metric.query(
				null,				
				function(metricList) {
					console.log("--metricList---dins");
				},
				function(error) {
					alert(error.data.message);
				}
			);
			*/
			$scope.metrics = Metric.query(
            	{page: $routeParams.page},
				function(metricList) {
				},
				function(error) {
                	throw { message: JSON.stringify(err.data)};
				}
			);
			
			//funtion used to recover the events list
			$scope.events = Event.query(
            	null,
            	function (eventList) {
            	},
            	function (error) {
                	//alert(error.data.message);
                	throw { message: JSON.stringify(error.data.message)};
            	}
    		);

			//funtion to delete an historical event of the array
			$scope.deleteContainerHistoricalEvent = function(divNameIn, index) {				
				var answer = confirm("Are you sure to delete this row?")

				if (answer)
				{				
					$scope.idHE.splice((index), 1);
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
			//console.log("--rePlotGraph--");
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
						//console.log("jsonFile="+jsonFile);
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
			
			var elemsHE_startDate = "";
			var elemsHE_endDate = "";
			var elemsHE_desc = "";
			var elemsHE_title = "";
			
			var element = document.getElementsByName('startDateHE[]');
	 		if (element != null) {
	 			elemsHE_startDate = document.getElementsByName("startDateHE[]");
	 		}		

			var element = document.getElementsByName('endDateHE[]');
	 		if (element != null) {
	 			elemsHE_endDate = document.getElementsByName("endDateHE[]");	
	 		}			
			
			var element = document.getElementsByName('descHE[]');
	 		if (element != null) {
	 			elemsHE_desc = document.getElementsByName("descHE[]");	
	 		}			

			var element = document.getElementsByName('titleHE[]');
	 		if (element != null) {
	 			elemsHE_title = document.getElementsByName("titleHE[]");	
	 		}
			
			
			//console.log("arrayJsonFiles="+arrayJsonFiles)
			//var q = queue();

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
			
				var element = document.getElementById('showYAxes');
	 			//if (typeof (element) != undefined && typeof (element) != null && typeof (element) != 'undefined') {
	 			if (element != null) {
	     			$scope.showYAxes = document.getElementById("showYAxes").checked;
	 			}

				var element = document.getElementById('showLegend');
	 			if (element != null) {
	     			$scope.showLegend = document.getElementById("showLegend").checked;
	 			}
				
				var element = document.getElementById('showLines');
	 			if (element != null) {
	     			$scope.showLines = document.getElementById("showLines").checked;
	 			}

				var element = document.getElementById('showPoints');
	 			if (element != null) {
	     			$scope.showPoints = document.getElementById("showPoints").checked;
	 			}				
				
				var element = document.getElementById('showLabels');
	 			if (element != null) {
	     			$scope.showLabels = document.getElementById("showLabels").checked;
	 			}	
	 							
				var element = document.getElementById('showGrid');
	 			if (element != null) {
	     			$scope.showGrid = document.getElementById("showGrid").checked;
	 			}	
	 							
				
			
			
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
					//width = 700,
					width = 980,
					//height = 200;
					height = 326;
					var barLine = policycompass.viz.line(
						{
	                		'idName':"container_graph",
	                		'width': width,
	                		'height': height,
	                		'margin': margin,
	                		'labelX': "label X",
	                		'labelY': "label Y",
	                		'radius': 4,
	                		'distanceXaxes': 45,
							//'showYAxesTogether': document.getElementById("showYAxes").checked,
							//'showLegend': document.getElementById("showLegend").checked,
							//'showLines': document.getElementById("showLines").checked,
							//'showPoints': document.getElementById("showPoints").checked,
							//'showLabels': document.getElementById("showLabels").checked,
							//'showGrid': document.getElementById("showGrid").checked
							'showYAxesTogether': $scope.showYAxes,	                		
	                		'showLegend': $scope.showLegend,							
							'showLines': $scope.showLines,							
							'showPoints': $scope.showPoints,							
							'showLabels': $scope.showLabels,							
							'showGrid': $scope.showGrid
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
	
	
				//var width = 600,
				var width = 980,
				height = 400,
				//radius = Math.min(width, height) / 2;
				radius = 200;
				var cntPies = 0;
				dataset.forEach(function(d,i) {
					//console.log("1er foreach i="+i);
					document.getElementById("container_graph").innerHTML = document.getElementById("container_graph").innerHTML + "<div class='pie' id='pie_"+i+"'></div>"
				
				});
				
				dataset.forEach(function(d,i) {
					//console.log("2n foreach i="+i);
					
					//datasetToSend = d.values;
					//if (cntPies>0)
					if (1==1)
					{
						
						
						var datasetToSend = d;
						var pieObj = policycompass.viz.pie(
						{
							'idName':"pie_"+i,
							'idPie': cntPies,
							'width': width,
							'height':height,
							'margin': 20,
							'radius':radius,
							'innerRadious': 50,
							//'showLegend': document.getElementById("showLegend").checked,
							//'showLines': document.getElementById("showLines").checked,
							//'showPoints': document.getElementById("showPoints").checked,
							//'showLabels': document.getElementById("showLabels").checked,
							//'showGrid': document.getElementById("showGrid").checked
							'showLegend': $scope.showLegend,
							'showLines': $scope.showLines,
							'showPoints': $scope.showPoints,
							'showLabels': $scope.showLabels,
							'showGrid': $scope.showGrid
							//'arrayKeys': arrayKeys,
							//'arrayXAxis': arrayXAxis,
							//'arrayYAxis': arrayYAxis,
							//'arrayGrouping': arrayGrouping
						});
		
			        	pieObj.render(datasetToSend);
					}
					
					cntPies = cntPies +1;
	
				});
	
			} 
			else if ($scope.typeToPlot==='graph_bars')
			{
				document.getElementById("container_graph").innerHTML = "";
		
				var datasetToSend = numbers1;
	
				//console.log(datasetToSend);
	        			
				var margin = {top: 20, right: 20, bottom: 30, left: 40};
				var width = 980 - margin.left - margin.right;
	    		//var width = 400 - margin.left - margin.right;
	    		var height = 300 - margin.top - margin.bottom;
	
				var barObj = policycompass.viz.barsMultiple(
				{
	                'idName':"container_graph",
	            	'width': width,
	            	'height':height,
	            	'margin': margin,
	            	//'labelX': "label X",
	            	//'labelY': "label Y",
	            	'labelX': "",
	            	'labelY': "",
	            	'radius': 4,
	            	//'showLegend': document.getElementById("showLegend").checked,
					//'showLines': document.getElementById("showLines").checked,
					//'showPoints': document.getElementById("showPoints").checked,
					//'showLabels': document.getElementById("showLabels").checked,
					//'showGrid': document.getElementById("showGrid").checked
	            	'showLegend': $scope.showLegend,
					'showLines': $scope.showLines,
					'showPoints': $scope.showPoints,
					'showLabels': $scope.showLabels,
					'showGrid': $scope.showGrid
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
    //$scope.test = "hallo---";
	$scope.visualization = Visualization.get({id: $routeParams.visualizationId},
			function(visualizationList) {
			},
			function(error) {
				//alert(error.data.message);
				throw { message: JSON.stringify(error.data.message)};
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
	'$routeParams',
	function($scope, Visualization, $log, $routeParams) {
	
		//console.log("VisualizationsController");	
		$scope.visualizations = Visualization.query(
			 {page: $routeParams.page},
			function(visualizationList) {
			},
			function(error) {
				//alert(error.data.message);
				throw { message: JSON.stringify(error.data.message)};
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
				//alert(error.data.message);
				throw { message: JSON.stringify(error.data.message)};
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
	'VisualizationsControllerHelper',
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
            //alert(error.data.message);
            throw { message: JSON.stringify(error.data.message)};
        }
    );
    
    
	$scope.visualization.$promise.then(function(metric){
			//console.log("DINS")
            $scope.visualization.language = $scope.visualization.language.id;
			
    		var configurationFilter = $scope.visualization.filter_configuration;
    		var arrayConfigFilter = configurationFilter.split(",");
    		
    		for (x=0;x<arrayConfigFilter.length;x++)
    		{
    			var dataFilter = arrayConfigFilter[x].split("=");
    			if (dataFilter[0]=='graphSelected')
    			{
    				//$scope.tabParent = 2;
					//$scope.tabSon = 'graph_line';
					//$scope.typeToPlot= 'graph_line';
    				$scope.tabParent = 2;
					$scope.tabSon = dataFilter[1];
					$scope.typeToPlot = dataFilter[1];
					
    			}
    			else
    			{
    				eval("$scope."+dataFilter[0]+"="+dataFilter[1]);
    			}
    		}
    		
    		//console.log("$scope.visualization.historical_events_in_visualization")
    		//console.log($scope.visualization.historical_events_in_visualization)
    		$scope.idHE = [];
			$scope.titleHE = [];
			$scope.startDateHE = [];
			$scope.endDateHE = [];
			$scope.descHE = [];	
			
   			$scope.eventsToPlot = [];
			
			for (i in $scope.visualization.historical_events_in_visualization)
			{
				//console.log($scope.visualization.historical_events_in_visualization[i])
				$scope.idHE[(parseInt(i)+1)]=$scope.visualization.historical_events_in_visualization[i].id;
				$scope.titleHE[(parseInt(i)+1)]=$scope.visualization.historical_events_in_visualization[i].title;
				$scope.startDateHE[(parseInt(i)+1)] = $scope.visualization.historical_events_in_visualization[i].startEventDate;
				$scope.endDateHE[(parseInt(i)+1)] = $scope.visualization.historical_events_in_visualization[i].endEventDate;
				$scope.descHE[(parseInt(i)+1)] = $scope.visualization.historical_events_in_visualization[i].descriptionHE
			
				var datosInT =  {
					id : $scope.visualization.historical_events_in_visualization[i].id,
					title : $scope.visualization.historical_events_in_visualization[i].title,
					startDate : $scope.visualization.historical_events_in_visualization[i].startEventDate,
					endDate : $scope.visualization.historical_events_in_visualization[i].endEventDate,
					desc :  $scope.visualization.historical_events_in_visualization[i].descriptionHE
				}
				
				$scope.eventsToPlot.push(datosInT);				
			}
						
			//console.log("$scope.visualization.metrics_in_visualization")
    		//console.log($scope.visualization.metrics_in_visualization)

			$scope.ListMetricsFilter = [];
			$scope.metricsFilter = $scope.ListMetricsFilter;
	
			$scope.MetricSelectediId_ = [];
			$scope.MetricSelectediIndex_ = [];
			$scope.MetricSelectorLabelColumn_ = [];
			$scope.MetricSelectorDataColumn_ = [];
			$scope.MetricselectorGroupingData_ = [];
	
			
    	
			for (i in $scope.visualization.metrics_in_visualization)
			{
				//console.log("metrics_in_visualization i="+i);
				
				var id = $scope.visualization.metrics_in_visualization[i].id;
				//console.log("------------->id="+id);
				
				
				$scope.MetricSelectediId_[id]=id;
				//$scope.MetricSelectediIndex_[id]=(parseInt(i)+1);
				
				$scope.MetricSelectediIndex_[id]=id;
				//console.log('visualization_query');
				//console.log($scope.visualization.metrics_in_visualization[i].visualization_query);
				

				var configurationMetricsFilters = $scope.visualization.metrics_in_visualization[i].visualization_query;
    			//console.log(configurationMetricsFilters)
    			var arrayConfigMetricsFilters = configurationMetricsFilters.split(",");
    		
	    		for (x=0;x<arrayConfigMetricsFilters.length;x++)
	    		{
	    			//console.log("x="+x);
	    			var dataFilter = arrayConfigMetricsFilters[x].split(":");
	    			//console.log("dataFilter[0]="+dataFilter[0])
	    			//console.log("dataFilter[1]="+dataFilter[1])
	    			if (dataFilter[0]=='Label')
	    			{
	    				$scope.MetricSelectorLabelColumn_[id] = dataFilter[1];
	    			}
	    			else if (dataFilter[0]=='Column')
	    			{
	    				$scope.MetricSelectorDataColumn_[id] = dataFilter[1];
	    			}
	    			else if (dataFilter[0]=='Grouping')
	    			{
	    				$scope.MetricselectorGroupingData_[id] = dataFilter[1];
	    			}
	    		}
				
				
				//$scope.MetricSelectorLabelColumn_[id]='from';
				//$scope.MetricSelectorDataColumn_[id] ='value';
				//$scope.MetricselectorGroupingData_[id] = 'grouping column';

				selectedText = " ";
				var myObject = {
					'id': $scope.MetricSelectediId_[id],
					'name': $scope.visualization.metrics_in_visualization[i].title,
					'column': $scope.MetricSelectorLabelColumn_[id],
					'value': $scope.MetricSelectorDataColumn_[id],
					'group': $scope.MetricselectorGroupingData_[id]				
				};
				//console.log(myObject);	
				$scope.ListMetricsFilter.push(myObject);
				$scope.correctmetrics = "1";
				//console.log($scope.ListMetricsFilter);
			}
				
			//console.log(".....");
			$scope.rePlotGraph();
    
    });
    
	


	$scope.createVisualization = function() {
        $scope.visualization.user_id = 1;        				     
        $scope.visualization.views_count = 0;
        $scope.visualization.visualization_type_id = 1;
        $scope.visualization.status_flag_id = 0;
		
		//$scope.showLegend = document.getElementById("showLegend").checked;
    	//$scope.showLines = document.getElementById("showLines").checked;    	
    	//$scope.showPoints = document.getElementById("showPoints").checked;
    	//$scope.showLabels = document.getElementById("showLabels").checked;  	
    	//$scope.showGrid = document.getElementById("showGrid").checked;    	
    	//$scope.showYAxes = document.getElementById("showYAxes").checked;
    	
        var dataConfig = [];
        dataConfig['graphSelected'] = $scope.typeToPlot;
        dataConfig['showLegend'] = $scope.showLegend;
        dataConfig['showLines'] = $scope.showLines;
        dataConfig['showPoints'] = $scope.showPoints;
        dataConfig['showLabels'] = $scope.showLabels;
        dataConfig['showGrid'] = $scope.showGrid;
        dataConfig['showYAxes'] = $scope.showYAxes;
               
        
        var dataMetrics = [];
        
		for (i in $scope.MetricSelectediIndex_)
		{
			//console.log("i="+i+"---$scope.MetricSelectediIndex_["+i+"]="+$scope.MetricSelectediIndex_[i])
			//console.log("MetricSelectediIndex_ i="+i);
			if (!isNaN($scope.MetricSelectediId_[i]))
			{
				//console.log("$scope.MetricSelectediId_["+i+"]="+$scope.MetricSelectediId_[i]);
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
          
        //$scope.visualization.configdata = {
        //    dataConfig: dataConfig,
        //    dataMetrics: dataMetrics,
        //    dataHE: dataHE
        //};
		
        //var data = [];
        //var extra = [];
        /*
		$scope.visualization.data = {
            table: data,
            extra_columns: extra,
            dataConfig: dataConfig,
            dataMetrics: dataMetrics,
            dataHE: dataHE
        };
		*/
		var string_filter_configuration = "";
		for (key in dataConfig) {
			if (!string_filter_configuration=="")
			{
				string_filter_configuration = string_filter_configuration + ",";
			}
			string_filter_configuration = string_filter_configuration + key +"="+dataConfig[key];
		}
		
		//console.log("string_filter_configuration="+string_filter_configuration);
		
		
		$scope.visualization.filter_configuration = string_filter_configuration;
		if (dataHE.length>0)
		{			
			$scope.visualization.historical_events_in_visualization = dataHE;
		}	
		else
		{
			var rowHE = {
                    historical_event: "",
                    description: ""
            };
			dataHE.push(rowHE);
		
			$scope.visualization.historical_events_in_visualization = dataHE;
		}
		
		//console.log($scope.visualization.historical_events_in_visualization);
		$scope.visualization.metrics_in_visualization = dataMetrics;
		
		
		//console.log("------------------");
		//console.log($scope.visualization);
		//console.log("------------------");
		
		Visualization.update($scope.visualization,function(value, responseHeaders){
			$location.path('/visualizations/' + value.id);
		},
		function(err) {
            throw { message: err.data};
		}

		);

	};

	
	
	
	
	/*
	$scope.eventsToPlot = [];
	
	var datosInT =  {
				id : 1,
				title : 'test',
				startDate : '2014-06-30T22:00:00Z',
				endDate : '2014-07-02T22:00:00Z',
				desc : 'hooola'
			}
	
	$scope.eventsToPlot.push(datosInT);		
	*/
/*	
	$scope.ListMetricsFilter = [];
	$scope.metricsFilter = $scope.ListMetricsFilter;
	
	$scope.MetricSelectediId_ = [];
	$scope.MetricSelectediIndex_ = [];
	$scope.MetricSelectorLabelColumn_ = [];
	$scope.MetricSelectorDataColumn_ = [];
	$scope.MetricselectorGroupingData_ = [];
	*/
	/*
	$scope.idHE = [];
	$scope.titleHE = [];
	$scope.startDateHE = [];
	$scope.endDateHE = [];
	$scope.descHE = [];
	*/	
/*
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
	*/

	
	//$scope.rePlotGraph();
			
}])


//controler to view a graph
.controller('VisualizationsGraphController', [
	'$scope', 
	'$route',
	'$routeParams',
	'$modal', 
	'Event', 
	'Metric', 
	'Visualization', 
	'$location', 
	'VisualizationsControllerHelper',
	'$log', 
	'API_CONF',
function($scope, $route, $routeParams, $modal, Event, Metric, Visualization, $location, helper, $log, API_CONF) {
	
	console.log('VisualizationsGraphController');
	//this.message = "Hello VisualizationsDetailController";
	//alert("Hello VisualizationsDetailController");
	//alert($routeParams.visualizationId);
    //$scope.test = "hallo---";
/*    
    $scope.onLoadGraph = function(idVal) {
    	console.log('onLoadGraph() idVal='+idVal);
    	//$routeParams.visualizationId = idVal;    	
	}
*/
    
    
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
	'VisualizationsControllerHelper',
	'$log', 
	'API_CONF',
function($scope, $route, $routeParams, $modal, Event, Metric, Visualization, $location, helper, $log, API_CONF) {
	
	//console.log('VisualizationsCreateController');
	
	$scope.mode = "create";
	$scope.resetlocation = "/visualizations/create/";


	angular.element(document).ready(function () {
        //console.log('Hello World 1');
    });
    
	helper.baseVisualizationsCreateController($scope, $route, $routeParams, $modal, Event, Metric, Visualization, $location, helper, $log, API_CONF);
	
	//$scope.tabParent = 0;
	//$scope.tabSon = 0;
	
	$scope.tabParent = 2;
	$scope.tabSon = 'graph_line';
	$scope.typeToPlot= 'graph_line';


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
	
	//filters
	$scope.showLegend = true;
	$scope.showLines = true;
	$scope.showPoints = true;
	$scope.showLabels = true;
	$scope.showGrid = true;
	$scope.showYAxes = true;
	
	
	$scope.visualization = {};

	this.historicalevent_he_id = '';
	this.historicalevent_he_title = '';
	this.historicalevent_he_startdate = '';
	this.historicalevent_he_enddate = '';
	this.historicalevent_he_description = '';


    var metricsURL = $routeParams.metrics;
    //console.log("metricsURL="+metricsURL);
    if (metricsURL)
    {
    	var arrayMetricsURL = metricsURL.split(",");    		
    	for (x=0;x<arrayMetricsURL.length;x++)
    	{
    		//console.log("arrayMetricsURL[x]="+arrayMetricsURL[x])
    		$scope.metric = Metric.get({id: arrayMetricsURL[x]},
            function(metric) {
            	//console.log("pppppppppppppppp");
            	$scope.addFilterMetric(metric.id);            	
            	//$scope.rePlotGraph();
            },
            function(err) {
                throw { message: JSON.stringify(err.data)};
            }
        	);
    	}    	
    }


	
	$scope.createVisualization = function() {
        $scope.visualization.user_id = 1;        				     
        $scope.visualization.views_count = 0;
        $scope.visualization.visualization_type_id = 1;
        $scope.visualization.status_flag_id = 0;
		
		//$scope.showLegend = document.getElementById("showLegend").checked;
    	//$scope.showLines = document.getElementById("showLines").checked;    	
    	//$scope.showPoints = document.getElementById("showPoints").checked;
    	//$scope.showLabels = document.getElementById("showLabels").checked;  	
    	//$scope.showGrid = document.getElementById("showGrid").checked;    	
    	//$scope.showYAxes = document.getElementById("showYAxes").checked;
    	
    	
        var dataConfig = [];
        dataConfig['graphSelected'] = $scope.typeToPlot;
        dataConfig['showLegend'] = $scope.showLegend;
        dataConfig['showLines'] = $scope.showLines;
        dataConfig['showPoints'] = $scope.showPoints;
        dataConfig['showLabels'] = $scope.showLabels;
        dataConfig['showGrid'] = $scope.showGrid;
        dataConfig['showYAxes'] = $scope.showYAxes;
               
        
        var dataMetrics = [];
        
		for (i in $scope.MetricSelectediIndex_)
		{
			//console.log("i="+i+"---$scope.MetricSelectediIndex_["+i+"]="+$scope.MetricSelectediIndex_[i])
			//console.log("i="+i);
			if (!isNaN($scope.MetricSelectediId_[i]))
			{
				//console.log("$scope.MetricSelectediId_["+i+"]="+$scope.MetricSelectediId_[i]);
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
          
        //$scope.visualization.configdata = {
        //    dataConfig: dataConfig,
        //    dataMetrics: dataMetrics,
        //    dataHE: dataHE
        //};
		
        var data = [];
        var extra = [];
        /*
		$scope.visualization.data = {
            table: data,
            extra_columns: extra,
            dataConfig: dataConfig,
            dataMetrics: dataMetrics,
            dataHE: dataHE
        };
		*/
		var string_filter_configuration = "";
		for (key in dataConfig) {
			if (!string_filter_configuration=="")
			{
				string_filter_configuration = string_filter_configuration + ",";
			}
			string_filter_configuration = string_filter_configuration + key +"="+dataConfig[key];
		}
		
		//console.log("string_filter_configuration="+string_filter_configuration);
		
		
		$scope.visualization.filter_configuration = string_filter_configuration;
		
		$scope.visualization.historical_events_in_visualization = dataHE;		
		//console.log($scope.visualization.historical_events_in_visualization);
		$scope.visualization.metrics_in_visualization = dataMetrics;
		
		
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

	//$scope.rePlotGraph();

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
angular.module('pcApp.visualization.controllers.visualization', [
    'pcApp.visualization.services.visualization',
    'pcApp.references.services.reference',
    'pcApp.config'
])


.controller('VisualizationsDetailController', ['$scope', '$routeParams', '$location', 'Visualization', function($scope, $routeParams, $location, Visualization) {
	this.message = "Hello VisualizationsDetailController";
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
.controller('VisualizationsController', ['$scope', 'Visualization', '$log', function($scope, Visualization, $log) {
	$log.info("Test VisualizationsController..");
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
.controller('VisualizationDetailController', ['$scope', '$routeParams', '$location', 'Visualization', function($scope, $routeParams, $location, Visualization) {
	this.message = "Hello";

    $scope.test = "hallo";
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


//controler to create a new visualization
.controller('VisualizationsCreateController', ['$scope', '$modal', 'Event', 'Metric', 'Visualization', '$location', '$log', 'API_CONF',
function($scope, $modal, Event, Metric, Visualization, $location, $log, API_CONF) {

	$scope.visualization = {};

	//$scope.myOptions = $scope.events;
	
	this.historicalevent_he_id = '';
	this.historicalevent_he_title = '';
	this.historicalevent_he_startdate = '';
	this.historicalevent_he_enddate = '';
	this.historicalevent_he_description = '';
	$scope.changeselectHE = function(idselected) {
		console.log(idselected);
		$scope.historicalevent_id = idselected['id'];
		$scope.historicalevent_title = idselected['title'];
		$scope.historicalevent_startDate = idselected['startEventDate'];
		$scope.historicalevent_endDate = idselected['endEventDate'];
		$scope.historicalevent_description = idselected['description'];
	};
	

	$scope.createVisualization = function() {
        $scope.visualization.user_id = 1;        				     
        $scope.visualization.views_count = 0;
        $scope.visualization.visualization_type_id = 1;
        $scope.visualization.status_flag_id = 0;
		
		//read metrics selected and they configuration
		var elements = document.getElementsByName("idMetricSelected[]");
		var elemsLabel = document.getElementsByName("mySelectorLabelColumn[]");
		var elemsColumn = document.getElementsByName("mySelectorDataColumn[]");
		var elemsGroup = document.getElementsByName("mySelectorGroupingData[]");

		var dataConfig = []
		for (i in elements) 
		{
			if (!isNaN(i))
			{			
				var row = {
                    metric_id: elements[i].value,
                    label: elemsLabel[i].value,
                    column: elemsColumn[i].value,
                    group: elemsGroup[i].value
                };	
                
                dataConfig.push(row);
			}			
		}
		console.log("dataConfig");
    	console.log(dataConfig);
    	
    	
    	//read graph configuration
    	var showYAxes = document.getElementById("showYAxes").checked;
    	var showLegend = document.getElementById("showLegend").checked;
		var showLines = document.getElementById("showLines").checked;
		var showPoints = document.getElementById("showPoints").checked;
		var showLabels = document.getElementById("showLabels").checked;
		var showGrid = document.getElementById("showGrid").checked;
		
		//read historical events selected
		var idsHistoricalEventsSelected = document.getElementsByName("idHE[]");
		var desriptionistoricalEventsSelected = document.getElementsByName("descHE[]");

		var dataConfigHE = []
		for (i in idsHistoricalEventsSelected) 
		{
			if (!isNaN(i))
			{			
				var row = {
                    historical_event_id: idsHistoricalEventsSelected[i].value,
                    description: desriptionistoricalEventsSelected[i].value,
                };	
               
                dataConfigHE.push(row);
			}			
		}
		console.log("dataConfigHE");
    	console.log(dataConfigHE);
    	
    	//$scope.visualization.data = {
        //    MetricsInVisualizations: dataConfig
        //};
        
        var data = [];
        var extra = [];
        /*
        if($scope.columns.category) {
            extra.push($scope.columns.category);
        }
        */
		/*
        $scope.datagrid.forEach(function(e){
            if(e[0] != null){
                var row = {
                    from: e[$scope.columns.from],
                    to: e[$scope.columns.to],
                    value: e[$scope.columns.value]
                };
                if($scope.columns.category) {
                    row[$scope.columns.category] = e[$scope.columns.extra];
                }
                data.push(row);
            }
        });
		*/
		
        $scope.visualization.data = {
            table: data,
            extra_columns: extra
        };
		
		console.log($scope.visualization);
		
		Visualization.save($scope.visualization,function(value, responseHeaders){
			$location.path('/visualizations/' + value.id);
		},
		function(err) {
            throw { message: err.data};
		}

		);
		
	};
	
/*
	$scope.createVisualization = function() 
	{
		console.log("-------------");
		console.log("createVisualization");		
		console.log("-------------");
  
       // $scope.visualization.title = "test title";
       // $scope.visualization.description = "test desv";
       // $scope.visualization.keywords = "test key";
       // $scope.visualization.issued = "2014-05-02T22:00:00Z";
       // $scope.visualization.publisher = "1";

		console.log($scope.visualization);

		
		Visualization.save($scope.visualization,function(value, responseHeaders){
			$location.path('/visualizations/' + value.id);
		},
		//Visualization.save($scope.visualization,function(){
		//	$location.path('/visualizations/' + value.id);
		//},
		//Visualization.save($scope.visualization,function(value, responseHeaders){
		//	$location.path('/visualizations/' + value.id);
		//},
		function(err) {
            throw { message: err.data};
		}
		
		);

		
	};
	*/
	
	$scope.saveGraphAs = function()
	{
		alert("SAVE AS. Sorry, it's under construction!!!");
	};

	$scope.revertGraph = function()
	{
		alert("REVERT. Sorry, it's under construction!!!");	
	};
      	
	//$scope.eventsToPlot.push("aaaaaaa");
	$scope.typeToPlot = 'graph_line';
	$scope.metrics = Metric.query(
			null,
			function(metricList) {
			},
			function(error) {
				alert(error.data.message);
			}
	);
	
	$scope.events = Event.query(
            null,
            function (eventList) {
            },
            function (error) {
                alert(error.data.message);
            }
    );

	this.tabParent = 0;
	this.tabSon = 0;
		
	$scope.selectTabParent = function(setTab) {
		this.tabParent = setTab;
		this.tabSon = 0;
	};
		
	$scope.isSelectedParent = function(checkTab) {
		return this.tabParent === checkTab;
	};
		
	$scope.selectTabSon = function(setTab) {
		$scope.typeToPlot=setTab;
		this.tabSon = setTab;
		//rePlotGraph();
	};
		
	$scope.isSelectedSon = function(checkTab) {
		return this.tabSon === checkTab;			
	};


	$scope.eventsToPlot = [];
	
	
	//funtion to delete an historical event of the array
	$scope.deleteContainerHistoricalEvent = function(divNameIn, index) {
		divName=divNameIn+''+index;
		var answer = confirm("Are you sure to delete this row?")
			
		if (answer)
		{
			$scope.eventsToPlot.splice((index-1), 1);
			rePlotGraph();
		}
	}
		
	
	//funtion to add historical event to the array
	$scope.addAnotherHistoricalEvent = function(divName) {
			//console.log("1111111111");
			
			//var idRec = $('input[name="idHE"]').val();
			//console.log("idRec=>"+idRec);
			var idRec = $scope.historicalevent_id;
			//console.log("idRec=>"+idRec);
			
			//var titleRec = $('input[name="titleHE"]').val();
			var titleRec = $scope.historicalevent_title;	
			//console.log("titleRec=>"+titleRec);
			
			//var dateStartRec = $('input[name="startDate"]').val();
			var dateStartRec = $scope.historicalevent_startDate;
			//console.log("dateStartRec=>"+dateStartRec);
			
			//var dateEndRec = $('input[name="endDate"]').val();
			var dateEndRec = $scope.historicalevent_endDate;
			//console.log("dateEndRec=>"+dateEndRec);
			
			//var descEndRec = $('input[name="descriptionHEToAdd"]').val();
			
			//var res = dateStartRec.split("-");			
			
			var datosInT =  {
				id : idRec,
				title : titleRec,
				startDate : dateStartRec,
				endDate : dateEndRec,
				//posX : $('input[name="posx"]').val(),
			    //posY : $('input[name="posy"]').val(),
				desc : $('#descriptionHEToAdd').val()
			}
	
			$scope.eventsToPlot.push(datosInT);			
			
			
			//console.log("list events");
			//console.log($scope.eventsToPlot);
			//rePlotGraph();
			
			//
			//document.getElementById("basic-modal-content").innerHTML = "";
			//document.getElementById("basic-modal-content").innerHTML = "The event has been plot in the graph.<br/> Close the window.";
			
		
	};

	$scope.ListMetricsFilter = [];
	$scope.metricsFilter = $scope.ListMetricsFilter;



	$scope.deleteContainerFilterMetric = function(divNameIn, index) {
		divName=divNameIn+''+index;
		var answer = confirm("Are you sure to delete this row?")
			
		if (answer)
		{
			var hidden = document.getElementById("idMetricSelected_"+index).value;
			$scope.ListMetricsFilter.splice((index-1), 1);  				
			//rePlotGraph();		    	
		}
		else
		{
			//some code
		}			
	};
	
	$('#metrics-list').hide();
	$scope.addMetrictoList= function() {	
	 	$('#addmetricsspan').toggleClass('active');
        $('#metrics-list').toggle('slow');	
	}
	
	$scope.displaycontentMetric = function(idMetric) {
		var containerLink = document.getElementById("edit-metric-button-"+idMetric);
		 $(containerLink).parent().next().toggle(200);
	 
	};
	
	$scope.deleteMetricFromList = function(idMetric) {
		var containerLink = document.getElementById("delete-metric-button-"+idMetric);		
		$(containerLink).parent().parent().removeClass('active');
		var str =  $(containerLink).parent().parent().attr("id");
    	$(".metric-list-item[name='"+ str +"']").removeClass('active');
    	var containerId = document.getElementById("MetricSelectediId_"+idMetric);	
		containerId.value = ""; 
	};

	
	$scope.addFilterMetric = function(idMetric) {
		var containerLink = document.getElementById("metric-list-item-item-"+idMetric);		
    	$(containerLink).addClass('active');
    	var str =  $(containerLink).attr("name");
    	$('#' + str + '').addClass('active');	
    	
    	var containerId = document.getElementById("MetricSelectediId_"+idMetric);	
		containerId.value = idMetric; 

		selectedText = "aaaa";
		var myObject = {
					'id':idMetric,
					'name':selectedText,
					'column':'from',
					'value':'value',
					'group':'grouping column'
					};
		
					//console.log("a1");
					
		$scope.ListMetricsFilter.push(myObject);		
    	
	};
	
	
	$scope.addContainerFilterMetric = function(divName) {
			console.log("addContainerFilterMetric");
			//console.log("divName="+divName);
			var continueAdding=1;
			var arrayComboNames = ['metricsList[]','mySelectorLabelColumn[]','mySelectorDataColumn[]'];
			for (j in arrayComboNames) 
			{
				//console.log(arrayComboNames[j]);
				var elems = document.getElementsByName(arrayComboNames[j]);
				var continueValidate = 1;
				//console.log(elems);
				for (i in elems) 
				{
					//console.log("i="+i);
					if (!isNaN(i))
					{
						if (continueValidate==1)
						{
							//console.log(elems[i].id);
							var IdCombo= elems[i].id;
			        		var sel = document.getElementById(IdCombo);
					
							//console.log(sel.selectedIndex);		
							if (sel.selectedIndex=="-1")
							{
								//console.log("sel.selectedIndex ---1");
								continueAdding=0;
								continueValidate = 0;
							}
							else
							{
			    				selectedProperty = sel.options[sel.selectedIndex].value;	
			    				selectedProperty = selectedProperty.toLowerCase();
			    					
			    				//alert(selectedProperty);
			    				if (selectedProperty==='')
								{
									continueAdding=0;
									continueValidate = 0;
								}
								else if (selectedProperty==='label column')
								{
									continueAdding=0;
									continueValidate = 0;
								}
								else if (selectedProperty==='row column')
								{
									continueAdding=0;
									continueValidate = 0;
								}
								else if (selectedProperty==='select metric')
								{
									continueAdding=0;
									continueValidate = 0;
								}								
							}
						}
					}
				}		
			}
				
			//mySelectorDataColumn
			if (continueAdding==0)
			{
				alert("Please inform fields");
				sel.focus();
			}
			else
			{
				var IdCombo= 'metricsList';
				
				var t = document.getElementById(IdCombo);
				//console.log(t);
				var selectedText = t.options[t.selectedIndex].text;
				var selectedId = t.options[t.selectedIndex].id;
				//console.log("selectedText="+selectedText);
				console.log("selectedId="+selectedId);
				//alert(selectedText);
				var ctrlExistMetric =0;
				$scope.ListMetricsFilter.forEach(function(entry) {
					console.log(entry);
					if (entry.id==selectedId)
					{
						ctrlExistMetric = 1;
					}
					
				});
				
				if (ctrlExistMetric==1)
				{
					alert("The metric '"+selectedText+"' is selected")
				}
				else
				{
					var myObject = {
					'id':selectedId,
					'name':selectedText,
					'column':'from',
					'value':'value',
					'group':'grouping column'
					};
		
					//console.log("a1");
					
					$scope.ListMetricsFilter.push(myObject);
					
					//console.log("a2");
					//console.log($scope.ListMetricsFilter);
					/*
					var index = $scope.metricsList.indexOf(selectedText);
					console.log("a3");
					console.log("index="+index);
					if (index>0)
					{
						$scope.metricsList.splice(index, 1);	
					}
					*/
					//console.log("a4");
					
					//var element = document.getElementById(IdCombo);
					//element.value = "";
					//$("#"+IdCombo+" option:selected").remove();
					//rePlotGraph();
					//$scope.rePlotGraph();
				}
			
			}
/**********************/			
			
		};
		
		

	
	

	$scope.rePlotGraph = function() {
		console.log("----rePlotGraph---");
		var arrayJsonFiles = [];
		var datosTemporales = new Object();
		//to preparate the graph we must
		//get all th json fikes
		//we get all the x axis
		//we get all the y axis
		//we get all the grouping
		
		//var elems = document.getElementsByName("idMetricSelected[]");
		var elems = document.getElementsByName("MetricSelectedId[]");
		
		//console.log("elems.length="+elems.length);
		//console.log("$scope.metricsFilter.length: "+$scope.metricsFilter.length);
		
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
				console.log("elems[i].id="+elems[i].id);
				console.log("elems[i].value="+elems[i].value);		
				if (elems[i].value>0)
				{	
					var jsonFile = elems[i].value;
					var jsonFileName = jsonFile;
					jsonFile = "json/"+jsonFile;
					//console.log("jsonFile");	
					//console.log(jsonFile);	
					//jsonFile = "http://localhost/d3js/testMMP/json/"+jsonFile;	
					var resIdMetric  =elems[i].value;
					//var str = elems[i].id;
					//var resIdMetric = str.replace("idMetricSelected_", "");
					//jsonFile ="/api/v1/metricsmanager/metrics/"+resIdMetric;
					jsonFile = API_CONF.METRICS_MANAGER_URL + "/metrics/"+resIdMetric;
					
					//jsonFile = "json/to_test_1.json";
					
					console.log("jsonFile="+jsonFile);
					//jsonFile = "DataSource.json";			
					if (jsonFile)
					{
						//console.log("jsonFile OK");
						//var str = elems[i].id;
						//var puntero = str.replace("idMetricSelected_", "");
						//console.log(puntero);				
						//var res = "selectorLabelColumn_"+puntero;
						var res = "MetricSelectediIndex_"+resIdMetric;
						var puntero = document.getElementById(res).value;
						alert(puntero);
						var res = "MetricSelectorLabelColumn_"+puntero;
						//console.log(res);
						var valueXAxis = document.getElementById(res).value;				
						//console.log(valueXAxis);				
						//res = "selectorDataColumn_"+puntero;				
						res = "MetricSelectorDataColumn_"+puntero;
						var valueYAxis = document.getElementById(res).value;				
						//console.log(valueYAxis);
					
						//res = "selectorGroupingData_"+puntero;
						res = "MetricselectorGroupingData_"+puntero;
						var valueGroup = document.getElementById(res).value;
					
						if (valueGroup)
						{
							arrayKeys.push(jsonFileName);
							arrayXAxis.push(valueXAxis);
							arrayYAxis.push(valueYAxis);
							arrayGrouping.push(valueGroup);	
							arrayJsonFiles.push(jsonFile);
							cntMetrics = cntMetrics+1;
						}				
						//console.log(valueGroup);
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
		//console.log(elemsHE_title);
	    //console.log("rePlotGraph - $scope.eventsToPlot")
		//console.log($scope.eventsToPlot);
		/*
		if ($scope.eventsToPlot.length>0)
		{
			$scope.eventsToPlot = [];	
		}
		*/
		/*
	    console.log("<<<<<<<<<<<<<<<<<");
		console.log($scope.eventsToPlot.length);
		console.log($scope.eventsToPlot);
		for (i in elemsHE_startDate) 
		{
			console.log("i="+i);
			if (!isNaN(i)) 
			{
				//alert(i)
				var title = elemsHE_title[i].value;
				var startDate = elemsHE_startDate[i].value;
				var endDate = elemsHE_endDate[i].value;
				var desc = elemsHE_desc[i].value;
			
				var objData = {
					title: title,
					startDate: startDate,
					endDate: endDate,
			    	desc: desc
			    	};
			
				$scope.eventsToPlot.push(objData);
			}
		}
		*/
		//console.log($scope.eventsToPlot.length);
		//console.log($scope.eventsToPlot);
		
		//console.log(arrayJsonFiles);
		var q = queue();
  		arrayJsonFiles.forEach(function(d,i) 
  		{
  			//console.log("i="+i+".d="+d);
  			q = q.defer(d3.json, d);
  		
	    	//add your csv call to the queue
    		///q.defer(function(callback) {
      		///	d3.json(d,function(res) {callback(null, res)});
    		////})
    		//;
  		});
	
  		//q.await(setDataToPlot);
  		q.await($scope.plotGraph);
  		
  			
		//console.log(".,.,.,.,.,.");
		//console.log(numbers1);
		//ready(eventsToPlot);
	};




	
	$scope.plotGraph = function() {
	
		console.log("#############");
		console.log(arguments);
		console.log("#############");
		var numbers1 = [];
		var cntNumbers =0;
		var control=0;
		if ($scope.metricsFilter.length==0)
		{
			control=0;
		}
		else 
		{
			control=1;
		}
		
		if (control==1)
		{			
			for (var i=1; i<arguments.length; i++)
			{
				console.log(".i="+i);
				if (!isNaN(i)) 
				{
					//selectorLabel = document.getElementById("selectorLabelColumn_"+i).value;
					selectorLabel = document.getElementById("MetricSelectorLabelColumn_"+i).value;
					
					//selectorLabel = selectorLabel.toLowerCase();
				 
				 	//selectorDataColumn = document.getElementById("selectorDataColumn_"+i).value;
				 	selectorDataColumn = document.getElementById("MetricSelectorDataColumn_"+i).value;
				 	
					//selectorDataColumn = selectorDataColumn.toLowerCase();
					
					//console.log("selectorLabel="+selectorLabel)
					//console.log("selectorDataColumn="+selectorDataColumn)					
					//console.log(arguments[i]['data']['table']);
					
					
	
					
					if (($scope.typeToPlot==='graph_line') || ($scope.typeToPlot==='graph_pie') || ($scope.typeToPlot==='graph_graphbars'))
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
	  						//console.log("indexRow---->"+indexRow);
							//console.log("object_size---->"+object_size);
							
							/*
							arrayValues.push(arguments[i]['data']['table'][j][selectorDataColumn]);
							arrayLabels.push(arguments[i]['data']['table'][j][selectorLabel]);
							arrayValuesXY.push(arguments[i]['data']['table'][j][selectorLabel]+"|"+arguments[i]['data']['table'][j][selectorDataColumn]);
							*/
							
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
						//console.log("_!_!_!_!_!_!_!_");
						//console.log("arrayValues.length=>"+arrayValues.length);
						//console.log(arrayValues);
						the_object = arrayValues;
						
						
						var numbers1 = [];
						for (key in the_object)	{
							console.log("***key="+key);
							
							if ($scope.typeToPlot==='graph_graphbars')
							{
								for (var j=0; j<arrayValues[key].length; j++)
								//for (var j=0; j<4; j++)
								{
									console.log("jjj="+j);
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
			/*
			var arrayValues = [];
			arrayValues.push(130);
			arrayValues.push(200);
			arrayValues.push(180);
			
			var arrayLabels = [];
			arrayLabels.push("06/11/2010");
			arrayLabels.push("08/12/2012");
			arrayLabels.push("12/31/2013");
			
			
			var arrayValuesXY = [];
			arrayValuesXY.push("06/11/2010|130");
			arrayValuesXY.push("08/12/2012|200");
			arrayValuesXY.push("12/31/2013|180");
			
			var numbers1T = {"Key":"test1"};

			var numbers1 = [];
			var ObjectTemporal = new Object();
			ObjectTemporal['Key']="test1";
			ObjectTemporal['Values']=arrayValues;
			ObjectTemporal['Labels']=arrayLabels;
			ObjectTemporal['ValueX']=arrayLabels;
			ObjectTemporal['ValueY']=arrayValues;
			ObjectTemporal['XY']=arrayValuesXY;
			ObjectTemporal['Type']='metric';
							
			numbers1[0]=ObjectTemporal;


			var arrayValues = [];
			arrayValues.push(400);
			arrayValues.push(1400);
			arrayValues.push(750);
			
			var arrayLabels = [];
			arrayLabels.push("05/10/2010");
			arrayLabels.push("07/11/2012");
			arrayLabels.push("11/30/2014");
			
			
			var arrayValuesXY = [];
			arrayValuesXY.push("05/10/2010|400");
			arrayValuesXY.push("07/11/2012|1400");
			arrayValuesXY.push("11/30/2014|750");
			
			var numbers1T = {"Key":"test2"};


			var ObjectTemporal = new Object();
			ObjectTemporal['Key']="test2";
			ObjectTemporal['Values']=arrayValues;
			ObjectTemporal['Labels']=arrayLabels;
			ObjectTemporal['ValueX']=arrayLabels;
			ObjectTemporal['ValueY']=arrayValues;
			ObjectTemporal['XY']=arrayValuesXY;
			ObjectTemporal['Type']='metric';
			numbers1[1]=ObjectTemporal;
			*/
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
                		
				barLine.render(numbers1, $scope.eventsToPlot);
			}
		}				
		else if ($scope.typeToPlot==='graph_pie')
		{
			/*
			var arrayValues = [];
			arrayValues.push(130);
			arrayValues.push(200);
			arrayValues.push(180);
			
			var arrayLabels = [];
			arrayLabels.push("06/11/2010");
			arrayLabels.push("08/12/2012");
			arrayLabels.push("12/12/2013");
			
			var arrayValuesXY = [];
			arrayValuesXY.push("06/11/2010|130");
			arrayValuesXY.push("08/12/2012|200");
			arrayValuesXY.push("12/12/2013|180");
			
			var numbers1T = {"Key":"test1"};

			var numbers1 = [];
			var ObjectTemporal = new Object();
			ObjectTemporal['Key']="test1";
			ObjectTemporal['Values']=arrayValues;
			ObjectTemporal['Labels']=arrayLabels;
			ObjectTemporal['ValueX']=arrayLabels;
			ObjectTemporal['ValueY']=arrayValues;
			ObjectTemporal['XY']=arrayValuesXY;
			ObjectTemporal['Type']='metric';
							
			numbers1[0]=ObjectTemporal;
		
			*/
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
		else if ($scope.typeToPlot==='graph_graphbars')
		{
			document.getElementById("container_graph").innerHTML = "";
			/*
			var numbers1 = [];
			var ObjectData = {'Category': "1", 'From':"01/01/2010", 'Key':"aaa", "To":"02/02/2010", "Value":"10","ValueX":"01/01/2010","ValueY":"10", "XY":"01/01/2010|10"};
			numbers1.push(ObjectData);
			
			var ObjectData = {'Category': "1", 'From':"01/01/2011", 'Key':"bb", "To":"02/02/2011", "Value":"40","ValueX":"01/01/2011","ValueY":"40", "XY":"01/01/2011|40"};
        	numbers1.push(ObjectData);
        	*/		
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
	                
			barObj.render(datasetToSend, $scope.eventsToPlot);
		}


	};




    

	$scope.name = 'Add an event';

      
      $scope.showModal = function() {
        
        console.log("show modal");
        
        var s= document.getElementById("startDatePosX");
        console.log(s.value);
        
	    dateRec = s.value;
    	console.log("dateRec="+dateRec+"--now="+Date.now());
    	if (dateRec)
    	{
    		//dateRec = '2014-01-01';
    		//console.log("dateRec="+dateRec);
    		dateRec = dateRec.replace(/-/g,"/");
    		var res = dateRec.split("/");
    		var newDate = res[2]+"-"+res[0]+"-"+res[1];
    		console.log("newDate="+newDate);
    		$scope.startDate = (newDate);
    	}
    	else
    	{
    		$scope.startDate = $filter("date")(Date.now(), 'yyyy-MM-dd');	
    	}

        $scope.startDate = '01-01-2011';
        //$scope.startDate = s.value;

        $scope.opts = {
        backdrop: true,
        backdropClick: false,
        dialogFade: true,
        keyboard: true,        
        //templateUrl : 'http://localhost:8080/app/index.html#/visualization/addEvent',
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
              
	
	
}])


.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', '$modal', 'item',
function($scope, $modalInstance, $modal, item) {
//var ModalInstanceCtrl = function($scope, $modalInstance, $modal, item) {
    
     $scope.item = item;

	 // console.log("dateToSet="+dateToSet);
      
      $scope.ok = function () {
        $modalInstance.close();
      };
      
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
//};
}])



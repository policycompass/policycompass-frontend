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

	$( "#tabs" ).tabs();
	
	
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

    
        var dataConfig = [];
        dataConfig['showLegend'] = $scope.showLegend;
        dataConfig['showLines'] = $scope.showLines;
        dataConfig['showPoints'] = $scope.showPoints;
        dataConfig['showLabels'] = $scope.showLabels;
        dataConfig['showGrid'] = $scope.showGrid;
        dataConfig['showYAxesTogether'] = $scope.showYAxesTogether;
        
        /*
        dataConfig['showLegend'] = document.getElementById("showLegend").checked;
        dataConfig['showLines'] = document.getElementById("showLines").checked;
        dataConfig['showPoints'] = document.getElementById("showPoints").checked;
        dataConfig['showLabels'] = document.getElementById("showLabels").checked;
        dataConfig['showGrid'] = document.getElementById("showGrid").checked;
        dataConfig['showYAxesTogether'] = document.getElementById("showYAxesTogether").checked;
        */
        
        var dataMetrics = [];
        
		//console.log($scope.MetricSelectediId_);
		//console.log($scope.MetricSelectediIndex_);
		//console.log($scope.MetricSelectorLabelColumn_);
		//console.log($scope.MetricSelectorDataColumn_);
		//console.log($scope.MetricselectorGroupingData_);    

		for (i in $scope.MetricSelectediIndex_)
		{
			//console.log("i="+i+"---$scope.MetricSelectediIndex_["+i+"]="+$scope.MetricSelectediIndex_[i])
			if (!isNaN($scope.MetricSelectediIndex_[i]))
			{
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
   
        
        //console.log("ini HE $scope.idHE.length="+$scope.idHE.length);
        
        var dataHE = [];
        
        for (i in $scope.idHE)
        {
			//console.log("i="+i+"---$scope.idHE["+i+"]="+$scope.idHE[i])
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
            extra_columns: extra
        };

		//console.log("------------------");
		//console.log($scope.visualization);

		Visualization.save($scope.visualization,function(value, responseHeaders){
			$location.path('/visualizations/' + value.id);
		},
		function(err) {
            throw { message: err.data};
		}

		);

	};

      	
	//$scope.eventsToPlot.push("aaaaaaa");
//	$scope.typeToPlot = 'graph_line';
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
			$scope.rePlotGraph();
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
				//posX : $('input[name="posx"]').val(),
			    //posY : $('input[name="posy"]').val(),
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

	$scope.addFilterMetric = function(idMetric) {
		var containerLink = document.getElementById("metric-list-item-item-"+idMetric);		
    	$(containerLink).addClass('active');
    	var str =  $(containerLink).attr("name");
    	$('#' + str + '').addClass('active');	
    	
    	var containerId = document.getElementById("MetricSelectediId_"+idMetric).value;	
    	var containerIndex = document.getElementById("MetricSelectediIndex_"+idMetric).value;
    	//console.log("**********************containerIndex="+containerIndex);
		//containerId.value = idMetric; 
		
		//$('#MetricSelectediId_'+idMetric).val(idMetric);
		
		console.log("idMetric="+idMetric);
		
		console.log("$scope.MetricSelectediId_[idMetric]="+$scope.MetricSelectediId_[idMetric]);
		
		$scope.MetricSelectediId_[idMetric]=idMetric;
		
		console.log("$scope.MetricSelectediId_[idMetric]="+$scope.MetricSelectediId_[idMetric]);

		var myText = "from";
		//$('#MetricSelectorLabelColumn_'+containerIndex+' option[value="' + myText + '"]').prop('selected', true);
		$scope.MetricSelectorLabelColumn_[containerIndex]=myText;
		
		var myText = "value";
		//$('#MetricSelectorDataColumn_'+containerIndex+' option[value="' + myText + '"]').prop('selected', true);
		$scope.MetricSelectorDataColumn_[containerIndex]=myText;
		
		var myText = "grouping column";
		//$('#MetricselectorGroupingData_'+containerIndex+' option[value="' + myText + '"]').prop('selected', true);
		$scope.MetricselectorGroupingData_[containerIndex]=myText;

		
		selectedText = " ";
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
		
	$scope.displaycontentMetric = function(idMetric) {
		var containerLink = document.getElementById("edit-metric-button-"+idMetric);
		 $(containerLink).parent().next().toggle(200);
	 
	};
	
	$scope.deleteMetricFromList = function(idMetric) {
		var containerLink = document.getElementById("delete-metric-button-"+idMetric);		
		$(containerLink).parent().parent().removeClass('active');
		var str =  $(containerLink).parent().parent().attr("id");
    	$(".metric-list-item[name='"+ str +"']").removeClass('active');
    	
    	//var containerId = document.getElementById("MetricSelectediId_"+idMetric);	
		//containerId.value = ""; 
		
		$scope.MetricSelectediId_[idMetric]= "";
		
		
		$scope.rePlotGraph();
	};
	
/*
 ////comentado tmporalmente
 
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
					
					//var index = $scope.metricsList.indexOf(selectedText);
					//console.log("a3");
					//console.log("index="+index);
					//if (index>0)
					//{
					//	$scope.metricsList.splice(index, 1);	
					//}
					
					//console.log("a4");

					//var element = document.getElementById(IdCombo);
					//element.value = "";
					//$("#"+IdCombo+" option:selected").remove();
					//rePlotGraph();
					//$scope.rePlotGraph();
				}

			}
		};



*/


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
		
		
		//var elems = document.getElementsByName("MetricSelectedId[]");
		var elems = $scope.MetricSelectediId_;
		//var elemsIndex = document.getElementsByName("MetricSelectediIndex[]");
		var elemsIndex = $scope.MetricSelectediIndex_;
		
		
	
		
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
				//console.log("elems[i].id="+elems[i].id);
				//console.log("elems[i].value="+elems[i].value);
				//if (elems[i].value>0)
				if (elems[i]>0)
				{
					//var jsonFile = elems[i].value;
					//var jsonFile = elems[i].id;
					var jsonFile = elems[i];
					var jsonFileName = jsonFile;
					jsonFile = "json/"+jsonFile;
					//console.log("jsonFile");	
					//console.log(jsonFile);	
					//jsonFile = "http://localhost/d3js/testMMP/json/"+jsonFile;	
					//var str = elems[i].id;
					
					//var resIdMetric = str.replace("idMetricSelected_", "");
					var resIdMetric = elems[i];
					//jsonFile ="/api/v1/metricsmanager/metrics/"+resIdMetric;
					jsonFile = API_CONF.METRICS_MANAGER_URL + "/metrics/"+resIdMetric;

					//jsonFile = "json/to_test_1.json";

					console.log("jsonFile="+jsonFile);
					//jsonFile = "DataSource.json";			
					if (jsonFile)
					{
						//console.log("jsonFile OK");
						var str = elems[i];
						//var puntero = str.replace("idMetricSelected_", "");
						var puntero = elemsIndex[i];
						
						console.log("puntero="+puntero);				
						//var res = "selectorLabelColumn_"+puntero;
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
  			console.log("-- arrayJsonFiles.forEach -- i="+i+".d="+d);
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
		else {
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

							if ($scope.typeToPlot==='graph_bars')
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
		else if ($scope.typeToPlot==='graph_bars')
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
        console.log("s.value="+s.value);
        
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

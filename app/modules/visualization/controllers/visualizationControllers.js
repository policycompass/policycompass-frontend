angular.module('pcApp.visualization.controllers.visualization', [
    'pcApp.visualization.services.visualization',
    'pcApp.references.services.reference'
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
				$log.info(visualizationList);
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
.controller('VisualizationsCreateController', ['$scope', '$modal', 'Metric', 'Visualization', '$location', '$log',
function($scope, $modal, Metric, Visualization, $location, $log) {

	$scope.visualization = {};

	$scope.createVisualization = function() 
	{
		console.log("-------------");
		console.log("createVisualization");		
		console.log("-------------");


/*        
        $scope.visualization.title = "test title";
        $scope.visualization.description = "test desv";
        $scope.visualization.keywords = "test key";
        $scope.visualization.issued = "2014-05-02T22:00:00Z";
        $scope.visualization.publisher = "1";
*/
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
		}
	}
		
	
	//funtion to add historical event to the array
	$scope.addAnotherHistoricalEvent = function(divName) {
			//console.log("1111111111");
			
			var titleRec = $('input[name="titleHE"]').val();			
			console.log("titleRec=>"+titleRec);
			
			var dateStartRec = $('input[name="startDate"]').val();
			console.log("dateStartRec=>"+dateStartRec);
			
			var dateEndRec = $('input[name="endDate"]').val();
			console.log("dateEndRec=>"+dateEndRec);
			
			
			//var res = dateStartRec.split("-");
			
			
			var datosInT =  {
				title : titleRec,
				startDate : dateStartRec,
				endDate : dateEndRec,
				//posX : $('input[name="posx"]').val(),
			    //posY : $('input[name="posy"]').val(),
				desc : $('#textareamodal').val()
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
		 
	$scope.addContainerFilterMetric = function(divName) {		
			console.log("addContainerFilterMetric");
			console.log("divName="+divName);
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
			    				//alert(selectedProperty);
			    				if (selectedProperty==='')
								{
									continueAdding=0;
									continueValidate = 0;
								}
								else if (selectedProperty==='Label Column')
								{
									continueAdding=0;
									continueValidate = 0;
								}
								else if (selectedProperty==='Row Column')
								{
									continueAdding=0;
									continueValidate = 0;
								}
								else if (selectedProperty==='Select Metric')
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
				//console.log("selectedId="+selectedId);
				//alert(selectedText);
				
				var myObject = {
				'id':selectedId,
				'name':selectedText,
				'column':'From',
				'value':'Value',
				'group':'Grouping Column'
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
			
			}
/**********************/			
			
		};
		
		

	
	

	$scope.rePlotGraph = function() {
		console.log("rePlotGraph");
		var arrayJsonFiles = [];
		var datosTemporales = new Object();
		//to preparate the graph we must
		//get all th json fikes
		//we get all the x axis
		//we get all the y axis
		//we get all the grouping
		var elems = document.getElementsByName("idMetricSelected[]");
	
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
				//console.log(elems[i].id);
				//console.log(elems[i].value);			
				var jsonFile = elems[i].value;
				var jsonFileName = jsonFile;
				jsonFile = "json/"+jsonFile;
				//console.log("jsonFile");	
				//console.log(jsonFile);	
				//jsonFile = "http://localhost/d3js/testMMP/json/"+jsonFile;	
				//jsonFile = "DataSource.json";			
				if (jsonFile)
				{
					var str = elems[i].id;
					var puntero = str.replace("idMetricSelected_", "");
					//console.log(puntero);				
					var res = "selectorLabelColumn_"+puntero;
					//console.log(res);
					var valueXAxis = document.getElementById(res).value;				
					//console.log(valueXAxis);				
					res = "selectorDataColumn_"+puntero;				
					var valueYAxis = document.getElementById(res).value;				
					//console.log(valueYAxis);
				
					res = "selectorGroupingData_"+puntero;
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
			
			var numbers1 = [];
			var ObjectData = {'Category': "1", 'From':"01/01/2010", 'Key':"aaa", "To":"02/02/2010","Value":"10","ValueX":"01/01/2010","ValueY":"10", "XY":"01/01/2010|10"};
			numbers1.push(ObjectData);
			
        				
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



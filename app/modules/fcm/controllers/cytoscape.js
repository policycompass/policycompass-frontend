angular.module('pcApp.fcm.controllers.cytoscapes',[])

.service("ConceptsDetail", function() {
    var Concepts = [];

    return {
        setConcepts: function(ConceptObj) {
            Concepts = ConceptObj;
        },
        getConcepts: function() {
            return Concepts;
        },
    };
})

.service("AssociationsDetail", function() {
    var Associations = [];

    return {
        setAssociations: function(AssociationObj) {
            Associations = AssociationObj;
        },
        getAssociations: function() {
            return Associations;
        },
    };
})

.service("FCMModelsDetail", function() {
    var Models = [];

    return {
        setModels: function(ModelObj) {
            Models = ModelObj;
        },
        getModels: function() {
            return Models;
        },
    };
})

.service("EditConcept", function() {
    var Concept;
    var EditMode;

    return {
        setConcept: function(ConceptObj) {
            Concept = ConceptObj;
        },
        getConcept: function() {
            return Concept;
        },
        setEditMode: function(EditModeObj) {
            EditMode = EditModeObj;
        },
        getEditMode: function() {
            return EditMode;
        },
    };
})

.service("EditAssociation", function() {
    var Association;
    var EditMode;

    return {
        setAssociation: function(AssociationObj) {
            Association = AssociationObj;
        },
        getAssociation: function() {
            return Association;
        },
        setEditMode: function(EditModeObj) {
            EditMode = EditModeObj;
        },
        getEditMode: function() {
            return EditMode;
        },
    };
})

.controller('CytoscapeCtrl', function($scope, $rootScope,  $routeParams, $location, $translate, Fcm, FcmModel, FcmActivator, dialogs, FCMModelsDetail, ConceptsDetail, AssociationsDetail, EditConcept, EditAssociation){
  // container objects
  $scope.Models = [];
  $scope.mapData = [];
  $scope.edgeData = [];
  $scope.Concepts = [];
  $scope.Associations = [];
  $scope.NodeID = 0;

  FCMModelsDetail.setModels($scope.Models);
  ConceptsDetail.setConcepts($scope.Concepts);
  AssociationsDetail.setAssociations($scope.Associations);

if ($routeParams.fcmId)
{
    // Mode is editing
    $scope.mode = "edit";

    $scope.Fcmactivators = FcmActivator.query({}, function(activatorList) {
    },
    function(error) {
	throw { message: JSON.stringify(err.data)};
    });

  $scope.modeldetail = FcmModel.get(
    {id: $routeParams.fcmId},
    function (fcmList) {
	var model = {ModelID: $scope.modeldetail.model.id.toString(), 
	title: $scope.modeldetail.model.title.toString(), 
	description: $scope.modeldetail.model.description.toString(), 
	keywords: $scope.modeldetail.model.keywords.toString()};
	FCMModelsDetail.setModels(model);
	for (i=0; i<$scope.modeldetail.concepts.length; i++)
	{
	    var newNode = {id:$scope.modeldetail.concepts[i].id.toString(), name:$scope.modeldetail.concepts[i].title, posX:$scope.modeldetail.concepts[i].positionX, posY:$scope.modeldetail.concepts[i].positionY};
	    var Concept = {Id: $scope.modeldetail.concepts[i].id.toString(), title: $scope.modeldetail.concepts[i].title, description: $scope.modeldetail.concepts[i].description, scale: $scope.modeldetail.concepts[i].scale, x: $scope.modeldetail.concepts[i].positionX, y: $scope.modeldetail.concepts[i].positionY, dateAddedtoPC:$scope.modeldetail.concepts[i].dateAddedtoPC, dateModified:$scope.modeldetail.concepts[i].dateModified};

	    $scope.mapData.push(newNode);
	    $scope.Concepts.push(Concept);
	}
	for (i=0; i<$scope.modeldetail.connections.length; i++)
	{
	    var newEdge = {id:$scope.modeldetail.connections[i].id.toString(), source: $scope.modeldetail.connections[i].conceptFrom.toString(), target: $scope.modeldetail.connections[i].conceptTo.toString(), weighted: '?'};
	    var Association = {Id: $scope.modeldetail.connections[i].id.toString(), sourceID: $scope.modeldetail.connections[i].conceptFrom.toString(), source: '', destinationID: $scope.modeldetail.connections[i].conceptTo.toString(), destination: ''};

	    for (j=0; j<$scope.Concepts.length; j++)
	    {
		if (Association.sourceID==$scope.Concepts[j].Id)
		    Association.source=$scope.Concepts[j];
		if (Association.destinationID==$scope.Concepts[j].Id)
		    Association.destination=$scope.Concepts[j];
	    }
	    $scope.edgeData.push(newEdge);
	    $scope.Associations.push(Association);
	}
	// broadcasting the event
	$rootScope.$broadcast('appChanged');
    },
    function (error) {
	throw { message: JSON.stringify(err.data)};
    }
  );
}
else
{
    // Mode is creation
    $scope.mode = "create";
}

// For Exaple of Results

  $scope.ConceptsResults = [];	
  $scope.ConceptsResults = $scope.Concepts;
  $scope.Results1 = [];	
  $scope.Results2 = [];	
  $scope.Results3 = [];	
  $scope.Results4 = [];	


    $scope.range = function(min,max,step) {
	step = step || 1;
	var input = [];
	for (var i=min;i<=max;i+=step)
	    input.push(i);
	return input;
    };

  var res={Val: "0.40"};
  $scope.Results1.push(res);	
  res={Val: "0.53"};
  $scope.Results1.push(res);	
  res={Val: "0.53"};
  $scope.Results1.push(res);	
  res={Val: "0.59"};
  $scope.Results1.push(res);	
  res={Val: "0.59"};
  $scope.Results1.push(res);	
  res={Val: "0.59"};
  $scope.Results1.push(res);	
  res={Val: "0.59"};
  $scope.Results1.push(res);	
  res={Val: "0.59"};
  $scope.Results1.push(res);	
  res={Val: "0.59"};
  $scope.Results1.push(res);	
  res={Val: "0.59"};
  $scope.Results1.push(res);	
  res={Val: "0.59"};
  $scope.Results1.push(res);	
  res={Val: "0.59"};
  $scope.Results1.push(res);	
  res={Val: "0.59"};
  $scope.Results1.push(res);	
  res={Val: "0.59"};
  $scope.Results1.push(res);	
  res={Val: "0.59"};
  $scope.Results1.push(res);	
 // $scope.ConceptsResults[0].results=$scope.Results1;

  res={Val: "0.20"};
  $scope.Results2.push(res);	
  res={Val: "0.42"};
  $scope.Results2.push(res);	
  res={Val: "0.40"};
  $scope.Results2.push(res);	
  res={Val: "0.38"};
  $scope.Results2.push(res);	
  res={Val: "0.38"};
  $scope.Results2.push(res);	
  res={Val: "0.38"};
  $scope.Results2.push(res);	
  res={Val: "0.38"};
  $scope.Results2.push(res);	
  res={Val: "0.38"};
  $scope.Results2.push(res);	
  res={Val: "0.38"};
  $scope.Results2.push(res);	
  res={Val: "0.38"};
  $scope.Results2.push(res);	
  res={Val: "0.38"};
  $scope.Results2.push(res);	
  res={Val: "0.38"};
  $scope.Results2.push(res);	
  res={Val: "0.38"};
  $scope.Results2.push(res);	
  res={Val: "0.38"};
  $scope.Results2.push(res);	
  res={Val: "0.38"};
  $scope.Results2.push(res);	
 // $scope.ConceptsResults[1].results=$scope.Results2;

  res={Val: "0.80"};
  $scope.Results3.push(res);	
  res={Val: "0.53"};
  $scope.Results3.push(res);	
  res={Val: "0.56"};
  $scope.Results3.push(res);	
  res={Val: "0.56"};
  $scope.Results3.push(res);	
  res={Val: "0.56"};
  $scope.Results3.push(res);	
  res={Val: "0.56"};
  $scope.Results3.push(res);	
  res={Val: "0.56"};
  $scope.Results3.push(res);	
  res={Val: "0.56"};
  $scope.Results3.push(res);	
  res={Val: "0.56"};
  $scope.Results3.push(res);	
  res={Val: "0.56"};
  $scope.Results3.push(res);	
  res={Val: "0.56"};
  $scope.Results3.push(res);	
  res={Val: "0.56"};
  $scope.Results3.push(res);	
  res={Val: "0.56"};
  $scope.Results3.push(res);	
  res={Val: "0.56"};
  $scope.Results3.push(res);	
  res={Val: "0.56"};
  $scope.Results3.push(res);	
 // $scope.ConceptsResults[2].results=$scope.Results3;

  res={Val: "0.20"};
  $scope.Results4.push(res);	
  res={Val: "0.65"};
  $scope.Results4.push(res);	
  res={Val: "0.60"};
  $scope.Results4.push(res);	
  res={Val: "0.61"};
  $scope.Results4.push(res);	
  res={Val: "0.61"};
  $scope.Results4.push(res);	
  res={Val: "0.61"};
  $scope.Results4.push(res);	
  res={Val: "0.61"};
  $scope.Results4.push(res);	
  res={Val: "0.61"};
  $scope.Results4.push(res);	
  res={Val: "0.61"};
  $scope.Results4.push(res);	
  res={Val: "0.61"};
  $scope.Results4.push(res);	
  res={Val: "0.61"};
  $scope.Results4.push(res);	
  res={Val: "0.61"};
  $scope.Results4.push(res);	
  res={Val: "0.61"};
  $scope.Results4.push(res);	
  res={Val: "0.61"};
  $scope.Results4.push(res);	
  res={Val: "0.61"};
  $scope.Results4.push(res);	
 // $scope.ConceptsResults[3].results=$scope.Results4;

// end of Example of Results

    $scope.saveModel = function(){
	dlg = dialogs.create('/dialogs/savemodel.html','ModelController',{},{key: false,back: 'static'});
	dlg.result.then(function(user){
		$scope.Models.push(user);

		var jsonModel = {ModelTitle: user.title, ModelDesc: user.description, ModelKeywords: user.keywords, userID: "1",
			concepts: ConceptsDetail.getConcepts(), connections: AssociationsDetail.getAssociations()};

		$scope.fcmModel = new Fcm();
		$scope.fcmModel.data = jsonModel;

                Fcm.save($scope.fcmModel, function (value) {
			var dlg = dialogs.notify("FCM Model", "'" + user.title + "' FCM Model has been saved!");
			$scope.md = value;
			$location.path('/models/' + value.model.id + '/edit');
                    },
                    function (err) {
                        throw { message: err.data};
                    }
                );
        },function(){
          $scope.name = 'You decided not to enter in your name, that makes me sad.';
        });
    };

    $scope.updateModel = function(){
		var jsonModel = {model: FCMModelsDetail.getModels(), userID: "1",
			concepts: ConceptsDetail.getConcepts(), connections: AssociationsDetail.getAssociations()};
		$scope.fcmModelUpdate = new FcmModel();
		$scope.fcmModelUpdate.data = jsonModel;

                FcmModel.update({id: $routeParams.fcmId}, $scope.fcmModelUpdate, function (value) {
				var dlg = dialogs.notify("FCM Model", "'" + value.model.title + "' FCM Model has been saved!");
			$scope.md = value;
                    },
                    function (err) {
                        throw { message: err.data};
                    }
                );
    };

    $scope.editMetrics = function(){
	dlg = dialogs.create('/dialogs/editmetrics.html','EditMetricsController',{},{key: false,back: 'static'});
	dlg.result.then(function(user){
        },function(){
          $scope.name = 'You decided not to enter in your name, that makes me sad.';
        });
    };

    $scope.metricsManager = function(){
	dlg = dialogs.create('/dialogs/metricsmanager.html','MetricsManagerController',{},{key: false,back: 'static'});
	dlg.result.then(function(user){
        },function(){
          $scope.name = 'You decided not to enter in your name, that makes me sad.';
        });
    };

    $scope.correlationMatrix = function(){
	dlg = dialogs.create('/dialogs/correlationmatrix.html','CorrelationMatrixController',{},{key: false,back: 'static'});
	dlg.result.then(function(user){
        },function(){
          $scope.name = 'You decided not to enter in your name, that makes me sad.';
        });
    };

    $scope.impactAnalysis = function(){
	dlg = dialogs.create('/dialogs/impactanalysis.html','ImpactAnalysisController',{},{key: false,back: 'static'});
	dlg.result.then(function(user){
        },function(){
          $scope.name = 'You decided not to enter in your name, that makes me sad.';
        });
    };

    // add object from the form then broadcast event which triggers the directive redrawing of the chart
    // you can pass values and add them without redrawing the entire chart, but this is the simplest way
    $scope.addObj = function(){
	dlg = dialogs.create('/dialogs/addconcept.html','ConceptController',{},{key: false,back: 'static'});
	dlg.result.then(function(user){
		// collecting data from the form
		var newObj = user.title;
		user.Id = 'n' + $scope.NodeID;
		user.x = $scope.NodeID*100+200;
		user.y = $scope.NodeID*100+200;
		// building the new Node object
		// using the array length to generate an id for the sample (you can do it any other way)
		var newNode = {id:'n' + ($scope.NodeID), name:newObj, posX:user.x, posY:user.y};
		$scope.NodeID = $scope.NodeID + 1;
		// adding the new Node to the nodes array
		$scope.mapData.push(newNode);
		$scope.Concepts.push(user);

		// broadcasting the event
		$rootScope.$broadcast('appChanged');
		// resetting the form
        },function(){
          $scope.name = 'You decided not to enter in your name, that makes me sad.';
        });
    };

    // add Edges to the edges object, then broadcast the change event
    $scope.addEdge = function(){
        dlg = dialogs.create('/dialogs/addassociation.html','AssociationController',{},{key: false,back: 'static'});
        dlg.result.then(function(user){
		// collecting the data from the form
		var edge1 = user.source.Id;
		var edge2 = user.destination.Id;
		user.Id = 'e'+($scope.edgeData.length);
		// building the new Edge object from the data
		// using the array length to generate an id for the sample (you can do it any other way)
		var newEdge = {id:'e'+($scope.edgeData.length), source: edge1, target: edge2, weighted: user.weight};
		// adding the new edge object to the adges array
		$scope.edgeData.push(newEdge);
		$scope.Associations.push(user);
		// broadcasting the event
		$rootScope.$broadcast('appChanged');
		// resetting the form
        },function(){
          $scope.name = 'You decided not to enter in your name, that makes me sad.';
        });
    };

    // sample function to be called when clicking on an object in the chart
    $scope.doClick = function(value)
    {
	var pos;
        // sample just passes the object's ID then output it to the console and to an alert
        EditConcept.setEditMode($scope.mode);
	EditAssociation.setEditMode($scope.mode);
	if (value.substring(0, 1)=="n")
	{
	    for (i=0;i<$scope.Concepts.length;i++)
	    {
		    if ($scope.Concepts[i].Id==value.substring(1, value.length))
		    {
			EditConcept.setConcept($scope.Concepts[i]);
			pos=i;   
		    }
	    }
	    dlg = dialogs.create('/dialogs/editconcept.html','EditConceptController',{},{key: false,back: 'static'});
	    dlg.result.then(function(user){
	    if (user=="D")
	    {
	    	for (i=0;i<$scope.Associations.length;i++)
	    	{
		    if (($scope.Associations[i].sourceID == $scope.Concepts[pos].Id) || ($scope.Associations[i].destinationID == $scope.Concepts[pos].Id))
		    {
			for (j=i;j<$scope.Associations.length-1;j++)
			{
			    $scope.Associations[j] = $scope.Associations[j+1];
			    $scope.edgeData[j] = $scope.edgeData[j+1];
			}
			$scope.Associations.pop();
			$scope.edgeData.pop();
			i--;
		    }
	    	}

		for (i=pos;i<$scope.Concepts.length-1;i++)
		{
		    $scope.Concepts[i] = $scope.Concepts[i+1];
		    $scope.mapData[i] = $scope.mapData[i+1];
		}
		$scope.Concepts.pop();
		$scope.mapData.pop();
	    }
	    else
	    {
		// collecting data from the form
		$scope.Concepts[pos].title=user.title;
		$scope.Concepts[pos].description=user.description;
		$scope.Concepts[pos].scale=user.scale;

		$scope.mapData[pos].name=user.title;
	    }

		// broadcasting the event
		$rootScope.$broadcast('appChanged');
	    },function(){
	    	$scope.name = 'You decided not to enter in your name, that makes me sad.';
	    });
	}
	else
	{
	    for (i=0;i<$scope.Associations.length;i++)
	    {
		    if ($scope.Associations[i].Id==value.substring(1, value.length))
		    {
			EditAssociation.setAssociation($scope.Associations[i]);
			pos=i;   
		    }
	    }
	    dlg = dialogs.create('/dialogs/editassociation.html','EditAssociationController',{},{key: false,back: 'static'});
	    dlg.result.then(function(user){
	    if (user=="D")
	    {
	    	for (i=pos;i<$scope.Associations.length-1;i++)
	    	{
		    $scope.Associations[i] = $scope.Associations[i+1];
		    $scope.edgeData[i] = $scope.edgeData[i+1];
	    	}
		$scope.Associations.pop();
		$scope.edgeData.pop();
	    }
	    else
	    {
		// collecting data from the form
		$scope.Associations[pos].sourceID=user.source.Id;
		$scope.Associations[pos].source=user.source;
		$scope.Associations[pos].destinationID=user.destination.Id;
		$scope.Associations[pos].destination=user.destination;

		$scope.edgeData[pos].source=user.source.Id;
		$scope.edgeData[pos].target=user.destination.Id;
		$scope.edgeData[pos].weighted="?";
	    }

		// broadcasting the event
		$rootScope.$broadcast('appChanged');
	    },function(){
	    	$scope.name = 'You decided not to enter in your name, that makes me sad.';
	    });
	}
    };

    $scope.doMouseUp = function(value,posx,posy)
    {
	for (i=0;i<$scope.Concepts.length;i++)
	{
	    if ($scope.Concepts[i].Id==value.substring(1, value.length))
	    {
		$scope.Concepts[i].x=posx;
		$scope.Concepts[i].y=posy;
		$scope.mapData[i].posX=posx;
		$scope.mapData[i].posY=posy;
	    }
	}
    };
    // Fit the nodes in the Editor
    $scope.reset = function(){
        $rootScope.$broadcast('appChanged');
    };
})

.controller('ConceptController',function($scope, $modalInstance, Metric, FcmActivator, $log, $routeParams, data){
  $scope.user = {Id: -1, title: '', description: '', scale: '0', x: '300', y: '300'};

  $scope.cancel = function(){
    $modalInstance.dismiss('canceled');  
  }; // end cancel
  
  $scope.save = function(){
    $modalInstance.close($scope.user);
  }; // end save
  
}) // end ConceptController

.controller('EditConceptController',function($scope, $modalInstance, Metric, FcmActivator, $log, $routeParams, dialogs, data, EditConcept){
  $scope.user = {Id: -1, title: '', description: '', scale: '0', x: '300', y: '300'};
  $scope.user.Id = EditConcept.getConcept().Id;
  $scope.user.title = EditConcept.getConcept().title;
  $scope.user.description = EditConcept.getConcept().description;
  $scope.user.scale = EditConcept.getConcept().scale;
  $scope.user.x = EditConcept.getConcept().x;
  $scope.user.y = EditConcept.getConcept().y;

  var mode = EditConcept.getEditMode();

  $scope.cancel = function(){
    $modalInstance.dismiss('canceled');  
  }; // end cancel
  
  $scope.save = function(){
    $modalInstance.close($scope.user);
  }; // end save
  
  $scope.delete = function(){
        // Open a confirmation dialog
        var dlg = dialogs.confirm(
            "Are you sure?",
            "Do you want to delete this concept permanently? All associations of this concept will also deleted.");
        dlg.result.then(function () {
            // Delete the concept
    	    $modalInstance.close("D");
        });
  }; // end delete
  
}) // end ConceptController

.controller('AssociationController',function($scope, $modalInstance, data, ConceptsDetail){
  $scope.user = {Id: -1, sourceID: '', destinationID: '', source: '', destination: '', weight: '?'};
  
  $scope.Concepts = [];	
  $scope.Concepts = ConceptsDetail.getConcepts();

  $scope.cancel = function(){
    $modalInstance.dismiss('canceled');  
  }; // end cancel
  
  $scope.save = function(){
    $scope.user.sourceID=$scope.user.source.Id;
    $scope.user.destinationID=$scope.user.destination.Id;
    $modalInstance.close($scope.user);
  }; // end save
  
}) // end AssociationController

.controller('EditAssociationController',function($scope, $modalInstance, dialogs, data, ConceptsDetail, EditAssociation){
    $scope.user = {Id: -1, sourceID: '', destinationID: '', source: '', destination: '', weight: '?'};
    var mode = EditAssociation.getEditMode();
    $scope.user.Id = EditAssociation.getAssociation().Id;
    $scope.user.sourceID = EditAssociation.getAssociation().sourceID;
    $scope.user.destinationID = EditAssociation.getAssociation().destinationID;
  
    $scope.Concepts = [];	
    $scope.Concepts = ConceptsDetail.getConcepts();

    for (i=0;i<$scope.Concepts.length;i++)
    {
	if ($scope.Concepts[i].Id==$scope.user.sourceID)
	{
	$scope.user.source=$scope.Concepts[i];
	}
	if ($scope.Concepts[i].Id==$scope.user.destinationID)
	{
	$scope.user.destination=$scope.Concepts[i];
	}
    }

  $scope.cancel = function(){
    $modalInstance.dismiss('canceled');  
  }; // end cancel
  
  $scope.save = function(){
    $modalInstance.close($scope.user);
  }; // end save
  
  $scope.delete = function(){
        // Open a confirmation dialog
        var dlg = dialogs.confirm(
            "Are you sure?",
            "Do you want to delete this association permanently?");
        dlg.result.then(function () {
            // Delete the association
	    $modalInstance.close("D");
        });
  }; // end delete
  
}) // end AssociationController

.controller('ModelController',function($scope, $modalInstance, data, FCMModelsDetail){
  $scope.user = [ 
  {FCMModelId: -1}, 
  {title: ''}, 
  {description: ''}, 
  {keywords: ''}
  ];
  
  $scope.Models = [];	
  $scope.Models = FCMModelsDetail.getModels();

  $scope.cancel = function(){
    $modalInstance.dismiss('canceled');  
  }; // end cancel
  
  $scope.save = function(){
    $modalInstance.close($scope.user);
  }; // end save
  
}) // end ModelController

.controller('EditMetricsController',function($scope, $modalInstance, data, FCMModelsDetail){
  $scope.user = [ 
  {FCMModelId: -1}, 
  {title: ''}, 
  {description: ''}, 
  {keywords: ''}
  ];
  
  $scope.Models = [];	
  $scope.Models = FCMModelsDetail.getModels();

  $scope.cancel = function(){
    $modalInstance.dismiss('canceled');  
  }; // end cancel
  
  $scope.save = function(){
    $modalInstance.close($scope.user);
  }; // end save
  
}) // end EditMatricController

.controller('MetricsManagerController',function($scope, $modalInstance, data, FCMModelsDetail){

  $scope.cancel = function(){
    $modalInstance.dismiss('canceled');  
  }; // end cancel
  
  $scope.save = function(){
    $modalInstance.close($scope.user);
  }; // end save
  
}) // end MatricsManagerController

.controller('CorrelationMatrixController',function($scope, $modalInstance, data, ConceptsDetail){
  $scope.Concepts = [];	
  $scope.Concepts = ConceptsDetail.getConcepts();
  $scope.values1 = [];	
  $scope.values2 = [];	
  $scope.values3 = [];	
  $scope.values4 = [];	

  var val={Id: "1"};
  $scope.values1.push(val);	
  val={Id: ""};
  $scope.values1.push(val);	
  val={Id: ""};
  $scope.values1.push(val);	
  val={Id: ""};
  $scope.values1.push(val);	
  $scope.Concepts[0].values=$scope.values1;
  val={Id: "0.6"};
  $scope.values2.push(val);	
  val={Id: "1"};
  $scope.values2.push(val);	
  val={Id: ""};
  $scope.values2.push(val);	
  val={Id: ""};
  $scope.values2.push(val);	
  $scope.Concepts[1].values=$scope.values2;
  val={Id: "0.32"};
  $scope.values3.push(val);	
  val={Id: "-0.65"};
  $scope.values3.push(val);	
  val={Id: "1"};
  $scope.values3.push(val);	
  val={Id: ""};
  $scope.values3.push(val);	
  $scope.Concepts[2].values=$scope.values3;
  val={Id: "-0.54"};
  $scope.values4.push(val);	
  val={Id: "0.41"};
  $scope.values4.push(val);	
  val={Id: "0.23"};
  $scope.values4.push(val);	
  val={Id: "1"};
  $scope.values4.push(val);	
  $scope.Concepts[3].values=$scope.values4;

  $scope.cancel = function(){
    $modalInstance.dismiss('canceled');  
  }; // end cancel
  
  $scope.save = function(){
    $modalInstance.close($scope.user);
  }; // end save
  
}) // end CorrelationMatrixController

.controller('ImpactAnalysisController',function($scope, $modalInstance, data, ConceptsDetail){
  $scope.user = [{selectConcept: ''}, {selectConcept1: ''}, {selectConcept2: ''}, {selectConcept3: ''}];
  $scope.Concepts = [];	
  $scope.Concepts = ConceptsDetail.getConcepts();
  
  $scope.user.selectConcept = $scope.Concepts[0];
  $scope.user.selectConcept1 = $scope.Concepts[0];
  $scope.user.selectConcept2 = $scope.Concepts[1];
  $scope.user.selectConcept3 = $scope.Concepts[2];

    $scope.range = function(min,max,step) {
	step = step || 1;
	var input = [];
	for (var i=min;i<=max;i+=step)
	    input.push(i.toFixed(1));
	return input;
    };

  $scope.cancel = function(){
    $modalInstance.dismiss('canceled');  
  }; // end cancel
  
  $scope.save = function(){
    $modalInstance.close($scope.user);
  }; // end save
  
}) // end ImpactAnalysisController

.run(['$templateCache',function($templateCache){
  $templateCache.put('/dialogs/addconcept.html', '<div class="modal-header"><h4 class="modal-title">Add Concept</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="title">Title *</label><input type="text" class="form-control" name="title" id="title" ng-model="user.title" text="Vale here" required><br /><label class="control-label" for="description">Description *</label><textarea class="form-control" rows="5" name="description" id="description" ng-model="user.description" required></textarea><br /><label class="control-label" for="input">Scale *</label><input type="text" class="form-control" name="scale" id="scale" ng-model="user.scale" required></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Add</button></div>');

  $templateCache.put('/dialogs/editconcept.html', '<div class="modal-header"><h4 class="modal-title">Edit Concept</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="title">Title *</label><input type="text" class="form-control" name="title" id="title" ng-model="user.title" text="Vale here" required><br /><label class="control-label" for="description">Description *</label><textarea class="form-control" rows="5" name="description" id="description" ng-model="user.description" required></textarea><br /><label class="control-label" for="input">Scale *</label><input type="text" class="form-control" name="scale" id="scale" ng-model="user.scale" required></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Save</button><button type="button" class="btn btn-danger" ng-click="delete()">Delete</button></div>');

  $templateCache.put('/dialogs/addassociation.html', '<div class="modal-header"><h4 class="modal-title">Association</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="source">Source Concept *</label><select class="form-control" name="source" id="source" ng-model="user.source" ng-options="concept.title for concept in Concepts" required></select><br /><label class="control-label" for="destination">Destination Concept *</label><select class="form-control" name="destination" id="destination" ng-model="user.destination" ng-options="concept.title for concept in Concepts" required></select></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Add</button></div>');

  $templateCache.put('/dialogs/editassociation.html', '<div class="modal-header"><h4 class="modal-title">Edit Association</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="source">Source Concept *</label><select class="form-control" name="source" id="source" ng-model="user.source" ng-options="concept.title for concept in Concepts" required></select><br /><label class="control-label" for="destination">Destination Concept *</label><select class="form-control" name="destination" id="destination" ng-model="user.destination" ng-options="concept.title for concept in Concepts" required></select></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Save</button><button type="button" class="btn btn-danger" ng-click="delete()">Delete</button></div>');

  $templateCache.put('/dialogs/savemodel.html', '<div class="modal-header"><h4 class="modal-title">FCM Model</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="title">Policy Model Title *</label><input type="text" class="form-control" name="title" id="title" ng-model="user.title" text="Vale here" required><br /><label class="control-label" for="description">Description *</label><textarea class="form-control" rows="5" name="description" id="description" ng-model="user.description" required></textarea><br /><label class="control-label" for="keywords">Keywords : *</label><input type="text" class="form-control" name="keywords" id="keywords" ng-model="user.keywords" required><br /><label class="control-label" for="policyDomain">Policy Domain : *</label><select multiple class="form-control policydomain-options" id="policyDomain" name="policyDomain" ng-model="metric.policy_domains" required></select></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Save</button></div>');

  $templateCache.put('/dialogs/editmetrics.html', '<div class="modal-header"><h4 class="modal-title">Edit Metrics</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><div id="filterMetrics" class="selectorMetrics" metrics-list="ListMetricsFilter" number-Max-Metrics="1"></div></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Save</button></div>');

 $templateCache.put('/dialogs/metricsmanager.html', '<div class="modal-header"><h4 class="modal-title">Metrics Manager</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><tabset justified="false"><tab heading="Source"><div id="filterMetrics" class="selectorMetrics" metrics-list="ListMetricsFilter" number-Max-Metrics="1"></div></tab><tab heading="Sink"><div id="filterMetrics" class="selectorMetrics" metrics-list="ListMetricsFilter" number-Max-Metrics="1"></div></tab></tabset></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Save</button></div>');

 $templateCache.put('/dialogs/correlationmatrix.html', '<div class="modal-header"><h4 class="modal-title">Correlation Matrix between Concepts</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><p>Matrix below shows the correlation between selected concepts.<br>This can be the reference data for determining the weights between concepts if you want to insert the weight value manaully.</p></div><table class="table table-hover"><tr><td></td><td  align="center" ng-repeat="concept in Concepts">{{ concept.title }}</td></tr><tr ng-repeat="concept in Concepts"><td>{{ concept.title }}</td align="center"><td ng-repeat="val in concept.values">{{ val.Id }}</td></tr></table><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="save()">Use the Correlations for Weight</button><button type="button" class="btn btn-default" ng-click="cancel()">Close</button></div>');

 $templateCache.put('/dialogs/impactanalysis.html', '<div class="modal-header"><h4 class="modal-title">Impact Analysis</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><tabset justified="false"><tab heading="Impact of Single Concept"><label class="control-label" for="impactanalysis">Impact of Change in</label><select class="form-control" name="source" id="source" ng-model="user.selectConcept" ng-options="concept.title for concept in Concepts"></select>(initial concept value)<br /><br /><br /><table class="table table-hover"><tr><td width="20%"><b>Initial Value of {{ user.selectConcept.title }}</b></td><td align="center" ng-repeat="n in range(0.20,1.00,0.20)"><b>{{ n }}</b></td></tr><tr ng-show="Concepts" ng-repeat="concept in Concepts"><td>{{ concept.title }}</td><td align="center" ng-repeat="n in range(0.2,1.0,0.2)"></td></tr></table>* Value of each cell indicate the final value of simulation with given initial value of <b>{{ user.selectConcept.title }}</b>.</tab><tab heading="Impact of Two Concepts"><label class="control-label" for="impactanalysis">Impact of Change in</label><select class="form-control" name="source" id="source" ng-model="user.selectConcept1" ng-options="concept.title for concept in Concepts" required></select><label class="control-label" for="impactanalysis">and</label><select class="form-control" name="source" id="source" ng-model="user.selectConcept2" ng-options="concept.title for concept in Concepts" required></select>(initial concept value)<br /><label class="control-label" for="impactanalysis">on</label><select class="form-control" name="source" id="source" ng-model="user.selectConcept3" ng-options="concept.title for concept in Concepts" required></select><br /><br /><br /><table class="table table-hover"><tr><td width="20%"></td><td width="10%"></td><td align="center" colspan=5><b>{{ user.selectConcept1.title }}</b></td></tr><tr><td></td><td></td><td align="center" ng-repeat="n in range(0.20,1.00,0.20)"><b>{{ n }}</b></td></tr><tr><td rowspan=5 align="center" valign="middle"><b>{{ user.selectConcept2.title }}</b></td><td align="center"><b>0.2</b></td><td align="center" ng-repeat="n in range(0.20,1.00,0.20)"></td></tr><tr><td align="center"><b>0.4</b></td><td align="center" ng-repeat="n in range(0.20,1.00,0.20)"></td></tr><tr><td align="center"><b>0.6</b></td><td align="center" ng-repeat="n in range(0.20,1.00,0.20)"></td></tr><tr><td align="center"><b>0.8</b></td><td align="center" ng-repeat="n in range(0.20,1.00,0.20)"></td></tr><tr><td align="center"><b>1.0</b></td><td align="center" ng-repeat="n in range(0.20,1.00,0.20)"></td></tr></table>* Value of each cell indicate the final value of <b>{{ user.selectConcept3.title }}</b> with regards to the change of <b>{{ user.selectConcept1.title }}</b> & <b>{{ user.selectConcept2.title }}</b>.</tab></tabset></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Close</button></div>');

}]); // end run / module


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

.controller('CytoscapeCtrl', function($scope, $rootScope,  $routeParams, $location, $translate, Fcm, FcmModel, FcmSearchUpdate, FcmActivator, dialogs, FCMModelsDetail, ConceptsDetail, AssociationsDetail, EditConcept, EditAssociation){
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
	var model = {ModelID: $scope.modeldetail.model.fcmmodelID.toString(), 
	title: $scope.modeldetail.model.title.toString(), 
	description: $scope.modeldetail.model.description.toString(), 
	keywords: $scope.modeldetail.model.keywords.toString()};
	FCMModelsDetail.setModels(model);
	for (i=0; i<$scope.modeldetail.concepts.length; i++)
	{
	    var newNode = {id:$scope.modeldetail.concepts[i].conceptID.toString(), name:$scope.modeldetail.concepts[i].title, posX:$scope.modeldetail.concepts[i].positionX, posY:$scope.modeldetail.concepts[i].positionY};
	    var Concept = {Id: $scope.modeldetail.concepts[i].conceptID.toString(), title: $scope.modeldetail.concepts[i].title, description: $scope.modeldetail.concepts[i].description, input: $scope.modeldetail.concepts[i].input, activatorID: $scope.modeldetail.concepts[i].activatorID, activator: '', metricsID: $scope.modeldetail.concepts[i].metricID, metrics: '', fixedoutputID: $scope.modeldetail.concepts[i].fixedOutput, fixedoutput: '', x: $scope.modeldetail.concepts[i].positionX, y: $scope.modeldetail.concepts[i].positionY, dateAddedtoPC:$scope.modeldetail.concepts[i].dateAddedtoPC, dateModified:$scope.modeldetail.concepts[i].dateModified};
	    if (Concept.fixedoutputID==false)
	    {
		Concept.fixedoutput='False';
	    }
	    else
	    {
		Concept.fixedoutput='True';
	    }
	    for (j=0;j<$scope.Fcmactivators.length;j++)
	    {
		if ($scope.Fcmactivators[j].activatorID==Concept.activatorID)
		{
		    Concept.activator=$scope.Fcmactivators[j];
		}
	    }

	    $scope.mapData.push(newNode);
	    $scope.Concepts.push(Concept);
	}
	for (i=0; i<$scope.modeldetail.connections.length; i++)
	{
	    var newEdge = {id:$scope.modeldetail.connections[i].connectionID.toString(), source: $scope.modeldetail.connections[i].conceptFrom.toString(), target: $scope.modeldetail.connections[i].conceptTo.toString(), weighted: $scope.modeldetail.connections[i].weighted};
	    var Association = {Id: $scope.modeldetail.connections[i].connectionID.toString(), sourceID: $scope.modeldetail.connections[i].conceptFrom.toString(), source: '', destinationID: $scope.modeldetail.connections[i].conceptTo.toString(), destination: '', weight: $scope.modeldetail.connections[i].weighted};

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

    $scope.saveModel = function(){
	dlg = dialogs.create('/dialogs/savemodel.html','ModelController',{},{key: false,back: 'static'});
	dlg.result.then(function(user){
		$scope.Models.push(user);

		var jsonModel = {ModelTitle: user.title, ModelDesc: user.description, ModelKeywords: user.keywords, userID: "1",
			concepts: ConceptsDetail.getConcepts(), connections: AssociationsDetail.getAssociations()};

		$scope.fcmModel = new Fcm();
		$scope.fcmModel.data = jsonModel;

                Fcm.save($scope.fcmModel, function (value) {
			FcmSearchUpdate.create({id: value.model.fcmmodelID}, function () {			
				var dlg = dialogs.notify("FCM Model", "'" + user.title + "' FCM Model has been saved!");
                    	},
                    	function (err) {
                        	throw { message: err.data};
                    	});
			$scope.md = value;
			$location.path('/models/' + value.model.fcmmodelID + '/edit');
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
			FcmSearchUpdate.update({id: $routeParams.fcmId}, function () {			
				var dlg = dialogs.notify("FCM Model", "'" + value.model.title + "' FCM Model has been saved!");
                    	},
                    	function (err) {
                        	throw { message: err.data};
                    	});
			$scope.md = value;
                    },
                    function (err) {
                        throw { message: err.data};
                    }
                );
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
		$scope.Concepts[pos].input=user.input;
		$scope.Concepts[pos].activatorID=user.activator.activatorID;
		$scope.Concepts[pos].activator=user.activator;
		$scope.Concepts[pos].metricsID=user.metrics.id;
		$scope.Concepts[pos].metrics=user.metrics;
		$scope.Concepts[pos].fixedoutput=user.fixedoutput;
		if (user.fixedoutput=="True")
		{
		    $scope.Concepts[pos].fixedoutputID=1;
		}
		else
		{
		    $scope.Concepts[pos].fixedoutputID=0;
		}

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
		$scope.Associations[pos].weight=user.weight;

		$scope.edgeData[pos].source=user.source.Id;
		$scope.edgeData[pos].target=user.destination.Id;
		$scope.edgeData[pos].weighted=user.weight;
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
  $scope.user = {Id: -1, title: '', description: '', input: '0.0', activatorID: '', metricsID: 0, activator: '', metrics: '', fixedoutput: 'False', x: '300', y: '300'};

	$scope.metrics = Metric.query(
            {page_size: 100},
			function(metricList) {
			},
			function(error) {
                throw { message: JSON.stringify(err.data)};
			}
	);
  
	$scope.activators = FcmActivator.query({},
			function(activatorList) {
				for (i=0;i<activatorList.length;i++)
				{
					if ($scope.activators[i].title=="Sigmoid Activator")
					{
						$scope.user.activator=$scope.activators[i];
					}
				}
			},
			function(error) {
                throw { message: JSON.stringify(err.data)};
			}
	);

  $scope.cancel = function(){
    $modalInstance.dismiss('canceled');  
  }; // end cancel
  
  $scope.save = function(){
    $scope.user.activatorID=$scope.user.activator.activatorID;
    if ($scope.user.metrics=="")
    {
    	$scope.user.metricsID=0;
    }
    else
    {
    	$scope.user.metricsID=$scope.user.metrics.id;
    }
    $modalInstance.close($scope.user);
  }; // end save
  
}) // end ConceptController

.controller('EditConceptController',function($scope, $modalInstance, Metric, FcmActivator, $log, $routeParams, dialogs, data, EditConcept){
  $scope.user = {Id: -1, title: '', description: '', input: '0.0', activatorID: '', metricsID: '', activator: '', metrics: '', fixedoutput: 'False', x: '200', y: '100'};
  $scope.user.Id = EditConcept.getConcept().Id;
  $scope.user.title = EditConcept.getConcept().title;
  $scope.user.description = EditConcept.getConcept().description;
  $scope.user.input = EditConcept.getConcept().input;
  $scope.user.activatorID = EditConcept.getConcept().activatorID;
  $scope.user.metricsID = EditConcept.getConcept().metricsID;
  $scope.user.fixedoutputID = EditConcept.getConcept().fixedoutputID;
  $scope.user.x = EditConcept.getConcept().x;
  $scope.user.y = EditConcept.getConcept().y;

  var mode = EditConcept.getEditMode();

	$scope.metrics = Metric.query(
        {page_size: 100},
	function(metricList) {
//alert($scope.user.metrics);
//alert($scope.metrics[0]);
//alert(metricList.);
	    for (i=0;i<metricList.length;i++)
	    {
		if ($scope.metrics[i].metricID==$scope.user.metrics)
		{
		    $scope.user.metrics=$scope.metrics[i];
		}
	    }
	},
	function(error) {
	    throw { message: JSON.stringify(err.data)};
	}
	);
  
	$scope.activators = FcmActivator.query({},
	function(activatorList) {
	    for (i=0;i<activatorList.length;i++)
	    {
		if ($scope.activators[i].activatorID==$scope.user.activatorID)
		{
		    $scope.user.activator=$scope.activators[i];
		}
	    }
	},
	function(error) {
	    throw { message: JSON.stringify(err.data)};
	}
	);

    if (mode=="edit")
    {
	if ($scope.user.fixedoutputID==0)
	{
	    $scope.user.fixedoutput="False";
	}
	else
	{
	    $scope.user.fixedoutput="True";
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
            "Do you want to delete this concept permanently? All associations of this concept will also deleted.");
        dlg.result.then(function () {
            // Delete the concept
    	    $modalInstance.close("D");
        });
  }; // end delete
  
}) // end ConceptController

.controller('AssociationController',function($scope, $modalInstance, data, ConceptsDetail){
  $scope.user = {Id: -1, sourceID: '', destinationID: '', source: '', destination: '', weight: 0};
  
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
  $scope.user = {Id: -1, sourceID: '', destinationID: '', source: '', destination: '', weight: 0};
  var mode = EditAssociation.getEditMode();
  $scope.user.Id = EditAssociation.getAssociation().Id;
  $scope.user.sourceID = EditAssociation.getAssociation().sourceID;
  $scope.user.destinationID = EditAssociation.getAssociation().destinationID;
  $scope.user.weight = EditAssociation.getAssociation().weight;
  
  $scope.Concepts = [];	
  $scope.Concepts = ConceptsDetail.getConcepts();

	for (i=0;i<$scope.Concepts.length;i++)
	{
	    if (mode=="edit")
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
	    else
	    {
		if ($scope.Concepts[i].title==$scope.user.source.title)
		{
			$scope.user.source=$scope.Concepts[i];
		}
		if ($scope.Concepts[i].title==$scope.user.destination.title)
		{
			$scope.user.destination=$scope.Concepts[i];
		}
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

.run(['$templateCache',function($templateCache){
  $templateCache.put('/dialogs/addconcept.html', '<div class="modal-header"><h4 class="modal-title">Add Concept</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="title">Title :</label><input type="text" class="form-control" name="title" id="title" ng-model="user.title" text="Vale here" required><br /><label class="control-label" for="description">Description :</label><input type="text" class="form-control" name="description" id="description" ng-model="user.description" required><br /><label class="control-label" for="input">Input :</label><input type="text" class="form-control" name="input" id="input" ng-model="user.input" required><br /><label class="control-label" for="activator">Activator :</label><select class="form-control" name="activator" id="activator" ng-model="user.activator" ng-options="activator.title for activator in activators" required></select><br /><label class="control-label" for="metrics">Metrics :</label><select class="form-control" name="metrics" id="metrics" ng-model="user.metrics" ng-options="metric.title for metric in metrics.results"></select><br /><label class="control-label" for="fixedoutput">Fixed output :</label><select class="form-control" name="fixedoutput" id="fixedoutput" ng-model="user.fixedoutput" required><option value="True">True</option><option value="False">False</option></select></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Add</button></div>');

  $templateCache.put('/dialogs/editconcept.html', '<div class="modal-header"><h4 class="modal-title">Edit Concept</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="title">Title :</label><input type="text" class="form-control" name="title" id="title" ng-model="user.title" text="Vale here" required><br /><label class="control-label" for="description">Description :</label><input type="text" class="form-control" name="description" id="description" ng-model="user.description" required><br /><label class="control-label" for="input">Input :</label><input type="text" class="form-control" name="input" id="input" ng-model="user.input" required><br /><label class="control-label" for="activator">Activator :</label><select class="form-control" name="activator" id="activator" ng-model="user.activator" ng-options="activator.title for activator in activators" required></select><br /><label class="control-label" for="metrics">Metrics :</label><select class="form-control" name="metrics" id="metrics" ng-model="user.metrics" ng-options="metric.title for metric in metrics.results"></select><br /><label class="control-label" for="fixedoutput">Fixed output :</label><select class="form-control" name="fixedoutput" id="fixedoutput" ng-model="user.fixedoutput" required><option value="True">True</option><option value="False">False</option></select></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Save</button><button type="button" class="btn btn-danger" ng-click="delete()">Delete</button></div>');

  $templateCache.put('/dialogs/addassociation.html', '<div class="modal-header"><h4 class="modal-title">Association</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="source">Source Concept :</label><select class="form-control" name="source" id="source" ng-model="user.source" ng-options="concept.title for concept in Concepts" required></select><br /><label class="control-label" for="destination">Destination Concept :</label><select class="form-control" name="destination" id="destination" ng-model="user.destination" ng-options="concept.title for concept in Concepts" required></select><br /><label class="control-label" for="weight">Weight :</label><input type="text" class="form-control" name="weight" id="weight" ng-model="user.weight" required></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Add</button></div>');

  $templateCache.put('/dialogs/editassociation.html', '<div class="modal-header"><h4 class="modal-title">Edit Association</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="source">Source Concept :</label><select class="form-control" name="source" id="source" ng-model="user.source" ng-options="concept.title for concept in Concepts" required></select><br /><label class="control-label" for="destination">Destination Concept :</label><select class="form-control" name="destination" id="destination" ng-model="user.destination" ng-options="concept.title for concept in Concepts" required></select><br /><label class="control-label" for="weight">Weight :</label><input type="text" class="form-control" name="weight" id="weight" ng-model="user.weight" required></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Save</button><button type="button" class="btn btn-danger" ng-click="delete()">Delete</button></div>');

  $templateCache.put('/dialogs/savemodel.html', '<div class="modal-header"><h4 class="modal-title">FCM Model</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="title">Policy Model Title :</label><input type="text" class="form-control" name="title" id="title" ng-model="user.title" text="Vale here" required><br /><label class="control-label" for="description">Description :</label><input type="text" class="form-control" name="description" id="description" ng-model="user.description" required><br /><label class="control-label" for="keywords">Keywords :</label><input type="text" class="form-control" name="keywords" id="keywords" ng-model="user.keywords" required></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Save</button></div>');
}]); // end run / module


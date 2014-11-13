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

.controller('CytoscapeCtrl', function($scope, $rootScope,  $routeParams, $location, $translate, Fcm, FcmModel, FcmSearchUpdate, dialogs, FCMModelsDetail, ConceptsDetail, AssociationsDetail){
  // container objects
  $scope.Models = [];
  $scope.mapData = [];
  $scope.edgeData = [];
  $scope.Concepts = [];
  $scope.Associations = [];

  FCMModelsDetail.setModels($scope.Models);
  ConceptsDetail.setConcepts($scope.Concepts);
  AssociationsDetail.setAssociations($scope.Associations);

if ($routeParams.fcmId)
{
    // Mode is editing
    $scope.mode = "edit";

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
	    var newNode = {id:$scope.modeldetail.concepts[i].conceptID.toString(), name:$scope.modeldetail.concepts[i].title};
	    $scope.mapData.push(newNode);
	    $scope.Concepts.push($scope.modeldetail.concepts[i]);
	}
	for (i=0; i<$scope.modeldetail.connections.length; i++)
	{
		    var newEdge = {id:$scope.modeldetail.connections[i].connectionID.toString(), source: $scope.modeldetail.connections[i].conceptFrom.toString(), target: $scope.modeldetail.connections[i].conceptTo.toString(), weighted: $scope.modeldetail.connections[i].weighted};
	    $scope.edgeData.push(newEdge);
	    $scope.Associations.push($scope.modeldetail.connections[i]);
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
			FcmSearchUpdate.create({id: $routeParams.fcmId}, $scope.fcmModel, function () {			
				var dlg = dialogs.notify("FCM Model", "'" + user.title + "' FCM Model has been saved!");
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
		// Mode is editing
		$scope.mode = "edit";
        },function(){
          $scope.name = 'You decided not to enter in your name, that makes me sad.';
        });
    };

    $scope.updateModel = function(){
		var jsonModel = {model: FCMModelsDetail.getModels(),
			concepts: ConceptsDetail.getConcepts(), connections: AssociationsDetail.getAssociations()};

		$scope.fcmModelUpdate = new FcmModel();
		$scope.fcmModelUpdate.data = jsonModel;

                FcmModel.update({id: $routeParams.fcmId}, $scope.fcmModelUpdate, function (value) {
			FcmSearchUpdate.update({id: $routeParams.fcmId}, $scope.fcmModel, function () {			
				var dlg = dialogs.notify("FCM Model", "'" + jsonModel.model.title + "' FCM Model has been saved!");
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
		user.Id = 'n'+($scope.mapData.length);
//		var newObjType = $scope.form.obj.objTypes;
		// building the new Node object
		// using the array length to generate an id for the sample (you can do it any other way)
	//        var newNode = {id:'n'+($scope.mapData.length), name:newObj, type:newObjType};
		var newNode = {id:'n'+($scope.mapData.length), name:newObj, x:user.x, y:user.y};
		// adding the new Node to the nodes array
		$scope.mapData.push(newNode);
		$scope.Concepts.push(user);		
		// broadcasting the event
		$rootScope.$broadcast('appChanged');
		// resetting the form
//		$scope.form.obj = '';
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
//		$scope.formEdges = '';
        },function(){
          $scope.name = 'You decided not to enter in your name, that makes me sad.';
        });
    };

    // sample function to be called when clicking on an object in the chart
    $scope.doClick = function(value)
    {
        // sample just passes the object's ID then output it to the console and to an alert
        console.debug(value);
	alert(value);
    };

    // reset the sample nodes
    $scope.reset = function(){
        $scope.mapData = [];
        $scope.edgeData = [];
        $rootScope.$broadcast('appChanged');
    };
})

.controller('ConceptController',function($scope, $modalInstance, Metric, $log, $routeParams, data, ConceptsDetail){
  $scope.user = {Id: -1, title: '', description: '', input: '', activetor: '', metrics: '', fixedoutput: '', x: '200', y: '100'};

	$scope.metrics = Metric.query(
            {page_size: 100},
			function(metricList) {
			},
			function(error) {
                throw { message: JSON.stringify(err.data)};
			}
	);
  
  $scope.cancel = function(){
    $modalInstance.dismiss('canceled');  
  }; // end cancel
  
  $scope.save = function(){
    $modalInstance.close($scope.user);
  }; // end save
  
}) // end ConceptController

.controller('AssociationController',function($scope, $modalInstance, data, ConceptsDetail){
  $scope.user = {Id: -1, source: '', destination: '', weight: 0};
  
  $scope.Concepts = [];	
  $scope.Concepts = ConceptsDetail.getConcepts();

  
  $scope.cancel = function(){
    $modalInstance.dismiss('canceled');  
  }; // end cancel
  
  $scope.save = function(){
    $modalInstance.close($scope.user);
  }; // end save
  
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
  $templateCache.put('/dialogs/addconcept.html', '<div class="modal-header"><h4 class="modal-title">Add Concept</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="title">Title :</label><input type="text" class="form-control" name="title" id="title" ng-model="user.title" text="Vale here" required><br /><label class="control-label" for="description">Description :</label><input type="text" class="form-control" name="description" id="description" ng-model="user.description"><br /><label class="control-label" for="input">Input :</label><input type="text" class="form-control" name="input" id="input" ng-model="user.input"><br /><label class="control-label" for="activetor">Activetor :</label><select class="form-control" name="activetor" id="activetor" ng-model="user.activetor" value="Select..."></select><br /><label class="control-label" for="metrics">Metrics :</label><select class="form-control" name="metrics" id="metrics" ng-model="user.metrics" ng-options="metric.title for metric in metrics.results"></select><br /><label class="control-label" for="fixedoutput">Fixed output :</label><select class="form-control" name="fixedoutput" id="fixedoutput" ng-model="user.fixedoutput" value="Select..."></select></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Add</button></div>');

  $templateCache.put('/dialogs/addassociation.html', '<div class="modal-header"><h4 class="modal-title">Association</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="source">Source Concept :</label><select class="form-control" name="source" id="source" ng-model="user.source" ng-options="concept.title for concept in Concepts" required></select><br /><label class="control-label" for="destination">Destination Concept :</label><select class="form-control" name="destination" id="destination" ng-model="user.destination" ng-options="concept.title for concept in Concepts" required></select><br /><label class="control-label" for="weight">Weight :</label><input type="text" class="form-control" name="weight" id="weight" ng-model="user.weight" required></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Add</button></div>');

  $templateCache.put('/dialogs/savemodel.html', '<div class="modal-header"><h4 class="modal-title">FCM Model</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="title">Policy Model Title :</label><input type="text" class="form-control" name="title" id="title" ng-model="user.title" text="Vale here" required><br /><label class="control-label" for="description">Description :</label><input type="text" class="form-control" name="description" id="description" ng-model="user.description" required><br /><label class="control-label" for="keywords">Keywords :</label><input type="text" class="form-control" name="keywords" id="keywords" ng-model="user.keywords" required></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Save</button></div>');
}]); // end run / module


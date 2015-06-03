angular.module('pcApp.fcm.controllers.fcm', [
    'pcApp.fcm.services.fcm'
])

.factory('FcmControllerHelper', [function () {
    return {
        baseCreateEditController: function ($scope) {

        }
    };
}])


.controller('FcmController', [
    '$scope',
    'Fcm',
    '$log',
    '$routeParams',
    function ($scope, Fcm, $log, $routeParams) {

    $scope.models = Fcm.query(
        {page: $routeParams.page},
        function (fcmList) {

        },
        function (error) {
            throw { message: JSON.stringify(err.data)};
        }
    );
    }])

.controller('FcmDetailController', [
    '$scope',
    '$rootScope', 
    '$routeParams',
    '$location',
    'FcmModel',
    'FcmActivator',
    'FcmSearchDelete',
    'dialogs',
    '$log',
    function ($scope, $rootScope, $routeParams, $location, FcmModel, FcmActivator, FcmSearchDelete, dialogs, $log) {
	$scope.mapData = [];
	$scope.edgeData = [];
  	$scope.Concepts = [];
	$scope.editorLayout;
	
	$scope.models = FcmModel.get(
	    {id: $routeParams.fcmId},
	    function (fcmList) {
		for (i=0; i<$scope.models.concepts.length; i++)
		{
		    var newNode = {id:$scope.models.concepts[i].id.toString(), name:$scope.models.concepts[i].title, posX:$scope.models.concepts[i].positionX, posY:$scope.models.concepts[i].positionY};
	    	    var Concept = {Id: $scope.models.concepts[i].id.toString(), title: $scope.models.concepts[i].title, description: $scope.models.concepts[i].description, input: $scope.models.concepts[i].scale, x: $scope.models.concepts[i].positionX, y: $scope.models.concepts[i].positionY, dateAddedtoPC:$scope.models.concepts[i].dateAddedtoPC, dateModified:$scope.models.concepts[i].dateModified};

		    $scope.mapData.push(newNode);
		    $scope.Concepts.push(Concept);
		}
		for (i=0; i<$scope.models.connections.length; i++)
		{
		    var newEdge = {id:$scope.models.connections[i].id.toString(), source: $scope.models.connections[i].conceptFrom.toString(), target: $scope.models.connections[i].conceptTo.toString(), weighted: '?'};
		    $scope.edgeData.push(newEdge);
		}
		
		// broadcasting the event
		$rootScope.$broadcast('appChanged');
	    },
	    function (error) {
	        throw { message: JSON.stringify(err.data)};
	    }
	);

    // Function for deleting the FCM Model
    $scope.deleteModel = function(model) {
        // Open a confirmation dialog
        var dlg = dialogs.confirm(
            "Are you sure?",
            "Do you want to delete the FCM model '" + model.title + "' permanently?");
        dlg.result.then(function () {
            // Delete the model via the API
            FcmSearchDelete.delete({id: $routeParams.fcmId}, function() {
                });
            FcmModel.delete({id: $routeParams.fcmId}, function() {
                    $location.path('/browse');
                }
            );
        });
    };
    }])

.controller('FcmCreateController', [
    '$scope',
    'Fcm',
    '$location',
    '$log',
    'FcmControllerHelper',
    function ($scope, Metric, $location, $log, helper) {

        helper.baseCreateEditController($scope);

    }])

.controller('FcmEditController', [
    '$scope',
    '$routeParams',
    'Fcm',
    '$location',
    '$log',
    'FcmControllerHelper',
    function ($scope, $routeParams, Metric, $location, $log, helper) {

        helper.baseCreateEditController($scope);

    }]);



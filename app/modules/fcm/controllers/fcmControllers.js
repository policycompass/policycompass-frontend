angular.module('pcApp.fcm.controllers.fcm', [
    'pcApp.fcm.services.fcm'
])

    .factory('FcmControllerHelper', [
        function () {
            return {
                baseCreateEditController: function ($scope) {

                }
            };
        }
    ])


    .controller('FcmController', [
        '$scope', 'Fcm', '$log', '$routeParams', function ($scope, Fcm, $log, $routeParams) {

            $scope.models = Fcm.query({page: $routeParams.page}, function (fcmList) {

            }, function (error) {
                throw {message: JSON.stringify(err.data)};
            });
        }
    ])

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
        function ($scope, $rootScope, $routeParams, $location, FcmModel, FcmActivator, Dataset, FcmSearchDelete, dialogs, $log) {
            $scope.mapData = [];
            $scope.edgeData = [];
            $scope.Concepts = [];
        	$scope.Associations = [];
		    $scope.SimulationConcepts = [];
		    $scope.SimulationAssociations = [];
		    $scope.SimulationResults = [];
		    $scope.dataset = [];
		    $scope.labels = [];
            $scope.editorLayout;
		    $scope.showLegend = true;
		    $scope.showLabels = true;
		    $scope.showLines = true;
		    $scope.showAreas = true;
		    $scope.showPoints = true;
		    $scope.showGrid = true;
		    $scope.showXAxes = true;
		    $scope.showYAxes = true;
		    $scope.showAsPercentatge = false;
		    $scope.xaxeformat = 'sequence';
		    $scope.mode = 'view';
		    $scope.chartid = '2';
		    $scope.hideyaxeunits = true;
		    $scope.NodeID = 0;

            $scope.modeldetail = FcmModel.get({id: $routeParams.fcmId}, function (fcmList) {
                for (i = 0; i < $scope.modeldetail.concepts.length; i++) {
                    var newNode = {
                        id: $scope.modeldetail.concepts[i].id.toString(),
                        name: $scope.modeldetail.concepts[i].title,
                        posX: $scope.modeldetail.concepts[i].positionX,
                        posY: $scope.modeldetail.concepts[i].positionY
                    };
                    var Concept = {
                        Id: $scope.modeldetail.concepts[i].id.toString(),
                        title: $scope.modeldetail.concepts[i].title,
                        description: $scope.modeldetail.concepts[i].description,
                        scale: $scope.modeldetail.concepts[i].scale,
                        value: $scope.modeldetail.concepts[i].value,
                        metric_id: $scope.modeldetail.concepts[i].metric_id,
                        x: $scope.modeldetail.concepts[i].positionX,
                        y: $scope.modeldetail.concepts[i].positionY,
                        dateAddedtoPC: $scope.modeldetail.concepts[i].dateAddedtoPC,
                        dateModified: $scope.modeldetail.concepts[i].dateModified
                    };
                    var SimulationConcept = {
                        Id: $scope.modeldetail.concepts[i].id.toString(),
                        title: $scope.modeldetail.concepts[i].title,
                        description: $scope.modeldetail.concepts[i].description,
                        scale: $scope.modeldetail.concepts[i].scale,
                        value: $scope.modeldetail.concepts[i].value,
                        fixedoutput: 'False',
                        metricId: $scope.modeldetail.concepts[i].metric_id,
                        metricTitle: '',
                        individuals: []
                    };

                    $scope.mapData.push(newNode);
                    $scope.Concepts.push(Concept);
                    $scope.SimulationConcepts.push(SimulationConcept);
                }
                for (i = 0; i < $scope.modeldetail.connections.length; i++) {
                    var newEdge = {
                        id: $scope.modeldetail.connections[i].id.toString(),
                        source: $scope.modeldetail.connections[i].conceptFrom.toString(),
                        target: $scope.modeldetail.connections[i].conceptTo.toString(),
                        weighted: $scope.modeldetail.connections[i].weight.toString()
                    };
                    var Association = {
                        Id: $scope.modeldetail.connections[i].id.toString(),
                        sourceID: $scope.modeldetail.connections[i].conceptFrom.toString(),
                        source: '',
                        destinationID: $scope.modeldetail.connections[i].conceptTo.toString(),
                        destination: '',
                        weighted: $scope.modeldetail.connections[i].weight.toString()
                    };
                    var SimulationAssociation = {
                        Sno: i + 1,
                        Id: $scope.modeldetail.connections[i].id.toString(),
                        sourceID: $scope.modeldetail.connections[i].conceptFrom.toString(),
                        source: '',
                        destinationID: $scope.modeldetail.connections[i].conceptTo.toString(),
                        destination: '',
                        weighted: $scope.modeldetail.connections[i].weight.toString()
                    };

                    for (j = 0; j < $scope.Concepts.length; j++) {
                        if (Association.sourceID == $scope.Concepts[j].Id)
                            Association.source = $scope.Concepts[j];
                        if (Association.destinationID == $scope.Concepts[j].Id)
                            Association.destination = $scope.Concepts[j];
                    }
                    SimulationAssociation.source = Association.source;
                    SimulationAssociation.destination = Association.destination;

                    $scope.edgeData.push(newEdge);
                    $scope.Associations.push(Association);
                    $scope.SimulationAssociations.push(SimulationAssociation);
                }

                var metricVal = [];
                var val = 0;
                for (i = 0; i < $scope.SimulationConcepts.length; i++) {
                    var fixedOutput = 'True';
                    for (j = 0; j < $scope.SimulationAssociations.length; j++)
                        if ($scope.SimulationAssociations[j].destinationID == $scope.SimulationConcepts[i].Id)
                            fixedOutput = 'False';
                    $scope.SimulationConcepts[i].fixedoutput = fixedOutput;

//                    if ($scope.SimulationConcepts[i].metricId != 0) {
//                        metricVal.push(i);
//                        Dataset.get({id: $scope.SimulationConcepts[i].metricId}, function (dataset) {
//                            $scope.SimulationConcepts[metricVal[val]].metricTitle = dataset.title;
//                            val = val + 1;
//                        }, function (error) {
//                            throw {message: JSON.stringify(error.data)};
//                        });
//                    }
                }

		        $scope.SimulationResults.splice(0, $scope.SimulationResults.length);
		        $scope.dataset.splice(0, $scope.dataset.length);
		        $scope.labels.splice(0, $scope.labels.length);

                for (i = 0; i < $scope.modeldetail.simulationResults.length; i++) {
                    var ConceptResults = {
                        Id: $scope.modeldetail.simulationResults[i].id.toString(),
                        iterationID: $scope.modeldetail.simulationResults[i].iteration_id.toString(),
                        conceptID: $scope.modeldetail.simulationResults[i].conceptID.toString(),
                        output: $scope.modeldetail.simulationResults[i].output.toString()
                    };

                    $scope.SimulationResults.push(ConceptResults);
                }

                $scope.totalIteration = $scope.modeldetail.simulationResults[$scope.modeldetail.simulationResults.length - 1].iteration_id;

                for (i = 0; i < $scope.SimulationConcepts.length; i++) {
                    var iteration = [];
                    var output = [];

                    for (j = 0; j < $scope.modeldetail.simulationResults.length; j++) {
                        if ($scope.modeldetail.simulationResults[j].conceptID == $scope.SimulationConcepts[i].Id) {
                            if ($scope.modeldetail.simulationResults[j].iteration_id < 10)
                                iteration.push("0" + $scope.modeldetail.simulationResults[j].iteration_id.toString()); else
                                iteration.push($scope.modeldetail.simulationResults[j].iteration_id.toString());
                            output.push($scope.modeldetail.simulationResults[j].output);
                        }
                    }
                    var data = {
                        Key: $scope.SimulationConcepts[i].title,
                        ValueX: iteration,
                        ValueY: output,
                        Type: "FCM"
                    };
                    $scope.dataset.push(data);
                    $scope.labels.push("");
				}
                // broadcasting the event
                $rootScope.$broadcast('appChanged');
            }, function (error) {
                throw {message: JSON.stringify(error.data)};
            });

            // Function for deleting the FCM Model
            $scope.deleteModel = function (model) {
                // Open a confirmation dialog
                var dlg = dialogs.confirm("Are you sure?", "Do you want to delete the FCM model '" + model.title + "' permanently?");
                dlg.result.then(function () {
                    // Delete the model via the API
                    FcmSearchDelete.delete({id: $routeParams.fcmId}, function () {
                    });
                    FcmModel.delete({id: $routeParams.fcmId}, function () {
                        $location.path('/browse');
                    });
                });
            };

		    $scope.range = function (min, max, step) {
		        step = step || 1;
		        var input = [];
		        for (var i = min; i <= max; i += step)
		            input.push(i.toFixed(1));
		        return input;
		    };

        }
    ])

    .controller('FcmCreateController', [
        '$scope',
        'Fcm',
        '$location',
        '$log',
        'FcmControllerHelper',
        function ($scope, Metric, $location, $log, helper) {

            helper.baseCreateEditController($scope);

        }
    ])

    .controller('FcmEditController', [
        '$scope',
        '$routeParams',
        'Fcm',
        '$location',
        '$log',
        'FcmControllerHelper',
        function ($scope, $routeParams, Metric, $location, $log, helper) {

            helper.baseCreateEditController($scope);

        }
    ]);



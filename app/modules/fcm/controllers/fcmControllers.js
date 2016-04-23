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

            }, function (err) {
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
        'FcmSearchUpdate',
        'Auth',
        function ($scope, $rootScope, $routeParams, $location, FcmModel, FcmActivator, FcmSearchDelete, dialogs, $log, FcmSearchUpdate, Auth) {
            $scope.mapData = [];
            $scope.edgeData = [];
            $scope.Concepts = [];
            $scope.updateModels = {};
            $scope.updateAssociations = [];
            $scope.updateConcepts = [];
            $scope.editorLayout;

            $scope.user = Auth;

            $scope.models = FcmModel.get({id: $routeParams.fcmId}, function (fcmList) {
                for (i = 0; i < $scope.models.concepts.length; i++) {
                    var newNode = {
                        id: $scope.models.concepts[i].id.toString(),
                        name: $scope.models.concepts[i].title.length > 24 ? //Showing ... if text exceeds the limit to show
                            ($scope.models.concepts[i].title.substring(0, 21) + '...') : $scope.models.concepts[i].title,
                        posX: $scope.models.concepts[i].positionX,
                        posY: $scope.models.concepts[i].positionY
                    };
                    var Concept = {
                        Id: $scope.models.concepts[i].id.toString(),
                        title: $scope.models.concepts[i].title,
                        description: $scope.models.concepts[i].description,
                        input: $scope.models.concepts[i].scale,
                        x: $scope.models.concepts[i].positionX,
                        y: $scope.models.concepts[i].positionY,
                        dateAddedtoPC: $scope.models.concepts[i].dateAddedtoPC,
                        dateModified: $scope.models.concepts[i].dateModified
                    };

                    $scope.mapData.push(newNode);
                    $scope.Concepts.push(Concept);
                }
                for (i = 0; i < $scope.models.connections.length; i++) {
                    var newEdge = {
                        id: $scope.models.connections[i].id.toString(),
                        source: $scope.models.connections[i].conceptFrom.toString(),
                        target: $scope.models.connections[i].conceptTo.toString(),
                        weighted: $scope.models.connections[i].weight.toString()
                    };
                    $scope.edgeData.push(newEdge);
                }

                $scope.setUpdateModelValues($scope.models);

                // broadcasting the event
                $rootScope.$broadcast('appChanged');
            }, function (err) {
                throw {message: JSON.stringify(err.data)};
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

            $scope.doMouseUp = function (value, posx, posy) {
                for (i = 0; i < $scope.Concepts.length; i++) {
                    if ($scope.updateConcepts[i].Id == value.substring(1, value.length)) {
                        $scope.updateConcepts[i].x = posx;
                        $scope.updateConcepts[i].y = posy;
                    }
                }
            };

            //Showing tooltip message
            $scope.doMouseOver = function (value, posx, posy) {
                for (i = 0; i < $scope.Concepts.length; i++) {
                    if ($scope.Concepts[i].Id == value.substring(1, value.length) && $scope.Concepts[i].title.length > 24) {
                        $('#tooltipTarget').trigger('customEvent');
                        $('.tooltip-inner').html($scope.Concepts[i].title);//changing text of tooltip
                        $('.tooltip-inner').css('max-width', 'none');
                        $('.tooltip.top').css({ top: (posy - 50), left: (posx - 100) })
                    }
                }
            };

            //Hiding tooltip message
            $scope.doMouseOut = function (value, posx, posy) {
                if ($('.tooltip-inner').length != 0)//check is tooltip is showing or not
                    $('#tooltipTarget').trigger('customEvent');
            };

            $scope.setUpdateModelValues = function(model) {
                $scope.updateModels = {
                    ModelID : model.model.id.toString(),
                    description : model.model.description,
                    keywords : model.model.keywords,
                    title : model.model.title
                };

                for (i = 0; i < model.connections.length; i++) {
                    var Association = {
                        Id: model.connections[i].id.toString(),
                        sourceID: model.connections[i].conceptFrom.toString(),
                        source: '',
                        destinationID: model.connections[i].conceptTo.toString(),
                        destination: '',
                        weighted: model.connections[i].weight.toString()
                    };

                    for (j = 0; j < $scope.Concepts.length; j++) {
                        if (Association.sourceID == $scope.Concepts[j].Id)
                            Association.source =$scope.Concepts[j];
                        if (Association.destinationID == $scope.Concepts[j].Id)
                            Association.destination = $scope.Concepts[j];
                    }
                    $scope.updateAssociations.push(Association);
                }

                for (i = 0; i < model.concepts.length; i++) {
                    var updateConcepts = {
                        Id: model.concepts[i].id.toString(),
                        dateAddedtoPC: model.concepts[i].dateAddedtoPC,
                        dateModified: model.concepts[i].dateModified,
                        description: model.concepts[i].description,
                        metric_id : model.concepts[i].metric_id,
                        scale: model.concepts[i].scale,
                        title: model.concepts[i].title,
                        value : model.concepts[i].value,
                        x: model.concepts[i].positionX,
                        y: model.concepts[i].positionY,
                    };
                    $scope.updateConcepts.push(updateConcepts);
                }
            }

            $scope.updateModel = function () {

                var jsonModel = {
                    model : $scope.updateModels,
                    userID: "1",
                    concepts : $scope.updateConcepts,
                    connections : $scope.updateAssociations
                }

                $scope.fcmModelUpdate = new FcmModel();
                $scope.fcmModelUpdate.data = jsonModel;
                $scope.md = jsonModel;
                FcmModel.update({id: $routeParams.fcmId}, $scope.fcmModelUpdate, function (value) {
                    FcmSearchUpdate.update({id: $routeParams.fcmId}, function () {
                        $location.path('/models/' + $routeParams.fcmId + '/edit');
                    });
                });
            };

//            $scope.updateModel();
        }
    ])

    .controller('FcmCreateController', [
        '$scope',
        'Fcm',
        '$location',
        '$log',
        'FcmControllerHelper',
        'Auth',
        function ($scope, Metric, $location, $log, helper, Auth) {
            $scope.user = Auth;
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
        'Auth',
        function ($scope, $routeParams, Metric, $location, $log, helper, Auth) {
            $scope.user = Auth;
            helper.baseCreateEditController($scope);

        }
    ]);


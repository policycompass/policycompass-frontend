angular.module('pcApp.fcm.controllers.cytoscapes', [])

    .service("ConceptsDetail", function () {
        var Concepts = [];

        return {
            setConcepts: function (ConceptObj) {
                Concepts = ConceptObj;
            },
            getConcepts: function () {
                return Concepts;
            },
        };
    })

    .service("SimulationConceptsDetail", function () {
        var Concepts = [];

        return {
            setConcepts: function (ConceptObj) {
                Concepts = ConceptObj;
            },
            getConcepts: function () {
                return Concepts;
            },
        };
    })

    .service("AssociationsDetail", function () {
        var Associations = [];

        return {
            setAssociations: function (AssociationObj) {
                Associations = AssociationObj;
            },
            getAssociations: function () {
                return Associations;
            },
        };
    })

    .service("SimulationAssociationsDetail", function () {
        var Associations = [];

        return {
            setAssociations: function (AssociationObj) {
                Associations = AssociationObj;
            },
            getAssociations: function () {
                return Associations;
            },
        };
    })

    .service("FCMModelsDetail", function () {
        var Models = [];

        return {
            setModels: function (ModelObj) {
                Models = ModelObj;
            },
            getModels: function () {
                return Models;
            },
        };
    })

    .service("FCMActivatorDetail", function () {
        var Activator = [];

        return {
            setActivator: function (ActivatorObj) {
                Activator = ActivatorObj;
            },
            getActivator: function () {
                return Activator;
            },
        };
    })

    .service("EditConcept", function () {
        var Concept;
        var EditMode;

        return {
            setConcept: function (ConceptObj) {
                Concept = ConceptObj;
            },
            getConcept: function () {
                return Concept;
            },
            setEditMode: function (EditModeObj) {
                EditMode = EditModeObj;
            },
            getEditMode: function () {
                return EditMode;
            },
        };
    })

    .service("EditAssociation", function () {
        var Association;
        var EditMode;

        return {
            setAssociation: function (AssociationObj) {
                Association = AssociationObj;
            },
            getAssociation: function () {
                return Association;
            },
            setEditMode: function (EditModeObj) {
                EditMode = EditModeObj;
            },
            getEditMode: function () {
                return EditMode;
            },
        };
    })

    .controller('CytoscapeCtrl', function ($scope, $rootScope, $window, $routeParams, $location, $translate, Fcm, FcmModel, FcmSimulation, FcmActivator, FcmSearchUpdate, dialogs, FCMModelsDetail, ConceptsDetail, SimulationConceptsDetail, AssociationsDetail, SimulationAssociationsDetail, EditConcept, EditAssociation, FCMActivatorDetail, Dataset, FcmIndicator) {
        // container objects
        $scope.Models = [];
        $scope.mapData = [];
        $scope.edgeData = [];
        $scope.Concepts = [];
        $scope.Activator = [];
        $scope.SimulationConcepts = [];
        $scope.Associations = [];
        $scope.SimulationAssociations = [];
        $scope.isDisabled = true;
        $scope.SimulationResults = [];
        $scope.dataset = [];
        $scope.labels = [];
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
        $scope.isModelSaved = true;


        FCMModelsDetail.setModels($scope.Models);
        ConceptsDetail.setConcepts($scope.Concepts);
        AssociationsDetail.setAssociations($scope.Associations);
        SimulationConceptsDetail.setConcepts($scope.SimulationConcepts);
        SimulationAssociationsDetail.setAssociations($scope.SimulationAssociations);
        FCMActivatorDetail.setActivator($scope.Activator);

        $scope.Fcmactivators = FcmActivator.query({}, function (activatorList) {
            for (i = 0; i < activatorList.length; i++) {
                if (activatorList[i].title == "Sigmoid Activator") {
                    $scope.Activator.push(activatorList[i]);
                }
            }
        }, function (error) {
            throw { message: JSON.stringify(error.data) };
        });

        if ($routeParams.fcmId) {
            // Mode is editing
            $scope.mode = "edit";

            $scope.modeldetail = FcmModel.get({ id: $routeParams.fcmId }, function (fcmList) {
                var model = {
                    ModelID: $scope.modeldetail.model.id.toString(),
                    title: $scope.modeldetail.model.title.toString(),
                    description: $scope.modeldetail.model.description.toString(),
                    keywords: $scope.modeldetail.model.keywords.toString()
                };
                FCMModelsDetail.setModels(model);
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
                        scale: $scope.modeldetail.concepts[i].scale,
                        value: $scope.modeldetail.concepts[i].value,
                        fixedoutput: 'False',
                        metricId: $scope.modeldetail.concepts[i].metric_id,
                        metricTitle: 'Link Datasets',
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

                    if ($scope.SimulationConcepts[i].metricId != 0) {
                        metricVal.push(i);
                        Dataset.get({ id: $scope.SimulationConcepts[i].metricId }, function (dataset) {
                            $scope.SimulationConcepts[metricVal[val]].metricTitle = dataset.title;
                            val = val + 1;
                        }, function (error) {
                            throw { message: JSON.stringify(error.data) };
                        });
                    }
                }

                if ($scope.Concepts.length > 1)
                    $scope.isDisabled = false; else
                    $scope.isDisabled = true;

                // broadcasting the event
                $rootScope.$broadcast('appChanged');
            }, function (error) {
                throw { message: JSON.stringify(error.data) };
            });

        } else {
            // Mode is creation
            $scope.mode = "create";
        }


        $scope.showHelp = function (helpId) {
            if (helpId == 1) {
                $scope.helpContents = "First, add appropriate concepts for you causal model (click \"Add Concept\"),<br>Second, create relationship (causal relationship) among concepts you added (click \"Create Relationship\"),<br>Then save your model (click \"Save Model\").<br>After saving you model, you can run simulation for your model!";
            }
            dlg = dialogs.create('/dialogs/help.html', 'helpController', {}, {
                key: false,
                back: 'static'
            });
            dlg.result.then(function (user) {
            }, function () {
                $scope.name = 'You decided not to enter in your name, that makes me sad.';
            });
        };

        $scope.range = function (min, max, step) {
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step)
                input.push(i);
            return input;
        };

        $scope.saveModel = function () {
            dlg = dialogs.create('/dialogs/savemodel.html', 'ModelController', {}, {
                key: false,
                back: 'static'
            });
            dlg.result.then(function (user) {
                $scope.Models.push(user);

                var jsonModel = {
                    ModelTitle: user.title,
                    ModelDesc: user.description,
                    ModelKeywords: user.keywords,
                    userID: "1",
                    concepts: ConceptsDetail.getConcepts(),
                    connections: AssociationsDetail.getAssociations()
                };

                $scope.fcmModel = new Fcm();
                $scope.fcmModel.data = jsonModel;

                Fcm.save($scope.fcmModel, function (value) {
                    FcmSearchUpdate.create({ id: value.model.id }, function () {
                        var dlg = dialogs.notify("Causal Model", "'" + user.title + "' Casual Model has been saved!");
                    }, function (err) {
                        throw { message: err.data };
                    });
                    $scope.md = value;
                    $location.path('/models/' + value.model.id + '/edit');
                }, function (err) {
                    throw { message: err.data };
                });
            }, function () {
                $scope.name = 'You decided not to enter in your name, that makes me sad.';
            });
        };

        $scope.cancelModel = function (id) {

            // Open a confirmation dialog
            var dlg = dialogs.confirm("Are you sure?", "Do you want to exit without save this causal model?");
            dlg.result.then(function () {
                $location.path('/models/' + id);
            });
        };

        $scope.updateModel = function () {
            var jsonModel = {
                model: FCMModelsDetail.getModels(),
                userID: "1",
                concepts: ConceptsDetail.getConcepts(),
                connections: AssociationsDetail.getAssociations()
            };

            $scope.fcmModelUpdate = new FcmModel();
            $scope.fcmModelUpdate.data = jsonModel;
            $scope.md = jsonModel;
            FcmModel.update({ id: $routeParams.fcmId }, $scope.fcmModelUpdate, function (value) {
                FcmSearchUpdate.update({ id: $routeParams.fcmId }, function () {
                    var dlg = dialogs.notify("Causal Model", "'" + value.model.title + "' Casual Model has been saved!");
                }, function (err) {
                    throw { message: err.data };
                });
                //			$scope.md = value;
                $window.location.reload();
            }, function (err) {
                throw { message: err.data };
            });
        };

        $scope.advanceSettings = function () {
            dlg = dialogs.create('/dialogs/advancesettings.html', 'AdvanceSettingsController', {}, {
                key: false,
                back: 'static'
            });
            dlg.result.then(function (user) {
                $scope.Activator.pop();
                $scope.Activator.push(user);
            }, function () {
                $scope.name = 'You decided not to enter in your name, that makes me sad.';
            });
        };

        $scope.editMetrics = function (index) {
            dlg = dialogs.create('/dialogs/editmetrics.html', 'EditMetricsController', {}, {
                key: false,
                back: 'static'
            });
            dlg.result.then(function (user) {
                if (user.ListMetricsFilter.length > 0) {
                    $scope.SimulationConcepts[index].metricId = user.ListMetricsFilter[0].id;
                    $scope.SimulationConcepts[index].metricTitle = user.ListMetricsFilter[0].title;
                    $scope.SimulationConcepts[index].individuals = user.Individuals;
                }
            }, function () {
                $scope.name = 'You decided not to enter in your name, that makes me sad.';
            });
        };

        $scope.metricsManager = function () {
            dlg = dialogs.create('/dialogs/metricsmanager.html', 'MetricsManagerController', {}, {
                key: false,
                back: 'static'
            });
            dlg.result.then(function (user) {
            }, function () {
                $scope.name = 'You decided not to enter in your name, that makes me sad.';
            });
        };

        $scope.correlationMatrix = function () {
            dlg = dialogs.create('/dialogs/correlationmatrix.html', 'CorrelationMatrixController', {}, {
                key: false,
                back: 'static'
            });
            dlg.result.then(function (user) {
            }, function () {
                $scope.name = 'You decided not to enter in your name, that makes me sad.';
            });
        };


        // **-*-****
        $scope.weightCalulation = function () {
            $scope.conceptStyle = [];
            $scope.relationShipStyle = [];

            $scope.SimulationConcepts.forEach(function (data) {
                if (data.metricId == 0) {
                    throw { message: "You need to link all the concepts to datasets" };
                    return false;
                }
            });

            for (i = 0; i < $scope.SimulationConcepts.length; i++) {
                if ($scope.SimulationConcepts[i].metricId != 0) {
                    if ((i + 1) == 1)
                        $scope.SimulationConcepts[i].value = 0.8; else if ((i + 1) % 5 == 0)
                        $scope.SimulationConcepts[i].value = 1; else if ((i + 1) % 4 == 0)
                        $scope.SimulationConcepts[i].value = 0.4; else if ((i + 1) % 3 == 0)
                        $scope.SimulationConcepts[i].value = 0.6; else if ((i + 1) % 2 == 0)
                        $scope.SimulationConcepts[i].value = 0.2; else
                        $scope.SimulationConcepts[i].value = 0.8;
                    $scope.conceptStyle[i] = { "color": "#286090" };
                }
            }
            for (i = 0; i < $scope.SimulationAssociations.length; i++) {
                for (j = 0; j < $scope.SimulationConcepts.length; j++) {
                    if ($scope.SimulationConcepts[j].Id == $scope.SimulationAssociations[i].source.Id) {
                        if ($scope.SimulationConcepts[j].metricId != 0) {
                            if ((i + 1) == 1)
                                $scope.SimulationAssociations[i].weighted = 0.25; else if ((i + 1) % 5 == 0)
                                $scope.SimulationAssociations[i].weighted = -0.25; else if ((i + 1) % 4 == 0)
                                $scope.SimulationAssociations[i].weighted = 0.75; else if ((i + 1) % 3 == 0)
                                $scope.SimulationAssociations[i].weighted = -0.5; else if ((i + 1) % 2 == 0)
                                $scope.SimulationAssociations[i].weighted = 0.5; else
                                $scope.SimulationAssociations[i].weighted = 1;
                            $scope.relationShipStyle[i] = { "color": "#286090" };
                        }
                    }

                    if ($scope.SimulationConcepts[j].Id == $scope.SimulationAssociations[i].destination.Id) {
                        if ($scope.SimulationConcepts[j].metricId != 0) {
                            if ((i + 1) == 1)
                                $scope.SimulationAssociations[i].weighted = 0.25; else if ((i + 1) % 5 == 0)
                                $scope.SimulationAssociations[i].weighted = -0.25; else if ((i + 1) % 4 == 0)
                                $scope.SimulationAssociations[i].weighted = 0.75; else if ((i + 1) % 3 == 0)
                                $scope.SimulationAssociations[i].weighted = -0.5; else if ((i + 1) % 2 == 0)
                                $scope.SimulationAssociations[i].weighted = 0.5; else
                                $scope.SimulationAssociations[i].weighted = 1;
                            $scope.relationShipStyle[i] = { "color": "#286090" };
                        }
                    }
                }
            }

            if ($scope.Concepts.length > 1) {
                var dlg = dialogs.notify("Causal Model", "Weights are calculated!");
            }
        };

        $scope.runSimulation = function () {

            if ($scope.Concepts.length == 0) {
                throw { message: "The model is incomplete" };
            }

            if (!$scope.isModelSaved) {
                throw { message: "To run the simulation, please save the model" };
            }

            $scope.SimulationConcepts.forEach(function (data) {
                if (data.value == 0) {
                    throw { message: "Please set the initial value for all concepts" };
                }
            });

            angular.forEach($scope.Associations, function (value, key) {
                if (value.weighted == "?") {
                    throw { message: "Incomplete FCM model" };
                }
            });

            var Activator = FCMActivatorDetail.getActivator();
            var jsonSimulation = {
                model: FCMModelsDetail.getModels(),
                userID: "1",
                activatorId: Activator[0].id,
                concepts: SimulationConceptsDetail.getConcepts(),
                connections: SimulationAssociationsDetail.getAssociations()
            };
            var Concepts = ConceptsDetail.getConcepts();
            var Associations = SimulationAssociationsDetail.getAssociations();

            $scope.fcmSimulation = new FcmSimulation();
            $scope.fcmSimulation.data = jsonSimulation;

            $scope.SimulationResults.splice(0, $scope.SimulationResults.length);
            $scope.dataset.splice(0, $scope.dataset.length);
            $scope.labels.splice(0, $scope.labels.length);

            $scope.md = $scope.fcmSimulation;

            for (i = 0; i < $scope.edgeData.length; i++)
                for (j = 0; j < Associations.length; j++)
                    if (($scope.edgeData[i].id == Associations[j].Id))
                        $scope.edgeData[i].weighted = Associations[j].weighted;

            FcmSimulation.save($scope.fcmSimulation, function (value) {
                for (i = 0; i < value.result.length; i++) {
                    var ConceptResults = {
                        Id: value.result[i].id.toString(),
                        iterationID: value.result[i].iteration_id.toString(),
                        conceptID: value.result[i].conceptID.toString(),
                        output: value.result[i].output.toString()
                    };

                    $scope.SimulationResults.push(ConceptResults);
                }

                $scope.totalIteration = value.result[value.result.length - 1].iteration_id;

                for (i = 0; i < Concepts.length; i++) {
                    var iteration = [];
                    var output = [];

                    for (j = 0; j < value.result.length; j++) {
                        if (value.result[j].conceptID == Concepts[i].Id) {
                            if (value.result[j].iteration_id < 10)
                                iteration.push("0" + value.result[j].iteration_id.toString()); else
                                iteration.push(value.result[j].iteration_id.toString());
                            output.push(value.result[j].output);
                        }
                    }
                    var data = {
                        Key: Concepts[i].title,
                        ValueX: iteration,
                        ValueY: output,
                        Type: "FCM"
                    };
                    $scope.dataset.push(data);
                    $scope.labels.push("");
                }

                //	$scope.md = $scope.dataset;
            }, function (err) {
                throw { message: err.data };
            });

            //dlg = dialogs.create('/dialogs/runsimulation.html','RunSimulationController',{},{key: false,back: 'static'});
            //dlg.result.then(function(user){
            //   },function(){
            //     $scope.name = 'You decided not to enter in your name, that makes me sad.';
            //   });
            // broadcasting the event
            $rootScope.$broadcast('appChanged');

            $scope.tabsel = {
                results: true
            }
        };

        $scope.impactAnalysis = function () {
            dlg = dialogs.create('/dialogs/impactanalysis.html', 'ImpactAnalysisController', {}, {
                key: false,
                back: 'static'
            });
            dlg.result.then(function (user) {
            }, function () {
                $scope.name = 'You decided not to enter in your name, that makes me sad.';
            });
        };

        $scope.addObjAutomatic = function (title, description) {
            var user = {};
            var newObj = title;
            user.Id = 'n' + $scope.NodeID;
            user.x = $scope.NodeID * 30 + 200 + ($scope.NodeID > 0 ? 30 : 0);
            user.y = $scope.NodeID * 30 + 100 + ($scope.NodeID > 0 ? 50 : 0);
            user.scale = 5;
            user.title = title;
            user.description = description;
            var newNode = {
                id: 'n' + ($scope.NodeID),
                name: newObj,
                posX: user.x,
                posY: user.y
            };
            $scope.NodeID = $scope.NodeID + 1;
            // adding the new Node to the nodes array
            $scope.mapData.push(newNode);
            $scope.Concepts.push(user);
            $scope.isDisabled = false;
            $scope.isModelSaved = false;

            // broadcasting the event
            $rootScope.$broadcast('appChanged');
            // resetting the form
        };
        if ($routeParams.indicator != null) {
            angular.forEach($routeParams.indicator, function (indicator) {
                console.log(indicator);
                FcmIndicator.show({ id: indicator }, function (res) {
                    $scope.addObjAutomatic(res.name, res.description)
                    console.log(res);
                }, function (err) {
                    throw { message: err.data };
                });
            });
        }


        // add object from the form then broadcast event which triggers the directive redrawing of the chart
        // you can pass values and add them without redrawing the entire chart, but this is the simplest way
        $scope.addObj = function () {
            dlg = dialogs.create('/dialogs/addconcept.html', 'ConceptController', {}, {
                key: false,
                back: 'static'
            });
            dlg.result.then(function (user) {
                // collecting data from the form
                var newObj = user.title;
                user.Id = 'n' + $scope.NodeID;
                user.x = $scope.NodeID * 30 + 200;
                user.y = $scope.NodeID * 30 + 100;
                user.scale = 5;
                // building the new Node object
                // using the array length to generate an id for the sample (you can do it any other way)
                var newNode = {
                    id: 'n' + ($scope.NodeID),
                    name: newObj,
                    posX: user.x,
                    posY: user.y
                };
                $scope.NodeID = $scope.NodeID + 1;
                // adding the new Node to the nodes array
                $scope.mapData.push(newNode);
                $scope.Concepts.push(user);

                if ($routeParams.fcmId) {
                    user.metricTitle = "Link Datasets"
                    $scope.SimulationConcepts.push(user);
                }

                if ($scope.Concepts.length > 1)
                    $scope.isDisabled = false; else
                    $scope.isDisabled = true;

                $scope.isModelSaved = false;

                // broadcasting the event
                $rootScope.$broadcast('appChanged');
                // resetting the form
            }, function () {
                $scope.name = 'You decided not to enter in your name, that makes me sad.';
            });
        };

        // add Edges to the edges object, then broadcast the change event
        $scope.addEdge = function () {
            dlg = dialogs.create('/dialogs/addassociation.html', 'AssociationController', {}, {
                key: false,
                back: 'static'
            });
            dlg.result.then(function (user) {
                // collecting the data from the form
                var edge1 = user.source.Id;
                var edge2 = user.destination.Id;
                user.Id = 'e' + ($scope.edgeData.length);

                // building the new Edge object from the data
                // using the array length to generate an id for the sample (you can do it any other way)
                var newEdge = {
                    id: 'e' + ($scope.edgeData.length),
                    source: edge1,
                    target: edge2,
                    weighted: user.weight
                };
                // adding the new edge object to the adges array
                $scope.edgeData.push(newEdge);
                $scope.Associations.push(user);

                $scope.isModelSaved = false;
                if ($routeParams.fcmId) {
                    user.weighted = user.weight;
                    $scope.SimulationAssociations.push(user);
                }

                // broadcasting the event
                $rootScope.$broadcast('appChanged');
                // resetting the form
            }, function () {
                $scope.name = 'You decided not to enter in your name, that makes me sad.';
            });
        };

        // sample function to be called when clicking on an object in the chart
        $scope.doClick = function (value) {

            console.log('clicked ' + value);
            var pos;
            // sample just passes the object's ID then output it to the console and to an alert
            EditConcept.setEditMode($scope.mode);
            EditAssociation.setEditMode($scope.mode);
            if (value.substring(0, 1) == "n") {
                for (i = 0; i < $scope.Concepts.length; i++) {
                    if ($scope.Concepts[i].Id == value.substring(1, value.length)) {
                        EditConcept.setConcept($scope.Concepts[i]);
                        pos = i;
                    }
                }
                dlg = dialogs.create('/dialogs/editconcept.html', 'EditConceptController', {}, {
                    key: false,
                    back: 'static'
                });
                dlg.result.then(function (user) {
                    if (user == "D") {
                        for (i = 0; i < $scope.Associations.length; i++) {
                            if (($scope.Associations[i].sourceID == $scope.Concepts[pos].Id) || ($scope.Associations[i].destinationID == $scope.Concepts[pos].Id)) {
                                for (j = i; j < $scope.Associations.length - 1; j++) {
                                    $scope.Associations[j] = $scope.Associations[j + 1];
                                    $scope.edgeData[j] = $scope.edgeData[j + 1];
                                    $scope.SimulationAssociations[j] = $scope.SimulationAssociations[j + 1];
                                }
                                $scope.Associations.pop();
                                $scope.edgeData.pop();
                                $scope.SimulationAssociations.pop();
                                i--;
                            }
                        }

                        for (i = pos; i < $scope.Concepts.length - 1; i++) {
                            $scope.Concepts[i] = $scope.Concepts[i + 1];
                            $scope.mapData[i] = $scope.mapData[i + 1];
                            $scope.SimulationConcepts[i] = $scope.SimulationConcepts[i + 1];
                        }

                        $scope.Concepts.pop();
                        $scope.mapData.pop();
                        $scope.SimulationConcepts.pop();

                        if ($scope.Concepts.length > 1)
                            $scope.isDisabled = false; else
                            $scope.isDisabled = true;
                    } else {
                        // collecting data from the form
                        $scope.Concepts[pos].title = user.title;
                        $scope.Concepts[pos].description = user.description;
                        $scope.Concepts[pos].scale = user.scale;

                        $scope.mapData[pos].name = user.title;

                        // update bottom SimulationConcepts
                        if ($routeParams.fcmId) {
                            $scope.SimulationConcepts[pos].title = user.title;
                        }
                    }

                    $scope.isModelSaved = false;

                    // broadcasting the event
                    $rootScope.$broadcast('appChanged');
                }, function () {
                    $scope.name = 'You decided not to enter in your name, that makes me sad.';
                });
            } else {
                for (i = 0; i < $scope.Associations.length; i++) {
                    if ($scope.Associations[i].Id == value.substring(1, value.length)) {
                        EditAssociation.setAssociation($scope.Associations[i]);
                        pos = i;
                    }
                }
                dlg = dialogs.create('/dialogs/editassociation.html', 'EditAssociationController', {}, {
                    key: false,
                    back: 'static'
                });
                dlg.result.then(function (user) {
                    if (user == "D") {
                        for (i = pos; i < $scope.Associations.length - 1; i++) {
                            $scope.Associations[i] = $scope.Associations[i + 1];
                            $scope.edgeData[i] = $scope.edgeData[i + 1];
                            $scope.SimulationAssociations[i] = $scope.SimulationAssociations[i + 1];
                        }
                        $scope.Associations.pop();
                        $scope.edgeData.pop();
                        $scope.SimulationAssociations.pop();
                    } else {
                        // collecting data from the form
                        $scope.Associations[pos].sourceID = user.source.Id;
                        $scope.Associations[pos].source = user.source;
                        $scope.Associations[pos].destinationID = user.destination.Id;
                        $scope.Associations[pos].destination = user.destination;
                        $scope.Associations[pos].weighted = user.weight;

                        $scope.edgeData[pos].source = user.source.Id;
                        $scope.edgeData[pos].target = user.destination.Id;
                        $scope.edgeData[pos].weighted = user.weight;

                        // update relationships in bottom
                        if ($routeParams.fcmId) {
                            $scope.SimulationAssociations[pos].source = user.source;
                            $scope.SimulationAssociations[pos].destination = user.destination;
                            $scope.SimulationAssociations[pos].weighted = user.weight;
                        }
                    }

                    $scope.isModelSaved = false;

                    // broadcasting the event
                    $rootScope.$broadcast('appChanged');
                }, function () {
                    $scope.name = 'You decided not to enter in your name, that makes me sad.';
                });
            }

        };




        // sample function to be called when clicking on an object in the chart
        $scope.doDblClick = function (value) {

            console.log('clicked ' + value);
            var pos;
            // sample just passes the object's ID then output it to the console and to an alert
            EditConcept.setEditMode($scope.mode);
            EditAssociation.setEditMode($scope.mode);
            if (value.substring(0, 1) == "n") {
                for (i = 0; i < $scope.Concepts.length; i++) {
                    if ($scope.Concepts[i].Id == value.substring(1, value.length)) {
                        EditConcept.setConcept($scope.Concepts[i]);
                        pos = i;
                    }
                }
                dlg = dialogs.create('/dialogs/editconcept.html', 'EditConceptController', {}, {
                    key: false,
                    back: 'static'
                });
                dlg.result.then(function (user) {
                    if (user == "D") {
                        for (i = 0; i < $scope.Associations.length; i++) {
                            if (($scope.Associations[i].sourceID == $scope.Concepts[pos].Id) || ($scope.Associations[i].destinationID == $scope.Concepts[pos].Id)) {
                                for (j = i; j < $scope.Associations.length - 1; j++) {
                                    $scope.Associations[j] = $scope.Associations[j + 1];
                                    $scope.edgeData[j] = $scope.edgeData[j + 1];
                                    $scope.SimulationAssociations[j] = $scope.SimulationAssociations[j + 1];
                                }
                                $scope.Associations.pop();
                                $scope.edgeData.pop();
                                $scope.SimulationAssociations.pop();
                                i--;
                            }
                        }

                        for (i = pos; i < $scope.Concepts.length - 1; i++) {
                            $scope.Concepts[i] = $scope.Concepts[i + 1];
                            $scope.mapData[i] = $scope.mapData[i + 1];
                            $scope.SimulationConcepts[i] = $scope.SimulationConcepts[i + 1];
                        }

                        $scope.Concepts.pop();
                        $scope.mapData.pop();
                        $scope.SimulationConcepts.pop();

                        if ($scope.Concepts.length > 1)
                            $scope.isDisabled = false; else
                            $scope.isDisabled = true;
                    } else {
                        // collecting data from the form
                        $scope.Concepts[pos].title = user.title;
                        $scope.Concepts[pos].description = user.description;
                        $scope.Concepts[pos].scale = user.scale;

                        $scope.mapData[pos].name = user.title;

                        // update bottom SimulationConcepts
                        if ($routeParams.fcmId) {
                            $scope.SimulationConcepts[pos].title = user.title;
                        }
                    }

                    $scope.isModelSaved = false;

                    // broadcasting the event
                    $rootScope.$broadcast('appChanged');
                }, function () {
                    $scope.name = 'You decided not to enter in your name, that makes me sad.';
                });
            } else {
                for (i = 0; i < $scope.Associations.length; i++) {
                    if ($scope.Associations[i].Id == value.substring(1, value.length)) {
                        EditAssociation.setAssociation($scope.Associations[i]);
                        pos = i;
                    }
                }
                dlg = dialogs.create('/dialogs/editassociation.html', 'EditAssociationController', {}, {
                    key: false,
                    back: 'static'
                });
                dlg.result.then(function (user) {
                    if (user == "D") {
                        for (i = pos; i < $scope.Associations.length - 1; i++) {
                            $scope.Associations[i] = $scope.Associations[i + 1];
                            $scope.edgeData[i] = $scope.edgeData[i + 1];
                            $scope.SimulationAssociations[i] = $scope.SimulationAssociations[i + 1];
                        }
                        $scope.Associations.pop();
                        $scope.edgeData.pop();
                        $scope.SimulationAssociations.pop();
                    } else {
                        // collecting data from the form
                        $scope.Associations[pos].sourceID = user.source.Id;
                        $scope.Associations[pos].source = user.source;
                        $scope.Associations[pos].destinationID = user.destination.Id;
                        $scope.Associations[pos].destination = user.destination;
                        $scope.Associations[pos].weighted = user.weight;

                        $scope.edgeData[pos].source = user.source.Id;
                        $scope.edgeData[pos].target = user.destination.Id;
                        $scope.edgeData[pos].weighted = user.weight;

                        // update relationships in bottom
                        if ($routeParams.fcmId) {
                            $scope.SimulationAssociations[pos].source = user.source;
                            $scope.SimulationAssociations[pos].destination = user.destination;
                            $scope.SimulationAssociations[pos].weighted = user.weight;
                        }
                    }

                    $scope.isModelSaved = false;

                    // broadcasting the event
                    $rootScope.$broadcast('appChanged');
                }, function () {
                    $scope.name = 'You decided not to enter in your name, that makes me sad.';
                });
            }

        };


        $scope.doMouseUp = function (value, posx, posy) {
            for (i = 0; i < $scope.Concepts.length; i++) {
                if ($scope.Concepts[i].Id == value.substring(1, value.length)) {
                    $scope.Concepts[i].x = posx;
                    $scope.Concepts[i].y = posy;
                    $scope.mapData[i].posX = posx;
                    $scope.mapData[i].posY = posy;
                }
            }
        };
        // Fit the nodes in the Editor
        $scope.reset = function () {
            $rootScope.$broadcast('appChanged');
        };

        $scope.updateEdge = function ($index) {
            var weight = $scope.SimulationAssociations[$index].weighted;
            $scope.edgeData[$index].weighted = weight;
            var assostions = AssociationsDetail.getAssociations();
            assostions[$index].weighted = weight;
            AssociationsDetail.setAssociations(assostions);
            $rootScope.$broadcast('appChanged');
        };

    })

    .controller('helpController', function ($scope, $modalInstance, $log, $routeParams, data) {
        $scope.helpContents = "First, add appropriate concepts for you causal model (click \"Add Concept\"),\nSecond, create relationship (causal relationship) among concepts you added (click \"Create Relationship\"),\nThen save your model (click \"Save Model\").\nAfter saving you model, you can run simulation for your model!";

        $scope.cancel = function () {
            $modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.save = function () {
            $modalInstance.close($scope.user);
        }; // end save

    }) // end helpController

    .controller('ConceptController', function ($scope, $modalInstance, Metric, FcmActivator, $log, $routeParams, data) {
        $scope.user = {
            Id: -1,
            title: '',
            description: '',
            x: '300',
            y: '300'
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.save = function () {
            $modalInstance.close($scope.user);
        }; // end save

    }) // end ConceptController

    .controller('EditConceptController', function ($scope, $modalInstance, Metric, FcmActivator, $log, $routeParams, dialogs, data, EditConcept) {
        $scope.user = {
            Id: -1,
            title: '',
            description: '',
            scale: '0',
            x: '300',
            y: '300'
        };
        $scope.user.Id = EditConcept.getConcept().Id;
        $scope.user.title = EditConcept.getConcept().title;
        $scope.user.description = EditConcept.getConcept().description;
        $scope.user.scale = EditConcept.getConcept().scale;
        $scope.user.x = EditConcept.getConcept().x;
        $scope.user.y = EditConcept.getConcept().y;

        var mode = EditConcept.getEditMode();

        $scope.cancel = function () {
            $modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.save = function () {
            $modalInstance.close($scope.user);
        }; // end save

        $scope.delete = function () {
            // Open a confirmation dialog
            var dlg = dialogs.confirm("Are you sure?", "Do you want to delete this concept permanently? All associations of this concept will also deleted.");
            dlg.result.then(function () {
                // Delete the concept
                $modalInstance.close("D");
            });
        }; // end delete

    }) // end ConceptController

    .controller('AssociationController', function ($scope, $modalInstance, data, ConceptsDetail) {
        $scope.user = {
            Id: -1,
            sourceID: '',
            destinationID: '',
            source: '',
            destination: '',
            weight: '?'
        };

        $scope.Concepts = [];
        $scope.Concepts = ConceptsDetail.getConcepts();

        $scope.cancel = function () {
            $modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.save = function () {
            $scope.user.sourceID = $scope.user.source.Id;
            $scope.user.destinationID = $scope.user.destination.Id;
            $modalInstance.close($scope.user);
        }; // end save

    }) // end AssociationController

    .controller('EditAssociationController', function ($scope, $modalInstance, dialogs, data, ConceptsDetail, EditAssociation) {
        $scope.user = {
            Id: -1,
            sourceID: '',
            destinationID: '',
            source: '',
            destination: '',
            weight: '?'
        };
        var mode = EditAssociation.getEditMode();
        $scope.user.Id = EditAssociation.getAssociation().Id;
        $scope.user.sourceID = EditAssociation.getAssociation().sourceID;
        $scope.user.destinationID = EditAssociation.getAssociation().destinationID;
        $scope.user.weight = EditAssociation.getAssociation().weighted;

        $scope.Concepts = [];
        $scope.Concepts = ConceptsDetail.getConcepts();

        for (i = 0; i < $scope.Concepts.length; i++) {
            if ($scope.Concepts[i].Id == $scope.user.sourceID) {
                $scope.user.source = $scope.Concepts[i];
            }
            if ($scope.Concepts[i].Id == $scope.user.destinationID) {
                $scope.user.destination = $scope.Concepts[i];
            }
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.save = function () {
            $modalInstance.close($scope.user);
        }; // end save

        $scope.delete = function () {
            // Open a confirmation dialog
            var dlg = dialogs.confirm("Are you sure?", "Do you want to delete this association permanently?");
            dlg.result.then(function () {
                // Delete the association
                $modalInstance.close("D");
            });
        }; // end delete

    }) // end AssociationController

    .controller('ModelController', function ($scope, $modalInstance, data, FCMModelsDetail) {
        $scope.user = [
            { FCMModelId: -1 }, { title: '' }, { description: '' }, { keywords: '' }
        ];

        $scope.Models = [];
        $scope.Models = FCMModelsDetail.getModels();

        $scope.cancel = function () {
            $modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.save = function () {
            $modalInstance.close($scope.user);
        }; // end save

    }) // end ModelController

    .controller('AdvanceSettingsController', function ($scope, $modalInstance, data, FcmActivator, FCMActivatorDetail) {
        $scope.Fcmactivators = FcmActivator.query({}, function (activatorList) {
        }, function (error) {
            throw { message: JSON.stringify(error.data) };
        });

        $scope.activator1 = FCMActivatorDetail.getActivator();
        $scope.activator = $scope.activator1[0];
        $scope.user = $scope.activator1[0];

        $scope.cancel = function () {
            $modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.save = function () {
            $modalInstance.close($scope.user);
        }; // end save

    }) // end ModelController


    .controller('ModalInstanceCtrlDataset', [
        '$scope',
        'VisualizationByDataset',
        'Visualization',
        'Event',
        '$filter',
        '$route',
        '$routeParams',
        '$modalInstance',
        'item',
        'searchclient',
        '$location',
        '$log',
        'API_CONF',
        function ($scope, VisualizationByDataset, Visualization, Event, $filter, $route, $routeParams, $modalInstance, item, searchclient, $location, $log, API_CONF) {

            //console.log("aaaaaaa");

            $scope.displaycontentMetricModal = function (idMetric) {
                var containerLink = document.getElementById("modal-edit-metric-button-" + idMetric);
                $(containerLink).parent().next().toggle(200);
            };

            $scope.okModalDataset = function () {
                $modalInstance.close();
            };

            $scope.cancelModalDataset = function () {
                $modalInstance.dismiss('cancel');
            };

        }
    ])


    .controller('EditMetricsController', function ($scope, $modalInstance, data, FCMModelsDetail) {
        $scope.user = [
            { FCMModelId: -1 }, { title: '' }, { description: '' }, { keywords: '' }
        ];

        $scope.Models = [];
        $scope.Models = FCMModelsDetail.getModels();

        $scope.displaycontentMetricModal = function (idMetric) {
            var containerLink = document.getElementById("modal-edit-metric-button-" + idMetric);
            $(containerLink).parent().next().toggle(200);
        };

        $scope.updateIndividuals = function (individual, individualValue) {
            $scope.user.Individuals = individual;
            $scope.user.IndividualsValue = individualValue;
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.save = function () {
            $modalInstance.close($scope.user);
        }; // end save

    }) // end EditMatricController

    .controller('MetricsManagerController', function ($scope, $modalInstance, data, FCMModelsDetail) {

        $scope.cancel = function () {
            $modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.save = function () {
            $modalInstance.close($scope.user);
        }; // end save

    }) // end MatricsManagerController

    .controller('CorrelationMatrixController', function ($scope, $modalInstance, data, ConceptsDetail) {
        $scope.Concepts = [];
        $scope.Concepts = ConceptsDetail.getConcepts();
        $scope.values1 = [];
        $scope.values2 = [];
        $scope.values3 = [];
        $scope.values4 = [];

        var val = { Id: "1" };
        $scope.values1.push(val);
        val = { Id: "" };
        $scope.values1.push(val);
        val = { Id: "" };
        $scope.values1.push(val);
        val = { Id: "" };
        $scope.values1.push(val);
        $scope.Concepts[0].values = $scope.values1;
        val = { Id: "0.6" };
        $scope.values2.push(val);
        val = { Id: "1" };
        $scope.values2.push(val);
        val = { Id: "" };
        $scope.values2.push(val);
        val = { Id: "" };
        $scope.values2.push(val);
        $scope.Concepts[1].values = $scope.values2;
        val = { Id: "0.32" };
        $scope.values3.push(val);
        val = { Id: "-0.65" };
        $scope.values3.push(val);
        val = { Id: "1" };
        $scope.values3.push(val);
        val = { Id: "" };
        $scope.values3.push(val);
        $scope.Concepts[2].values = $scope.values3;
        val = { Id: "-0.54" };
        $scope.values4.push(val);
        val = { Id: "0.41" };
        $scope.values4.push(val);
        val = { Id: "0.23" };
        $scope.values4.push(val);
        val = { Id: "1" };
        $scope.values4.push(val);
        $scope.Concepts[3].values = $scope.values4;

        $scope.cancel = function () {
            $modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.save = function () {
            $modalInstance.close($scope.user);
        }; // end save

    }) // end CorrelationMatrixController

    .controller('RunSimulationController', function ($scope, $modalInstance, data) {
        $scope.cancel = function () {
            $modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.save = function () {
            $modalInstance.close($scope.user);
        }; // end save

    }) // end RunSimulationController

    .controller('ImpactAnalysisController', function ($scope, $modalInstance, data, FcmImpactAnalysis, FCMModelsDetail, ConceptsDetail, SimulationConceptsDetail, SimulationAssociationsDetail) {
        $scope.user = [{ selectConcept: '' }, { selectConcept1: '' }, { selectConcept2: '' }, { selectConcept3: '' }];
        $scope.Concepts = [];
        $scope.ImpactAnalysisResults = [];
        $scope.twoImpactAnalysisResults = [];
        $scope.Concepts = ConceptsDetail.getConcepts();
        $scope.selectedConcept1Input = [];
        $scope.selectedConcept2Input = [];
        $scope.selectedConceptOutput = [];

        $scope.user.selectConcept = $scope.Concepts[0];
        $scope.user.selectConcept1 = $scope.Concepts[0];
        $scope.user.selectConcept2 = $scope.Concepts[1];
        $scope.user.selectConcept3 = $scope.Concepts[2];

        $scope.range = function (min, max, step) {
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step)
                input.push(i.toFixed(1));
            return input;
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.save = function () {
            $modalInstance.close($scope.user);
        }; // end save

        $scope.single = function () {
            var jsonSimulation = {
                model: FCMModelsDetail.getModels(),
                userID: "1",
                selectedConcept: $scope.user.selectConcept,
                concepts: SimulationConceptsDetail.getConcepts(),
                connections: SimulationAssociationsDetail.getAssociations()
            };

            $scope.fcmImpactAnalysis = new FcmImpactAnalysis();
            $scope.fcmImpactAnalysis.data = jsonSimulation;

            $scope.ImpactAnalysisResults.splice(0, $scope.ImpactAnalysisResults.length);

            FcmImpactAnalysis.save({ id: 1 }, $scope.fcmImpactAnalysis, function (value) {
                $scope.res = value;
                for (i = 0; i < value.result.length; i++) {
                    var ConceptResults = {
                        Id: value.result[i].id.toString(),
                        iterationID: value.result[i].iteration_id.toString(),
                        conceptID: value.result[i].conceptID.toString(),
                        input: value.result[i].input,
                        output: value.result[i].output
                    };

                    $scope.ImpactAnalysisResults.push(ConceptResults);
                }
            }, function (err) {
                throw { message: err.data };
            });

        }; // end Single Impact Analysis

        $scope.two = function () {
            var jsonSimulation = {
                model: FCMModelsDetail.getModels(),
                userID: "1",
                selectedConcept1: $scope.user.selectConcept1,
                selectedConcept2: $scope.user.selectConcept2,
                selectedConcept3: $scope.user.selectConcept3,
                concepts: SimulationConceptsDetail.getConcepts(),
                connections: SimulationAssociationsDetail.getAssociations()
            };
            var unique = true;
            var Concept1Input, Concept2Input, ConceptOutput, IterationID = 1;

            $scope.fcmImpactAnalysis = new FcmImpactAnalysis();
            $scope.fcmImpactAnalysis.data = jsonSimulation;

            $scope.twoImpactAnalysisResults.splice(0, $scope.ImpactAnalysisResults.length);
            $scope.selectedConcept1Input.splice(0, $scope.selectedConcept1Input.length);
            $scope.selectedConcept2Input.splice(0, $scope.selectedConcept2Input.length);
            $scope.selectedConceptOutput.splice(0, $scope.selectedConceptOutput.length);

            FcmImpactAnalysis.save({ id: 2 }, $scope.fcmImpactAnalysis, function (value) {
                $scope.res = value;
                for (i = 0; i < value.result.length; i++) {
                    var ConceptResults = {
                        Id: value.result[i].id.toString(),
                        iterationID: value.result[i].iteration_id.toString(),
                        conceptID: value.result[i].conceptID.toString(),
                        input: value.result[i].input,
                        output: value.result[i].output
                    };

                    if (IterationID != value.result[i].iteration_id) {
                        var IterationResults = {
                            iterationID: IterationID,
                            concept1Input: Concept1Input,
                            concept2Input: Concept2Input,
                            conceptOutput: ConceptOutput
                        };
                        $scope.selectedConceptOutput.push(IterationResults);
                        IterationID = value.result[i].iteration_id;
                    }

                    if (value.result[i].conceptID == $scope.user.selectConcept1.Id) {
                        for (j = 0; j < $scope.selectedConcept1Input.length; j++) {
                            if ($scope.selectedConcept1Input[j] == value.result[i].input)
                                unique = false;
                        }
                        if (unique == true)
                            $scope.selectedConcept1Input.push(value.result[i].input);
                        unique = true;
                        Concept1Input = value.result[i].input;
                    }


                    if (value.result[i].conceptID == $scope.user.selectConcept2.Id) {
                        for (j = 0; j < $scope.selectedConcept2Input.length; j++) {
                            if ($scope.selectedConcept2Input[j] == value.result[i].input)
                                unique = false;
                        }
                        if (unique == true)
                            $scope.selectedConcept2Input.push(value.result[i].input);
                        unique = true;
                        Concept2Input = value.result[i].input;
                    }

                    if (value.result[i].conceptID == $scope.user.selectConcept3.Id)
                        ConceptOutput = value.result[i].output;

                    $scope.twoImpactAnalysisResults.push(ConceptResults);
                }
                var IterationResults = {
                    iterationID: IterationID,
                    concept1Input: Concept1Input,
                    concept2Input: Concept2Input,
                    conceptOutput: ConceptOutput
                };
                $scope.selectedConceptOutput.push(IterationResults);
            }, function (err) {
                throw { message: err.data };
            });

        }; // end Impact of Two Concepts
    }) // end ImpactAnalysisController


    .controller('LoadCombosMetricInFCM', [
        '$scope',
        '$route',
        '$routeParams',
        '$modal',
        'Metric',
        'Dataset',
        '$location',
        'GetRelatedData',
        'dialogs',
        '$log',
        'API_CONF',
        'Individual',
        'Unit',
        function ($scope, $route, $routeParams, $modal, Metric, Dataset, $location, helper, dialogs, $log, API_CONF, Individual, Unit) {

            $scope.loadDataCombos = function (idMetric, valueColumTemp, valueGroupTemp) {
                //console.log("--loadDataCombos--idMetric="+idMetric+"---valueColumTemp="+valueColumTemp+"----valueGroupTemp="+valueGroupTemp+"-----");

                id = idMetric;
                //$scope.metricSelected = Metric.get({id: idMetric},
                $scope.metricSelected = Dataset.get({ id: idMetric }, function (getMetric) {

                    //console.log("idMetric="+idMetric);
                    $scope.correctmetrics = "1";

                    //console.log("mode="+$scope.mode);
                    //console.log("------$scope.metricSelected--------");
                    var containerIndex = idMetric;
                    //console.log("id="+idMetric);

                    myText = "grouping column";
                    $arrayComboValues_yaxe = [];
                    $arrayComboValues = [];

                    var posValue = -1;
                    var posGroup = -1;

                    if ($scope.metricSelected.data) {
                        arrayIndividualListDataset = $scope.metricSelected.data['table'];
                    } else {
                        arrayIndividualListDataset = [];
                    }


                    //console.log(arrayIndividualListDataset);
                    $arrayComboValues_Individuals = [];
                    $arrayComboValuesChecked = [];


                    $scope.individualCombo_value = [];
                    for (x = 0; x < arrayIndividualListDataset.length; x++) {
                        if (arrayIndividualListDataset[x].individual) {

                            $dataIndividual = Individual.getById(arrayIndividualListDataset[x].individual);
                            $dataIndividual.$promise.then(function (indivudual) {
                                //console.log(indivudual);
                                $arrayValores = {
                                    "id": indivudual.id,
                                    "title": indivudual.title
                                };
                                $arrayComboValues_Individuals.push($arrayValores);
                                //console.log($arrayValores['id']);
                                $arrayComboValuesChecked.push($arrayValores['id']);
                                //$arrayComboValuesChecked.push($arrayValores);

                                var TMP1 = [];
                                //TMP=$scope.individualCombo_value_[containerIndex];
                                if ($scope.individualCombo_value) {
                                    TMP1 = $scope.individualCombo_value;
                                }

                                TMP1.push($arrayValores);
                                $scope.individualCombo_value = TMP1;

                                var TMP2 = [];
                                if ($scope.IndividualDatasetCheckboxes) {
                                    TMP2 = $scope.IndividualDatasetCheckboxes;
                                }

                                TMP2.push($arrayValores['id']);
                                $scope.IndividualDatasetCheckboxes = TMP2;

                                $scope.updateIndividuals($scope.IndividualDatasetCheckboxes, $scope.individualCombo_value);
                            });

                        }
                    }

                    $scope.optionsCombo_value = $arrayComboValues_yaxe;
                    $scope.optionsCombo = $arrayComboValues;

                    if (posValue >= 0) {
                        $scope.MetricSelectorDataColumn = $scope.optionsCombo_value[posValue];
                    }

                    if (posGroup > 0) {
                        $scope.MetricSelectorGroupingData = $scope.optionsCombo[posGroup];
                    }

                }, function (error) {
                    //alert(error.data.message);
                    throw { message: JSON.stringify(error.data.message) };
                });
            };

            $scope.validateCheckboxes = function () {
                if ($scope.IndividualDatasetCheckboxes.length == 0) {
                    //console.log("j="+j);
                    for (j in $scope.individualCombo_value) {
                        //console.log("j=");
                        //console.log($scope.individualCombo_value[j].id);
                        $scope.IndividualDatasetCheckboxes.push($scope.individualCombo_value[j].id);
                    }
                }
                $scope.updateIndividuals($scope.IndividualDatasetCheckboxes, $scope.individualCombo_value);
            }
            //console.log($scope.metric.id);

            //console.log($scope.MetricSelectorLabelColumn);
            var myText = "from";
            if ($scope.MetricSelectorLabelColumn) {
                myText = $scope.MetricSelectorLabelColumn;
            }
            //console.log($scope.MetricSelectorLabelColumn_.length);

            $scope.MetricSelectorLabelColumn = myText;

            $scope.loadDataCombos($scope.metric.id, "", "");
        }
    ])

    .run([
        '$templateCache', function ($templateCache) {
            $templateCache.put('/dialogs/addconcept.html', '<div class="modal-header"><h4 class="modal-title">Add Concept</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="title">Title *</label><input type="text" class="form-control" name="title" id="title" ng-model="user.title" text="Vale here" required><br /><label class="control-label" for="description">Description</label><textarea class="form-control" rows="5" name="description" id="description" ng-model="user.description"></textarea><br /></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Add</button></div>');

            $templateCache.put('/dialogs/editconcept.html', '<div class="modal-header"><h4 class="modal-title">Edit Concept</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="title">Title *</label><input type="text" class="form-control" name="title" id="title" ng-model="user.title" text="Vale here" required><br /><label class="control-label" for="description">Description</label><textarea class="form-control" rows="5" name="description" id="description" ng-model="user.description"></textarea><br /></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Save</button><button type="button" class="btn btn-danger" ng-click="delete()">Delete</button></div>');

            $templateCache.put('/dialogs/addassociation.html', '<div class="modal-header"><h4 class="modal-title">Create Relationship</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="source">Source Concept *</label><select class="form-control" name="source" id="source" ng-model="user.source" ng-options="concept.title for concept in Concepts" required></select><br /><label class="control-label" for="destination">Destination Concept *</label><select class="form-control" name="destination" id="destination" ng-model="user.destination" ng-options="concept.title for concept in Concepts" required></select><br /><label class="control-label" for="destination">Weight</label><select class="form-control" name="weight" id="weight" ng-model="user.weight" required><option value="1">Very Strong Positive (1.0)</option><option value="0.75">Strong Positive (0.75)</option><option value="0.5">Weak Positive (0.5)</option><option value="0.25">Very Weak Positive (0.25)</option><option value="-0.25">Very Weak Negative (-0.25)</option><option value="-0.5">Weak Negative (-0.5)</option><option value="-0.75">Strong Negative (-0.75)</option><option value="-1">Very Strong Negative (-1.0)</option></select></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Add</button></div>');

            $templateCache.put('/dialogs/editassociation.html', '<div class="modal-header"><h4 class="modal-title">Edit Relationship</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="source">Source Concept *</label><select class="form-control" name="source" id="source" ng-model="user.source" ng-options="concept.title for concept in Concepts" required></select><br /><label class="control-label" for="destination">Destination Concept *</label><select class="form-control" name="destination" id="destination" ng-model="user.destination" ng-options="concept.title for concept in Concepts" required></select><br /><label class="control-label" for="destination">Weight</label><select class="form-control" name="weight" id="weight" ng-model="user.weight" required><option value="1">Very Strong Positive (1.0)</option><option value="0.75">Strong Positive (0.75)</option><option value="0.5">Weak Positive (0.5)</option><option value="0.25">Very Weak Positive (0.25)</option><option value="-0.25">Very Weak Negative (-0.25)</option><option value="-0.5">Weak Negative (-0.5)</option><option value="-0.75">Strong Negative (-0.75)</option><option value="-1">Very Strong Negative (-1.0)</option></select></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Save</button><button type="button" class="btn btn-danger" ng-click="delete()">Delete</button></div>');

            $templateCache.put('/dialogs/savemodel.html', '<div class="modal-header"><h4 class="modal-title">Causal Model</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="title">Title  *</label><input type="text" class="form-control" name="title" id="title" ng-model="user.title" text="Vale here" required><br /><label class="control-label" for="description">Description *</label><textarea class="form-control" rows="5" name="description" id="description" ng-model="user.description" required></textarea><br /><label class="control-label" for="keywords">Keywords : *</label><input type="text" class="form-control" name="keywords" id="keywords" ng-model="user.keywords" required><br /><label class="control-label" for="policyDomain">Policy Domain : *</label><select multiple class="form-control policydomain-options" size="5" id="policyDomain" name="policyDomain" ng-model="metric.policy_domains" required></select></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Save</button></div></div></div></div>');

            $templateCache.put('/dialogs/advancesettings.html', '<div class="modal-header"><h4 class="modal-title">Advanced Settings</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="title">Activator *</label><select class="form-control" name="activator" id="activator" value="user.title" ng-model="user" ng-options="activator.title for activator in Fcmactivators" required></select><label class="control-label" for="title">Scale *</label><select class="form-control" name="scale" id="scale" ng-model="user.scale" required><option value="3">3</option><option value="5">5</option><option value="7">7</option><option value="9">9</option></select></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Save</button></div>');

            $templateCache.put('/dialogs/editmetrics.html', '<div class="modal-header"><h1 class="ng-binding"><span class="glyphicon glyphicon-list-alt"></span> Link datasets</h1></div><div class="modal-body"><div id="basic-modal-content-pc"><tabset><tab heading="Search Datasets"><div class="row createvisualization"><div indexdataset="indexdataset" id="filterDatasets"  class="selectorDatasets" datasets-list="user.ListMetricsFilter" number-Max-Datasets="1"></div></div></tab><tab heading="Datasets Configuration"><div class="row createvisualization"><div ng-show="ListMetricsFilter.length==0">No dataset linked</div><div ng-show="metric.title" ng-controller="LoadCombosMetricInFCM" class="designer-metrics active" class="designer-metrics" id="designer-metrics-num-{{metric.id}}" ng-repeat="metric in user.ListMetricsFilter track by $index" ><h4>{{metric.title}} -- {{metric.issued | date:"longDate" }}</h4><input type="hidden" ng-model="MetricSelectediId_[metric.id]" id="MetricSelectediId_{{metric.id}}" name="MetricSelectedId[]" value=""><input type="hidden" ng-model="MetricSelectediIndex_[metric.id]" ng-init="MetricSelectediIndex_[metric.id]=metric.id" id="MetricSelectediIndex_{{metric.id}}" name="MetricSelectediIndex[]" value="{{metric.id}}"><div class="metric-buttons"><a type="button" data-intro="Edit dataset view properties" data-position="top" class="btn btn-primary btn-create" ng-click="displaycontentMetricModal(metric.id);collapsetFilterDataset=!collapsetFilterDataset;" id="modal-edit-metric-button-{{metric.id}}"><span ng-hide="collapsetFilterDataset">Open</span><span ng-show="collapsetFilterDataset">Collapse</span> Edit Mode</a><a type="button" data-intro="Access to the dataset data" data-position="right" class="btn btn-info btn-adddataset" href="#!/datasets/{{metric.id}}" target="_blank" id="view-metric-button-{{metric.id}}">View Dataset in detaill</a></div><div class="metric-forms" style="display: none;"><div class="metric-form-item"><br><table><thead><th><label for="color">Individual</label></th></thead><body><tr ng-repeat="option in individualCombo_value"><td><label ng-click="validateCheckboxes();"><input type="checkbox" checklist-model="IndividualDatasetCheckboxes" checklist-value="option.id"> {{option.title}}</label></td></tr></body></table></div></div></div></div></tab></tabset></div><div class="modal-footer"><button class="btn btn-primary btn-close" ng-click="save()">Close</button><a href="#!/datasets/create"  target="_blank" class="btn btn-default btn-create" id="adddataset">Create a new dataset</a></div></div>');

            $templateCache.put('/dialogs/editmetrics1.html', '<div class="modal-header"><h4 class="modal-title">Edit Metrics</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><div id="filterMetrics" class="selectorMetrics" metrics-list="user.ListMetricsFilter" number-Max-Metrics="1" functionformetric="save()"></div></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button></div>');

            $templateCache.put('/dialogs/metricsmanager.html', '<div class="modal-header"><h4 class="modal-title">Metrics Manager</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><tabset justified="false"><tab heading="Source"><div id="filterMetrics" class="selectorMetrics" metrics-list="ListMetricsFilter" number-Max-Metrics="1"></div></tab><tab heading="Sink"><div id="filterMetrics" class="selectorMetrics" metrics-list="ListMetricsFilter" number-Max-Metrics="1"></div></tab></tabset></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Save</button></div>');

            $templateCache.put('/dialogs/correlationmatrix.html', '<div class="modal-header"><h4 class="modal-title">Correlation Matrix between Concepts</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><p>Matrix below shows the correlation between selected concepts.<br>This can be the reference data for determining the weights between concepts if you want to insert the weight value manaully.</p></div><table class="table table-hover"><tr><td></td><td  align="center" ng-repeat="concept in Concepts">{{ concept.title }}</td></tr><tr ng-repeat="concept in Concepts"><td>{{ concept.title }}</td align="center"><td ng-repeat="val in concept.values">{{ val.Id }}</td></tr></table><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="save()">Use the Correlations for Weight</button><button type="button" class="btn btn-default" ng-click="cancel()">Close</button></div>');

            $templateCache.put('/dialogs/runsimulation.html', '<div class="modal-header"><h4 class="modal-title">Simulation job has submitted successfully.</h4></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Close</button></div>');

            $templateCache.put('/dialogs/help.html', '<div class="modal-header"><p class="modal-title">{{ helpContents }}</p></div>');

            $templateCache.put('/dialogs/impactanalysis.html', '<div class="modal-header"><div class="fonticon fonticon-help help-switch" ng-click="help=!help"></div><div ng-class="{active: help}" class="help-text"><p>Impact analysis shows the change of final concept values with regard to the change of initial concept value. One dimensional impact analysis shows the impact of changes in selected concept value on the other concepts’ final value. Two dimensional impact analysis enables users adjust initial value of two concepts simultaneously then user can check the final value of selected target concept accordingly.</p></div><h4 class="modal-title">Impact Analysis</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><tabset justified="false"><tab heading="Impact of Single Concept"><label class="control-label" for="impactanalysis">Impact of Change in</label><select class="form-control" name="source" id="source" ng-model="user.selectConcept" ng-options="concept.title for concept in Concepts"></select>(initial concept value)<br /><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="single()">Calculate</button></div><table class="table table-hover"><tr><td width="20%"><b>Initial Value of {{ user.selectConcept.title }}</b></td><td align="center" ng-repeat="result in ImpactAnalysisResults" ng-if="result.conceptID == user.selectConcept.Id"><b>{{ result.input }}</b></td></tr><tr ng-show="Concepts" ng-repeat="concept in Concepts"><td>{{ concept.title }}</td><td align="center" ng-repeat="result in ImpactAnalysisResults" ng-if="concept.Id == result.conceptID">{{ result.output }}</td></tr></table>* Value of each cell indicate the final value of simulation with given initial value of <b>{{ user.selectConcept.title }}</b>.</tab><tab heading="Impact of Two Concepts"><label class="control-label" for="impactanalysis">Impact of Change in</label><select class="form-control" name="source" id="source" ng-model="user.selectConcept1" ng-options="concept.title for concept in Concepts" required></select><label class="control-label" for="impactanalysis">and</label><select class="form-control" name="source" id="source" ng-model="user.selectConcept2" ng-options="concept.title for concept in Concepts" required></select>(initial concept value)<br /><label class="control-label" for="impactanalysis">on</label><select class="form-control" name="source" id="source" ng-model="user.selectConcept3" ng-options="concept.title for concept in Concepts" required></select><br /><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="two()">Calculate</button></div><table class="table table-hover"><tr><td width="20%"></td><td width="10%"></td><td align="center" colspan=5><b>{{ user.selectConcept1.title }}</b></td></tr><tr><td></td><td></td><td align="center" ng-repeat="input in selectedConcept1Input"><b>{{ input }}</b></td></tr><tr ng-repeat="input in selectedConcept2Input"><td rowspan="5" align="center" valign="middle" ng-if="input == 0.2"><b>{{ user.selectConcept2.title }}</b></td><td align="center"><b>{{ input }}</b></td><td align="center" ng-repeat="output in selectedConceptOutput" ng-if="output.concept2Input == input">{{ output.conceptOutput }}</td></tr></table>* Value of each cell indicate the final value of <b>{{ user.selectConcept3.title }}</b> with regards to the change of <b>{{ user.selectConcept1.title }}</b> & <b>{{ user.selectConcept2.title }}</b>.</tab></tabset></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Close</button></div>');

        }
    ]); // end run / module

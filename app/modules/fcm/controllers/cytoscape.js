var weka = '';
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

    .controller('CytoscapeCtrl', function ($scope, $rootScope, $window, $routeParams, $location, $translate, Fcm, FcmModel, FcmWekaOutput, FcmSimulation, FcmActivator, FcmSearchUpdate, dialogs, FCMModelsDetail, ConceptsDetail, SimulationConceptsDetail, AssociationsDetail, SimulationAssociationsDetail, EditConcept, EditAssociation, FCMActivatorDetail, Dataset, FcmIndicator, Auth) {
        // container objects
        $scope.user = Auth;
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
                    keywords: $scope.modeldetail.model.keywords.toString(),

                };
                FCMModelsDetail.setModels(model);

                var domains = JSON.parse(JSON.stringify($scope.modeldetail.domains));
                $scope.modeldetail.domains = [];
                for (i = 0; i < domains.length; i++) {
                    $scope.modeldetail.domains.push(domains[i].domainID);
                }
                console.log($scope.modeldetail.domains);
                for (i = 0; i < $scope.modeldetail.concepts.length; i++) {
                    var newNode = {
                        id: $scope.modeldetail.concepts[i].id.toString(),
                        name: $scope.modeldetail.concepts[i].title.length > 24 ? //Showing ... if text exceeds the limit to show
                            ($scope.modeldetail.concepts[i].title.substring(0, 21) + '...') :
                            $scope.modeldetail.concepts[i].title,
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
            $scope.modeldetail = {
                model: {
                    ModelID: '',
                    title: '',
                    description: '',
                    keywords: ''
                }
            };
        }


        $scope.showHelp = function (helpId) {
            if (helpId == 1) {
                $scope.helpContents = "First, add appropriate concepts for you causal model (click \"Add Concept\"),<br>Second, create relationship (causal relationship) among concepts you added (click \"Create Relationship\"),<br>Then save your model (click \"Save Model\").<br>After saving you model, you can run simulation for your model!";
            }
            dlg = dialogs.create('modules/fcm/partials/help.html', 'helpController', {}, {
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
            var jsonModel = {
                ModelTitle: $scope.modeldetail.model.title,
                ModelDesc: $scope.modeldetail.model.description,
                ModelKeywords: $scope.modeldetail.model.keywords,
                domains: $scope.modeldetail.domains,
                userID: "1",
                concepts: ConceptsDetail.getConcepts(),
                connections: AssociationsDetail.getAssociations()
            };

            $scope.fcmModel = new Fcm();
            $scope.fcmModel.data = jsonModel;

            Fcm.save($scope.fcmModel, function (value) {
                FcmSearchUpdate.create({ id: value.model.id }, function () {
                    var dlg = dialogs.notify("Causal Model", "'" + $scope.modeldetail.model.title + "' Casual Model has been saved!");
                }, function (err) {
                    throw { message: JSON.stringify(err.data) };
                });
                $scope.md = value;
                $location.path('/models/' + value.model.id + '/edit');
            }, function (err) {
                throw { message: JSON.stringify(err.data) };
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
            $scope.runSimulation();
            var jsonModel = {
                model: FCMModelsDetail.getModels(),
                userID: "1",
                concepts: ConceptsDetail.getConcepts(),
                connections: AssociationsDetail.getAssociations()
            };

            jsonModel.model.title = $scope.modeldetail.model.title;
            jsonModel.model.description = $scope.modeldetail.model.description;
            jsonModel.model.keywords = $scope.modeldetail.model.keywords;
            jsonModel.domains = $scope.modeldetail.domains;

            $scope.fcmModelUpdate = new FcmModel();
            $scope.fcmModelUpdate.data = jsonModel;
            FcmModel.update({ id: $routeParams.fcmId }, $scope.fcmModelUpdate, function (value) {
                FcmSearchUpdate.update({ id: $routeParams.fcmId }, function () {
                    var dlg = dialogs.notify("Causal Model", "'" + value.model.title + "' Casual Model has been saved!");
                }, function (err) {
                    throw { message: err.statusText + "<br/><br/>" + (err.data == "" ? "" : JSON.stringify(err.data)) };
                });
                //			$scope.md = value;
                //$window.location.reload();
            }, function (err) {
                throw { message: err.statusText + "<br/><br/>" + (err.data == "" ? "" : JSON.stringify(err.data)) };
            });
        };

        //Open help menu
        $scope.openHelpModel = function (event, helpModelId) {
            $scope[helpModelId] = !$scope[helpModelId];

            var thisControl = $(event.target);
            var posX = (event.pageX), posY = (event.pageY + 10);

            var model = $('div[ng-class="{active: ' + helpModelId + '}"]');
            model.css('left', posX + 'px');
            model.css('top', posY + 'px');
        };

        $scope.advanceSettings = function () {
            dlg = dialogs.create('modules/fcm/partials/advancesettings.html', 'AdvanceSettingsController', {}, {
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
            dlg = dialogs.create('modules/fcm/partials/editmetrics.html', 'EditMetricsController', { concept: $scope.SimulationConcepts[index] }, {
                key: false,
                back: 'static'
            });
            dlg.result.then(function (user) {
                if (user.ListMetricsFilter.length > 0) {
                    $scope.SimulationConcepts[index].metricId = user.ListMetricsFilter[0].id;
                    $scope.SimulationConcepts[index].metricTitle = user.ListMetricsFilter[0].title;
                    $scope.SimulationConcepts[index].metricCountryId = user.ListMetricsFilter[0].countryId;
                    $scope.SimulationConcepts[index].individuals = user.Individuals;
                    $scope.SimulationConcepts[index].metricsTable = user.metricsTable;
                }
            }, function () {
                $scope.name = 'You decided not to enter in your name, that makes me sad.';
            });
        };

        $scope.metricsManager = function () {
            dlg = dialogs.create('modules/fcm/partials/metricsmanager.html', 'MetricsManagerController', {}, {
                key: false,
                back: 'static'
            });
            dlg.result.then(function (user) {
            }, function () {
                $scope.name = 'You decided not to enter in your name, that makes me sad.';
            });
        };

        $scope.correlationMatrix = function () {
            dlg = dialogs.create('modules/fcm/partials/correlationmatrix.html', 'CorrelationMatrixController', {}, {
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
                throw { message: JSON.stringify(err.data) };
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
            dlg = dialogs.create('modules/fcm/partials/impactanalysis.html', 'ImpactAnalysisController', {}, {
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
                name: newObj.length > 24 ? (newObj.substring(0, 21) + '...') : newObj,//Showing ... if text exceeds the limit to show
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
            var indicators = (angular.isArray($routeParams.indicator)) ? $routeParams.indicator : [$routeParams.indicator];
            angular.forEach(indicators, function (indicator) {
                console.log(indicator);
                FcmIndicator.show({ id: indicator }, function (res) {
                    $scope.addObjAutomatic(res.name, res.description);
                    console.log(res);
                }, function (err) {
                    throw { message: JSON.stringify(err.data) };
                });
            });
        }


        // add object from the form then broadcast event which triggers the directive redrawing of the chart
        // you can pass values and add them without redrawing the entire chart, but this is the simplest way
        $scope.addObj = function () {
            dlg = dialogs.create('modules/fcm/partials/addconcept.html', 'ConceptController', {}, {
                key: false,
                back: 'static'
            });
            dlg.result.then(function (user) {
                // collecting data from the form
                var newObj = user.title.length > 24 ? //Showing ... if text exceeds the limit to show
                    (user.title.substring(0, 21) + '...') : user.title;
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
            dlg = dialogs.create('modules/fcm/partials/addassociation.html', 'AssociationController', {}, {
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
                dlg = dialogs.create('modules/fcm/partials/editconcept.html', 'EditConceptController', {}, {
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
                dlg = dialogs.create('modules/fcm/partials/editassociation.html', 'EditAssociationController', {}, {
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
                dlg = dialogs.create('modules/fcm/partials/editconcept.html', 'EditConceptController', {}, {
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
                dlg = dialogs.create('modules/fcm/partials/editassociation.html', 'EditAssociationController', {}, {
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

        //Showing tooltip message
        $scope.doMouseOver = function (value, posx, posy) {
            for (i = 0; i < $scope.Concepts.length; i++) {
                if ($scope.Concepts[i].Id == value.substring(1, value.length) && $scope.Concepts[i].title.length > 24) {
                    $('#tooltipTarget').trigger('customEvent');
                    $('.tooltip-inner').html($scope.Concepts[i].title);//changing text of tooltip
                    $('.tooltip-inner').css('max-width', 'none');
                    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)//Setting tooltip position for firefox browser
                        $('.tooltip.top').css({ top: (posy - 50), left: posx });

                    $('.tooltip.top').css({ top: (posy - 50), left: (posx - 100 - (($('.tooltip-inner').width() - 200) / 2)) })
                }
            }
        };

        //Hiding tooltip message
        $scope.doMouseOut = function (value, posx, posy) {
            if ($('.tooltip-inner').length != 0)//check is tooltip is showing or not
                $('#tooltipTarget').trigger('customEvent');
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

        // The help text should be open when user click the question mark and should be closed if user click outside
        $('body').unbind('mouseup');
        $('body').mouseup(function (e) {
            for (var i = 0; i < 10; i++) {
                i = i == 0 ? '' : i;
                var container = $('[ng-class="{active: help' + i + '}"]');
                var click = $('[ng-click="help' + i + '=!help' + i + '"]');
                if (container.length > 0 && click.length > 0)
                    if ((!container.is(e.target) || !click.is(e.target)) && container.has(e.target).length === 0) {
                        if (container.attr('class').indexOf(' active') != -1)
                            $(click[0]).trigger('click');
                    }
                i = i == '' ? 0 : i;
            }
        });
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


    .controller('EditMetricsController', function ($scope, Individual, $q, $timeout, dialogs, Dataset, $modalInstance, data, FCMModelsDetail) {
        $scope.user = [
            { FCMModelId: -1 }, { title: '' }, { description: '' }, { keywords: '' }
        ];

        $scope.Models = [];
        $scope.Models = FCMModelsDetail.getModels();

        //Mark saved dataset as selected
        $scope.markSelectedDataset = function () {
            $timeout(function () {
                if ($('#filterDatasets div').length > 0 && $('#filterDatasets div a[title="Add  \'' + data.concept.metricTitle + '\'"]').length > 0) {
                    $('#filterDatasets div a[title="Add  \'' + data.concept.metricTitle + '\'"]').click();

                    //if (data.concept.metricCountryId != null && data.concept.metricCountryId != '') {
                    //    $timeout(function () {
                    //        $('li[ng-repeat="country in user.ListMetricsFilter[0].country"] a[data-id="' + data.concept.metricCountryId + '"]').click();
                    //    }, 500);
                    //}
                    //else {
                    //    console.log('0');
                    //    $scope.markSelectedDataset();
                    //}
                }
            }, 1000);
        };

        if (data.concept.metricTitle != null && data.concept.metricTitle != 'Link Datasets' && data.concept.metricTitle != '')
            $scope.markSelectedDataset();

        //Allow only one dataset selection
        $scope.$watchCollection('user.ListMetricsFilter', function (datasetsList) {
            if ($scope.user != null) {
                if ($scope.user.ListMetricsFilter != null && $scope.user.ListMetricsFilter.length > 1) {
                    $scope.user.ListMetricsFilter.splice(0, 1);
                }

                ////to populate all country list
                if ($scope.user.ListMetricsFilter != null && $scope.user.ListMetricsFilter.length > 0) {
                    if (data.concept.metricCountryId != null && data.concept.metricCountryId != '') {
                        $scope.user.ListMetricsFilter[0].countryId = data.concept.metricCountryId;
                        data.concept.metricCountryId = null;
                    }

                    $scope.user.ListMetricsFilter[0].country = [];
                    Dataset.get({ id: $scope.user.ListMetricsFilter[0].id },
                        function (dataset) {
                            console.log(dataset.data.individuals);

                            var promises = [];
                            // Resolve all Individuals first
                            angular.forEach(dataset.data.individuals, function (individualId) {
                                promises.push(Individual.getById(individualId).$promise);
                            });

                            // All Promises have to be resolved
                            $q.all(promises).then(function (individuals) {
                                angular.forEach(individuals, function (v) {
                                    $scope.user.ListMetricsFilter[0].country.push({
                                        code: v.code,
                                        data_class: v.data_class,
                                        id: v.id,
                                        title: v.title
                                    });
                                });

                                console.log('a' + $scope.user.ListMetricsFilter[0].countryId);
                                if ($scope.user.ListMetricsFilter[0].countryId != null) {
                                    $timeout(function () {
                                        $('li[ng-repeat="country in user.ListMetricsFilter[0].country"] a[data-id="' + $scope.user.ListMetricsFilter[0].countryId + '"]').click();
                                    }, 500);
                                }
                            });
                        }
                    );
                    //console.log($scope.user.ListMetricsFilter);
                }
            }
        });

        $scope.selectCountry = function (countryId, countryName) {
            $scope.user.ListMetricsFilter[0].countryId = countryId;
            $('#ddlCountryList').html(countryName);
        };

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
            //show validation error if country is not selected
            if ($scope.user.ListMetricsFilter.length > 0 && $scope.user.ListMetricsFilter[0].country != null && $scope.user.ListMetricsFilter[0].country.length > 0
                && $scope.user.ListMetricsFilter[0].countryId == null) {
                dialogs.error('Validation Error', 'Please select a country.');
            }
            else
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

        //Variables required to bind chart properties
        $scope.dataset = [];
        $scope.labels = [];
        $scope.dataset2 = [];
        $scope.labels2 = [];
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
        $scope.hideyaxeunits = true;
        $scope.NodeID = 0;
        $scope.isModelSaved = true;

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

                //Prepare data to populate chart
                var data = [];
                angular.forEach($scope.fcmImpactAnalysis.data.concepts, function (item) {
                    data.push({
                        Key: item.Id,
                        ValueX: [],
                        ValueY: [],
                        Type: "FCM"
                    });

                    angular.forEach(value.result, function (outItem) {
                        if (outItem.conceptID == item.Id) {
                            if (outItem.iteration_id < 10)
                                data[data.length - 1].ValueX.push("0" + outItem.iteration_id.toString());
                            else
                                data[data.length - 1].ValueX.push(outItem.iteration_id.toString());
                            data[data.length - 1].ValueY.push(outItem.output);
                        }
                    });

                });
                angular.forEach(data, function (item) {
                    $scope.dataset.push(item);
                    $scope.labels.push("");
                });

            }, function (err) {
                throw { message: JSON.stringify(err.data) };
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
                //declare iteration  and  output
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


                //Prepare data to populate chart
                var data = [];
                angular.forEach($scope.selectedConcept2Input, function (Concept2InputValue) {
                    data.push({
                        Key: "" + (data.length + 1),
                        ValueX: ["01", "02", "03", "04", "05"],
                        ValueY: [],
                        Type: "FCM"
                    });

                    angular.forEach($scope.selectedConceptOutput, function (item) {
                        if (item.concept2Input == Concept2InputValue)
                            data[data.length - 1].ValueY.push(item.conceptOutput);
                    });
                });

                console.log(data);
                angular.forEach(data, function (item) {
                    $scope.dataset2.push(item);
                    $scope.labels2.push("");
                });

            }, function (err) {
                throw { message: JSON.stringify(err.data) };
            });

        }; // end Impact of Two Concepts

        //Open help menu for impact analysis window
        $scope.openHelpModel = function (event, helpModelId) {
            $scope[helpModelId] = !$scope[helpModelId];
            var thisControl = $(event.target);
            var posX = (thisControl.position().left), posY = (thisControl.position().top + 40);

            var model = $('div[ng-class="{active: ' + helpModelId + '}"]');
            model.css('left', posX + 'px');
            model.css('top', posY + 'px');
        };

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
                    throw { message: error.data.message || JSON.stringify(error.data) };
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
    ]);

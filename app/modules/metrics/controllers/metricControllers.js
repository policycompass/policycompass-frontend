/**
 * Module for all Metrics Controllers
 */

angular.module('pcApp.metrics.controllers.metric', [
    'pcApp.metrics.services.metric',
    'pcApp.references.services.reference',
    'dialogs.main',
    'pcApp.adhocracyEmbedder.services.adhocracy'
])


    .controller('CreateMetric1Controller', [
        '$scope',
        '$modal',
        'API_CONF',
        '$http',
        'MetricsControllerHelper',
        'FormulaHelper',
        '$location',
        'Auth',
        function ($scope, $modal, API_CONF, $http, MetricsControllerHelper, FormulaHelper, $location, Auth) {

            $scope.user = Auth;
            $scope.FormulaHelper = FormulaHelper;
            $scope.sortOptions = [{"name": "Title", "sort": "name"}, {"name": "Date updated", "sort": "-date"}]

            if (!$scope.user.state.loggedIn) {
                $location.path("/login");
            } else {
                $scope.metrics_controller_helper = MetricsControllerHelper;
                $scope.metrics_controller_helper.init();

                $scope.variableIndex = 1;
                $scope.showFunctions = false;

                $scope.toggleFunctions = function () {
                    $scope.showFunctions = !$scope.showFunctions;
                }

                // FIXME: MOVE TO SERVICE
                $scope.addIndicator = function (indicator) {
                    var i = "__" + $scope.variableIndex + "__";
                    if (angular.isUndefined($scope.cursorPosVal) || angular.isUndefined($scope.metrics_controller_helper.metricsdata.formula)) {
                        if (angular.isUndefined($scope.metrics_controller_helper.metricsdata.formula)) {
                            $scope.metrics_controller_helper.metricsdata.formula = "";
                        }
                        $scope.metrics_controller_helper.metricsdata.formula = $scope.metrics_controller_helper.metricsdata.formula + i;
                    } else {
                        $scope.metrics_controller_helper.metricsdata.formula = [
                            $scope.metrics_controller_helper.metricsdata.formula.slice(0, $scope.cursorPosVal),
                            i,
                            $scope.metrics_controller_helper.metricsdata.formula.slice($scope.cursorPosVal)
                        ].join('');
                        $scope.cursorPosVal = undefined;
                    }
                    $scope.variableIndex += 1;
                    $scope.metrics_controller_helper.metricsdata.variables[i] = {
                        "type": "indicator",
                        "id": indicator.id
                    }
                };

                $scope.getCursorPosition = function (event) {
                    $scope.cursorPosVal = $scope.FormulaHelper.getCursorPosition(event);
                };

                $scope.clearErrors = function () {
                    $scope.servererror = undefined;
                }

                $scope.submitFormula = function () {
                    var url = API_CONF.FORMULA_VALIDATION_URL;
                    if ($scope.formulaForm.$valid) {
                        $http({
                            url: url,
                            method: 'get',
                            params: {
                                formula: $scope.metrics_controller_helper.metricsdata.formula,
                                variables: $scope.metrics_controller_helper.metricsdata.variables
                            }
                        }).then(function (response) {
                            $location.path("/metrics/create-2")
                        }, function (response) {
                            $scope.servererror = response.data;
                        });
                    }
                };
            }


        }
    ])


    .controller('CreateMetric2Controller', [
        '$scope',
        '$modal',
        '$http',
        'API_CONF',
        'MetricsControllerHelper',
        '$location',
        function ($scope, $modal, $http, API_CONF, MetricsControllerHelper, $location) {

            $scope.metrics_controller_helper = MetricsControllerHelper;

            $scope.is_draft = true;

            $scope.submitData = function (applyAfterwards) {
                $scope.metrics_controller_helper.metricsdata.is_draft = $scope.is_draft;
                var url = API_CONF.METRICS_MANAGER_URL + "/metrics";

                if ($scope.metadataForm.$valid) {
                    $http.post(url, $scope.metrics_controller_helper.metricsdata).then(function (response) {
                        if (applyAfterwards) {
                            $scope.metrics_controller_helper.clear()
                            $location.path("/metrics/" + response.data.id + "/apply-1");
                        } else {
                            $scope.metrics_controller_helper.clear()
                            $location.path("/metrics/" + response.data.id);
                        }
                    }, function (response) {
                        $scope.servererror = response.data;
                    });
                }
            };

            $scope.clearErrors = function () {
                $scope.servererror = undefined;
            }

            $scope.prevStep = function () {
                $location.path("/metrics/create-1");
            }
        }
    ])


    .controller('ApplyMetric1Controller', [
        '$scope',
        '$routeParams',
        'ApplyMetricHelper',
        '$location',
        'Auth',
        function ($scope, $routeParams, ApplyMetricHelper, $location, Auth) {

            $scope.user = Auth;

            if (!$scope.user.state.loggedIn) {
                $location.path("/login")
            } else {
                $scope.apply_metric_helper = ApplyMetricHelper;
                $scope.apply_metric_helper.init($routeParams.metricId);
                $scope.error = true;

                $scope.submit = function () {
                    _.each($scope.apply_metric_helper.data.datasets, function (value, key) {
                        delete value['indicator'];
                    });
                    $location.path("/metrics/" + $routeParams.metricId + "/apply-2")
                };

                $scope.$watch('apply_metric_helper.data.datasets', function (newvalue, oldvalue) {
                    var notValid = true;
                    _.each(newvalue, function (value, key) {
                        notValid = !(value.dataset > 0);
                    });
                    $scope.error = notValid;
                }, true);

                $scope.highlightIndicator = function (variable, event) {
                    var target = angular.element('#variable' + variable);
                    target.css('background', 'linear-gradient(to bottom, #9ac1e3, #72a9d8)');
                    target.css('color', 'white');
                    target.css('border-color', '#3177b3');

                    var el = event.currentTarget;
                    var span = angular.element(el.children[0].children[0]);
                    span.css('background', 'linear-gradient(to bottom, #9ac1e3, #72a9d8)');
                    span.css('color', 'white');
                    span.css('border-color', '#3177b3');
                };

                $scope.unhighlightIndicator = function (variable, event) {
                    var target = angular.element('#variable' + variable);
                    target.css('background', 'transparent');
                    target.css('border', '1px solid #ffd964');
                    target.css('color', '#b75c6f');

                    var el = event.currentTarget;
                    var span = angular.element(el.children[0].children[0]);
                    span.css('background', 'transparent');
                    ;
                    span.css('border', '1px solid #ffd964');
                    span.css('color', '#4d4d4d');
                };
            }
        }
    ])

    .controller('ApplyMetric2Controller', [
        '$scope',
        '$routeParams',
        'API_CONF',
        '$http',
        'ApplyMetricHelper',
        '$location',
        function ($scope, $routeParams, API_CONF, $http, ApplyMetricHelper, $location) {

            $scope.apply_metric_helper = ApplyMetricHelper;
            $scope.apply_metric_helper.init($routeParams.metricId);

            $scope.submit = function (applyAgain) {
                var url = API_CONF.METRICS_MANAGER_URL + "/metrics/" + $routeParams.metricId + '/operationalize';
                $http.post(url, $scope.apply_metric_helper.data).then(function (response) {
                    if (applyAgain) {
                        $location.path("/metrics/" + $routeParams.metricId + "/apply-1");
                    } else {
                        $scope.apply_metric_helper.clear();
                        $scope.apply_metric_helper.getDatasets($routeParams.metricId);
                        $location.path("/datasets/" + response.data.dataset.id);
                    }
                }, function (response) {
                    $scope.servererror = response.data;
                });
            };

        }
    ])

    .controller('MetricsmanagerDetailController', [
        '$scope',
        '$routeParams',
        '$location',
        'MetricService',
        'IndicatorService',
        'Auth',
        'dialogs',
        function ($scope, $routeParams, $location, MetricService, IndicatorService, Auth, dialogs) {

            // FIXME: MOVE TO SERVICE
            var isOwner = function (userpath) {
                return Auth.state.userPath === userpath;
            };

            // FIXME: MOVE TO SERVICE
            var isAdmin = function () {
                if (Auth.state.isAdmin) {
                    return true;
                } else {
                    return false;
                }
            };

            // FIXME: MOVE TO SERVICE
            $scope.allowEdit = function (userpath) {
                return (isAdmin() || isOwner(userpath));
            };

            $scope.deleteMetric = function (metric) {
                var dlg = dialogs.confirm("Are you sure?", "Do you want to delete the Dataset " + metric.title + " permanently?");
                dlg.result.then(function () {
                    // Delete the dataset via the API
                    metric.$delete({}, function () {
                        $location.path('/metrics');
                    });
                });
            };

            $scope.data = MetricService.get({id: $routeParams.metricId}, function (metric) {
                var indicator_id = metric.indicator_id;
                $scope.indicator = IndicatorService.get({id: indicator_id}, function (indicator) {
                }, function (err) {
                    throw {message: JSON.stringify(err.data)};
                });
            }, function (err) {
                throw {message: JSON.stringify(err.data)};
            });
        }
    ])

    .controller('MetricsmanagerEditController', [
        '$scope',
        '$routeParams',
        '$location',
        '$http',
        'API_CONF',
        'MetricService',
        'IndicatorService',
        'FormulaHelper',
        'Auth',
        function ($scope, $routeParams, $location, $http, API_CONF, MetricService, IndicatorService, FormulaHelper, Auth) {

            // FIXME: MOVE TO SERVICE
            var isOwner = function (userpath) {
                return Auth.state.userPath === userpath;
            };

            // FIXME: MOVE TO SERVICE
            var isAdmin = function () {
                if (Auth.state.isAdmin) {
                    return true;
                } else {
                    return false;
                }
            };

            // FIXME: MOVE TO SERVICE
            var allowEdit = function (userpath) {
                return (isAdmin() || isOwner(userpath));
            };

            var getNumber = function(key) {
                var newKey = key.replace("__", "").replace("__", "");
                return Number(newKey);
            }

            var getIndex = function(variables){
                var keys = Object.keys(variables);
                var numberlist = _.map(keys, getNumber);
                return Math.max.apply( Math, numberlist );
            };

            $scope.FormulaHelper = FormulaHelper;
            $scope.showFunctions = false;
            $scope.toggleFunctions = function() {
                $scope.showFunctions = !$scope.showFunctions;
            };



            MetricService.get({id: $routeParams.metricId}, function (metric)
                {

                    $scope.data = metric;
                    $scope.canDraft = $scope.data.is_draft;
                    $scope.variableIndex = getIndex(metric.variables) + 1;
                    var indicator_id = metric.indicator_id;
                    IndicatorService.get({id: indicator_id}, function (indicator)
                        {
                            $scope.indicator = indicator;
                        },
                        function (err) {
                            throw {message: JSON.stringify(err.data)};
                        }
                    );
                    IndicatorService.query(function (indicators)
                        {
                            $scope.indicators = indicators.results;
                        },
                        function (err) {
                            throw {message: JSON.stringify(err.data)};
                        }
                    );

                },
                function (err) {
                    throw {message: JSON.stringify(err.data)};
                }
            );


            $scope.submit = function() {
                var url = API_CONF.METRICS_MANAGER_URL + "/metrics/" + $routeParams.metricId;

                $http.put(url, $scope.data).then(function (response) {
                    $location.path(/metrics/ + $routeParams.metricId);
                }, function (response) {
                    $scope.servererror = response.data;
                });
            };

            $scope.cancel = function() {
                $location.path(/metrics/ + $routeParams.metricId);
            };

            // FIXME: MOVE TO SERVICE
            $scope.addIndicator = function (indicator) {
                    var i = "__" + $scope.variableIndex + "__";
                    if (angular.isUndefined($scope.cursorPosVal) || angular.isUndefined($scope.data.formula)) {
                        if (angular.isUndefined($scope.data.formula)) {
                            $scope.data.formula = "";
                        }
                        $scope.data.formula = $scope.data.formula + i;
                    } else {
                        $scope.data.formula = [
                            $scope.data.formula.slice(0, $scope.cursorPosVal),
                            i,
                            $scope.data.formula.slice($scope.cursorPosVal)
                        ].join('');
                        $scope.cursorPosVal = undefined;
                    }
                    $scope.variableIndex += 1;
                    $scope.data.variables[i] = {
                        "type": "indicator",
                        "id": indicator.id
                    }
                };


            $scope.getCursorPosition = function (event) {
                $scope.cursorPosVal = $scope.FormulaHelper.getCursorPosition(event);
            };
        }
    ])


/**
 * Controller for the list of metrics
 */
    .controller('MetricsController', [
        '$scope', 'Metric', '$log', '$routeParams', function ($scope, Metric, $log, $routeParams) {

            // Retrieve the metrics from the Metrics Service
            $scope.metrics = Metric.query({page: $routeParams.page}, function (metricList) {
            }, function (err) {
                throw {message: JSON.stringify(err.data)};
            });

        }
    ]);

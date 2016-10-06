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
        'API_CONF',
        '$http',
        'MetricsControllerHelper',
        'FormulaHelper',
        '$location',
        'Auth',
        function ($scope, API_CONF, $http, MetricsControllerHelper, formulaHelper, $location, Auth) {
            $scope.sortOptions = [{"name": "Title", "sort": "name"}, {"name": "Date updated", "sort": "-date"}]

            $scope.metricsHelper = MetricsControllerHelper;
            $scope.metricsHelper.init();
            $scope.showFunctions = false;

            $scope.toggleFunctions = function () {
                $scope.showFunctions = !$scope.showFunctions;
            }

            $scope.submitFormula = function (path) {
                var formula = $scope.metricsHelper.metricsdata.formula
                var variables = $scope.metricsHelper.metricsdata.variables

                formulaHelper.validate(formula, variables).then(function (response) {
                    $location.path(path)
                }, function (response) {
                    $scope.servererror = response.data;
                });
            };

            $scope.addIndicator = function(indicator) {
                $scope.$broadcast('AddVariable', { type: 'indicator', id: indicator.id, indicator: indicator });
            };

            $scope.addDataset = function(dataset) {
                $scope.$broadcast('AddVariable', { 'type': 'dataset', id: dataset.id, dataset: dataset});
            };

            $scope.$watch('metricsHelper.metricsdata.formula', function () {
                $scope.servererror = undefined;
            });
          }
    ])


    .controller('CreateMetric2Controller', [
        'Auth',
        '$scope',
        '$http',
        'API_CONF',
        'MetricsControllerHelper',
        '$location',
        'dialogs',
        function (Auth, $scope, $http, API_CONF, MetricsControllerHelper, $location, dialogs) {

            $scope.user = Auth;
            $scope.metricsHelper = MetricsControllerHelper;

            $scope.is_draft = true;

            $scope.submitData = function (applyAfterwards) {
                $scope.metricsHelper.metricsdata.is_draft = $scope.is_draft;
                var url = API_CONF.METRICS_MANAGER_URL + "/metrics";

                if ($scope.metadataForm.$valid) {
                    $scope.metricsHelper.transformVariables();
                    $http.post(url, $scope.metricsHelper.metricsdata).then(function (response) {
                        if (applyAfterwards) {
                            $scope.metricsHelper.clear()
                            $location.path("/metrics/" + response.data.id + "/apply-1");
                        } else {
                            $scope.metricsHelper.clear()
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

            $scope.goToLogin = function () {
                $location.path("/login");
            }

            $scope.abort = function () {
                var dialog = dialogs.confirm("Are you sure?", "Do you want to revert your changes in this metric?");
                dialog.result.then(function () {
                    MetricsControllerHelper.clear();
                    $location.path("/metrics/create-1");
                });
            }
        }
    ])

    .controller('CalculateDatasetController', [
        'Auth',
        '$scope',
        '$http',
        'API_CONF',
        'MetricsControllerHelper',
        '$location',
        'dialogs',
        function (Auth, $scope, $http, API_CONF, MetricsControllerHelper, $location, dialogs) {

            $scope.user = Auth;
            $scope.metricsHelper = MetricsControllerHelper;

            $scope.data = {
                title: '',
                formula: $scope.metricsHelper.metricsdata.formula,
                datasets: _.map($scope.metricsHelper.metricsdata.variables, function(value, key){
                    return {
                        'variable': key,
                        'dataset': value.id
                    }
                }),
                indicator_id: '',
                unit_id: ''
            }

            $scope.clear = function() {
                $scope.data = {
                    title: '',
                    formula: $scope.metricsHelper.metricsdata.formula,
                    datasets: _.map($scope.metricsHelper.metricsdata.variables, function(value, key){
                        return {
                            'variable': key,
                            'dataset': value.id
                        }
                    }),
                    indicator_id: '',
                    unit_id: ''
                }
            }

            $scope.submitData = function () {
                $scope.metricsHelper.metricsdata.is_draft = $scope.is_draft;
                var url = API_CONF.METRICS_MANAGER_URL + "/calculate";

                if ($scope.datasetForm.$valid) {
                    $http.post(url, $scope.data).then(function (response) {
                        $scope.metricsHelper.clear();
                        $location.path("/datasets/" + response.data.dataset.id);
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

            $scope.goToLogin = function () {
                $location.path("/login");
            }

            $scope.abort = function () {
                var dialog = dialogs.confirm("Are you sure?", "Do you want to revert your changes in this dataset?");
                dialog.result.then(function () {
                    MetricsControllerHelper.clear();
                    $scope.clear();
                    $location.path("/metrics/create-1");
                });
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

            $scope.applyHelper = ApplyMetricHelper;
            $scope.applyHelper.init($routeParams.metricId);
            $scope.error = true;

            $scope.submit = function () {
                _.each($scope.applyHelper.data.datasets, function (value, key) {
                    delete value['indicator'];
                });
                $location.path("/metrics/" + $routeParams.metricId + "/apply-2")
            };

            $scope.$watch('applyHelper.data.datasets', function (newvalue, oldvalue) {
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
    ])

    .controller('ApplyMetric2Controller', [
        '$scope',
        '$routeParams',
        'API_CONF',
        '$http',
        'ApplyMetricHelper',
        '$location',
        'Auth',
        'dialogs',
        function ($scope, $routeParams, API_CONF, $http, ApplyMetricHelper, $location, Auth, dialogs) {

            $scope.user = Auth;
            $scope.applyHelper = ApplyMetricHelper;
            $scope.applyHelper.init($routeParams.metricId);

            $scope.submit = function (applyAgain) {
                var url = API_CONF.METRICS_MANAGER_URL + "/metrics/" + $routeParams.metricId + '/operationalize';
                $http.post(url, $scope.applyHelper.data).then(function (response) {
                    if (applyAgain) {
                        $location.path("/metrics/" + $routeParams.metricId + "/apply-1");
                    } else {
                        $scope.applyHelper.clear();
                        $scope.applyHelper.getDatasets($routeParams.metricId);
                        $location.path("/datasets/" + response.data.dataset.id);
                    }
                }, function (response) {
                    $scope.servererror = response.data;
                });
            };

            $scope.goToLogin = function () {
                $location.path("/login");
            }

            $scope.abort = function () {
                var dialog = dialogs.confirm("Are you sure?", "Do you want not to save this metric application?");
                dialog.result.then(function () {
                    $location.path("/metrics/" + $routeParams.metricId + "/apply-1");
                });
            }
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
            $scope.user = Auth.state;
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
        'Auth',
        'dialogs',
        '$q',
        function ($scope, $routeParams, $location, $http, API_CONF, MetricService, IndicatorService, Auth, dialogs, $q) {

            $scope.user = Auth.state

            var getNumber = function(key) {
                var newKey = key.replace("__", "").replace("__", "");
                return Number(newKey);
            }

            var getIndex = function(variables){
                var keys = Object.keys(variables);
                var numberlist = _.map(keys, getNumber);
                return Math.max.apply( Math, numberlist );
            };

            $scope.showFunctions = false;
            $scope.toggleFunctions = function() {
                $scope.showFunctions = !$scope.showFunctions;
            };

            $scope.addIndicator = function(indicator) {
                $scope.$broadcast('AddVariable', { type: 'indicator', id: indicator.id, indicator: indicator });
            };

            $scope.$watch('data.formula', function () {
                $scope.servererror = undefined;
            });

            MetricService.get(
                {id: $routeParams.metricId},
                function (metric){
                    $scope.canDraft = metric.is_draft;
                    $scope.variableIndex = getIndex(metric.variables) + 1;
                    var indicator_id = metric.indicator_id;

                    var promises = _.mapObject(metric.variables, function(variable) {
                        return IndicatorService.get({id: variable.id}).$promise;
                    });

                    $q.all(promises).then(function(indicators) {
                        var variables = _.mapObject(metric.variables, function(variable, key) {
                            variable.indicator = indicators[key];
                            return variable;
                        });

                        metric.variables = variables;
                        $scope.data = metric;
                    });

                    IndicatorService.get(
                        {id: indicator_id},
                        function (indicator){
                            $scope.indicator = indicator;
                        },
                        function (err) {
                            throw {message: JSON.stringify(err.data)};
                        }
                    );
                    IndicatorService.query(
                        function (indicators){
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
                var canEdit = Auth.state.isAdmin || Auth.state.isCreator($scope.data);

                if (canEdit) {
                    var url = API_CONF.METRICS_MANAGER_URL + "/metrics/" + $routeParams.metricId;
                    $http.put(url, $scope.data).then(function (response) {
                        $location.path(/metrics/ + $routeParams.metricId);
                    }, function (response) {
                        $scope.servererror = response.data;
                    });
                } else {
                    var url = API_CONF.METRICS_MANAGER_URL + "/metrics";
                    $scope.data.derived_from_id = $routeParams.metricId
                    $http.post(url, $scope.data).then(function (response) {
                        var newMetricId = response.data.id;
                        $location.path(/metrics/ + newMetricId);
                    }, function (response) {
                        $scope.servererror = response.data;
                    });
                }
            };

            $scope.goToLogin = function () {
                $location.path("/login");
            };

            $scope.cancel = function () {
                var dialog = dialogs.confirm("Are you sure?", "Do you want to revert your changes in this metric?");
                dialog.result.then(function () {
                    $location.path("/metrics/");
                });
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
    ])

/**
 * Services for the Metrics Manager.
 * Those factories provide adapters for the RESTful API of the Metrics Manager.
 * They are built on top of AngularJS' Resource module.
 */

// As the API does not allow to not-paginate, we simply put in a large number
// as page_size.
var LARGE_NUMBER = 100000;

angular.module('pcApp.metrics.services.metric', [
    'ngResource', 'pcApp.config'
])

/**
 * Factory for the Resource for metrics
 */
    .factory('MetricService', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            // Get the base URL from the configuration
            var url = API_CONF.METRICS_MANAGER_URL + "/metrics/:id";
            var Metric = $resource(url, {
                id: "@id"
            }, {
                // Add support for update
                'update': {method: 'PUT'},
                'query': {
                    method: 'GET',
                    isArray: false
                }
            });
            return Metric;
        }
    ])

/**
 * Factory for getting an Indicator, which connects to the Indicator endpoint
 * FIX ME: Should I use the Service from the indicator app?
 */
    .factory('IndicatorService', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            // Get the base URL from the configuration
            var url = API_CONF.INDICATOR_SERVICE_URL + "/indicators/:id";
            var Indicator = $resource(url, {
                id: "@id",
                page_size: LARGE_NUMBER
            }, {
                'update': {method: 'PUT'},
                'query': {
                    method: 'GET',
                    isArray: false
                }
            });
            return Indicator;
        }
    ])

/**
 * Factory for getting an Dataset, which connects to the Indicator endpoint
 */
    .factory('DatasetService', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.DATASETS_MANAGER_URL + "/datasets/:id";
            var Dataset = $resource(url, {
                id: "@id",
                page_size: LARGE_NUMBER
            }, {
                'update': {method: 'PUT'},
                'query': {
                    method: 'GET',
                    isArray: false
                }
            });
            return Dataset;
        }
    ])

/**
 * Factory to get Normalizers
 *
 */
    .factory('NormalizerService', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            // Get the base URL from the configuration
            var url = API_CONF.NORMALIZERS_URL;
            var Normalizer = $resource(url, {
                'query': {
                    method: 'GET',
                    isArray: false
                }
            });
            return Normalizer;
        }
    ])

/**
 * Factory to get create formula
 *
 */
    .factory('FormulaHelper', ['$http', 'API_CONF', function ($http, API_CONF) {
        var helper = {
            formula: "",
            variableIndex: 1,
            variables: {},
            cursorPosition: undefined,
        };

        helper.reset = function(formula, variables) {
            this.formula = formula || "";
            this.variables = variables || {};
            this.variableIndex = variables ? Object.keys(variables).length + 1 : 1;
            this.cursorPosition = undefined;
        };

        helper.updateCursor = function (event) {
            var oField = event.target;
            var iCaretPos = 0;

            // IE Support
            if (document.selection) {
                oField.focus();
                var oSel = document.selection.createRange();
                oSel.moveStart('character', -oField.value.length);
                iCaretPos = oSel.text.length;
            }

            else if (oField.selectionStart || oField.selectionStart == '0') {
                iCaretPos = oField.selectionStart;
            }
            this.cursorPosition = iCaretPos;
        };

        helper.addIndicator = function (dataset) {
            var i = "__" + this.variableIndex + "__";
            var cursorPosition = this.cursorPosition;

            if (angular.isUndefined(this.formula)) {
                this.formula = '';
            }

            if (angular.isUndefined(cursorPosition)) {
                this.formula = this.formula + i;
            } else {
                this.formula = [
                    this.formula.slice(0, cursorPosition),
                    i,
                    this.formula.slice(cursorPosition)
                ].join('');
            }
            this.variableIndex += 1;
            this.variables[i] = {
                "type": "dataset",
                "id": dataset.id,
            };
        };

        helper.validate = function() {
            var url = API_CONF.FORMULA_VALIDATION_URL;
            return $http({
                url: url,
                method: 'get',
                params: {
                    formula: this.formula,
                    variables: this.variables
                }
            });
        }

        return helper;
    }])

/**
 * Factory to create Metric using a wizard
 */
    .factory('MetricsControllerHelper', [
        'IndicatorService', 'DatasetService', 'NormalizerService', 'FormulaHelper',
        function (IndicatorService, DatasetService, NormalizerService, FormulaHelper) {

            var helper = {
                metricsdata: {
                    title: "",
                    formula: "",
                    description: "",
                    keywords: "",
                    variableIndex: 1,
                    variables: {}
                }
            };

            helper.clear = function () {
                helper.metricsdata = {
                    title: "",
                    formula: "",
                    description: "",
                    keywords: "",
                    variableIndex: 1,
                    variables: {}
                };
            }

            helper.transformVariables = function () {
                newVariables = {};
                _.each(helper.metricsdata.variables, function(variable, key){
                    var datasetIndex = _.findIndex(helper.datasets, {'id': variable.id});
                    var dataset = helper.datasets[datasetIndex];
                    var indicatorId = dataset.indicator_id;
                    newVariables[key] = {
                        type: 'indicator',
                        id: indicatorId
                    }
                })
                helper.metricsdata.variables = newVariables;
            }

            helper.init = function () {
                if (!helper.metricsdata) {
                    helper.clear();
                }

                var indicators = IndicatorService.query(function () {
                    helper.indicators = _.map(indicators.results, function (indicator) {
                        return {
                            name: indicator.name,
                            unit_category: indicator.unit_category,
                            id: indicator.id,
                            date: indicator.modified
                        };
                    });
                }, function (err) {
                    throw {message: JSON.stringify(err.data)};
                });

                var datasets = DatasetService.query(function () {
                    helper.datasets = _.map(datasets.results, function (dataset) {
                        return {
                            name: dataset.title,
                            unit: dataset.unit_id,
                            id: dataset.id,
                            date: dataset.date_modified,
                            indicator_id: dataset.indicator_id
                        };
                    });
                }, function (err) {
                    throw {message: JSON.stringify(err.data)};
                });
                helper.normalizers = NormalizerService.query(function () {
                }, function (err) {
                    throw {message: JSON.stringify(err.data)};
                });
            }

            helper.getFormulaHelper = function() {
                var formulaHelper = FormulaHelper;
                formulaHelper.reset(this.metricsdata.formula, this.metricsdata.variables);
                return formulaHelper;
            }

            return helper;
        }
    ])

/**
 * Factory to operationalize Metric using a wizard
 */
    .factory('ApplyMetricHelper', [
        'MetricService', 'IndicatorService', function (MetricService, IndicatorService) {

            var datasets = {};
            var _metric_id;

            datasets.clear = function () {
                datasets.data = {
                    title: "",
                    unit_id: "",
                    datasets: []
                };
            }

            datasets.getDatasets = function (metric_id) {
                datasets.metric = MetricService.get({id: metric_id}, function (metric) {
                    var variablesJson = datasets.metric.variables;
                    _.each(variablesJson, function (value, key) {
                        datasets.data.datasets.push({
                            variable: key.trim(),
                            dataset: -1,
                            indicator: value.id
                        });
                    });
                    IndicatorService.get({id: metric.indicator_id}, function (indicator) {
                        datasets.unit_category_id = indicator.unit_category;
                    });
                }, function (err) {
                    throw {message: JSON.stringify(err.data)};
                });
            }

            datasets.init = function (metric_id) {

                if (_metric_id !== metric_id) {
                    _metric_id = metric_id;

                    datasets.clear();
                    datasets.getDatasets(metric_id);
                }
            };
            return datasets;
        }
    ]);

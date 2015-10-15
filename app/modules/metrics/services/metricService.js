/**
 * Services for the Metrics Manager.
 * Those factories provide adapters for the RESTful API of the Metrics Manager.
 * They are built on top of AngularJS' Resource module.
 */

angular.module('pcApp.metrics.services.metric',[
    'ngResource',
    'pcApp.config'
])

/**
 * Factory for the Resource for metrics
 */
.factory('MetricService',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    // Get the base URL from the configuration
    var url = API_CONF.METRICS_MANAGER_URL + "/metrics/:id";
    var Metric = $resource(url,
        {
            id: "@id"
        },
        {
            // Add support for update
            'update': { method:'PUT' },
            'query': {
                method: 'GET',
                isArray: false
            }
        }
    );
    return Metric;
}])

/**
 * Factory for getting an Indicator, which connects to the Indicator endpoint
 * FIX ME: Should I use the Service from the indicator app?
 */
.factory('IndicatorService',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    // Get the base URL from the configuration
    var url = API_CONF.INDICATOR_SERVICE_URL + "/indicators/:id";
    var Indicator = $resource(url,
        {
            id: "@id"
        },
        {
            'update': { method:'PUT' },
            'query': {
                method: 'GET',
                isArray: false
            }
        }
    );
    return Indicator;
}])

/**
 * Factory to get Normalizers
 *
 */
.factory('NormalizerService',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    // Get the base URL from the configuration
    var url = API_CONF.NORMALIZERS_URL;
    var Normalizer = $resource(url,
        {
            'query': {
                method: 'GET',
                isArray: false
            }
        }
    );
    return Normalizer;
}])

/**
 * Factory to create Metric using a wizard
 */

.factory('MetricsControllerHelper', ['IndicatorService', 'NormalizerService', function (IndicatorService, NormalizerService){

    var helper = {};

    helper.clear = function() {
        helper.metricsdata = {
            title: "",
            formula: "",
            acronym: "",
            description: "",
            keywords: "",
            variables: {}
        };
    }

    helper.init = function() {
        helper.clear();

        var indicators = IndicatorService.query(
            function() {
                helper.indicators = _.map(indicators.results, function(indicator) {
                    return {
                        name: indicator.name,
                        acronym: indicator.acronym,
                        unit_category: indicator.unit_category,
                        id: indicator.id
                    };
                });
            },
            function(err) {
                throw { message: JSON.stringify(err.data)};
            }
        );

        helper.normalizers = NormalizerService.query(
            function() {},
            function(err) {
                throw { message: JSON.stringify(err.data)};
            }
        );
    }

    return helper;
}])

/**
 * Factory to operationalize Metric using a wizard
 */
.factory('ApplyMetricHelper', ['MetricService', function (MetricService){

    var datasets = {};
    var _metric_id;

    datasets.clear = function() {
        datasets.data = {
            title: "",
            acronym: "",
            datasets: []
        };
    }

    datasets.getDatasets = function(metric_id) {
        datasets.metric = MetricService.get({id: metric_id},
                function(metric) {
                    var variablesJson = datasets.metric.variables;
                    _.each(variablesJson, function(value, key){
                        datasets.data.datasets.push({variable : key.trim(), dataset: -1, indicator: value.id });
                    });
                },
                function(err) {
                    throw { message: JSON.stringify(err.data)};
                }
            );
    }

    datasets.init = function(metric_id) {

        if(_metric_id !== metric_id){
            _metric_id = metric_id;

            datasets.clear();
            datasets.getDatasets(metric_id);
        }
    };
    return datasets;
}]);

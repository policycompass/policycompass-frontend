/**
 * Services for connecting to the Indicator Service.
 * Those factories provide adapters for the RESTful API of the Indicator Service.
 * They are built on top of AngularJS' Resource module.
 */

angular.module('pcApp.indicators.services.indicator', [
    'ngResource',
    'pcApp.config'
])

/**
 * Factory for getting an Indicator, which connects to the Indicator endpoint
 */
    .factory('Indicator', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.INDICATOR_SERVICE_URL + "/indicators/:id";
            var Indicator = $resource(url, {
                id: "@id"
            }, {
                'update': {method: 'PUT'}
            });
            return Indicator;
        }
    ]);

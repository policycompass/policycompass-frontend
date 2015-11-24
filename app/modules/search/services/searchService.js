/**
 * Services for the Search Manager.
 * Those factories provide adapters for the Elastic Search API.
 */

angular.module('pcApp.search.services.search', [
    'elasticsearch',
    'pcApp.config'
])

/**
 * Elastic Search Factory
 */
    .service('searchclient', function (esFactory, $location, API_CONF) {
        //Instantiate Elastic Search client service
        var curHost = API_CONF.ELASTIC_URL;
        return esFactory({
            host: curHost,
            log: 'trace'
        });
    });

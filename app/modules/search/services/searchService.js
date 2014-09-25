/**
 * Services for the Search Manager.
 * Those factories provide adapters for the Elastic Search API.
 */

angular.module('pcApp.search.services.search',[
    'elasticsearch',
    'pcApp.config'
])

/**
 * Elastic Search Factory
 */
.service('searchclient', function (esFactory,API_CONF) {
        //TODO-PUT SERVER URL VARIABLE here
	return esFactory({
		host: 'localhost:9000',
		log: 'trace'
	});
});

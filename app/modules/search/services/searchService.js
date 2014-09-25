/**
 * Services for the Search Manager.
 * Those factories provide adapters for the Elastic Search API.
 */

angular.module('pcApp.search.services.search', [
  'elasticsearch'
])

/**
 * Elastic Search Factory
 */
.service('searchclient', function(esFactory, $location) {
  //Instantiate Elastic Search client service
  var curHost = $location.host() + ":" + $location.port();
  return esFactory({
    host: curHost,
    log: 'trace'
  });
});

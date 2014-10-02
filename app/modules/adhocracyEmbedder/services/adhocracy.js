angular.module('pcApp.adhocracyEmbedder.services.adhocracy', [
])

/**
 * Adhocracy service
 *
 * Allow to interact with the Adhocracy embed SDK.
 *
 * Currently returns a promise, because the init function is asynchronous.
 */
.factory('Adhocracy',  ["$q", "API_CONF", function($q, API_CONF) {
    var deferred = $q.defer();
    adhocracy.init(API_CONF.ADHOCRACY_URL, function(result) {
        deferred.resolve(result)
    });
    return deferred.promise;
}]);

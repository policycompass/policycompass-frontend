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
    $.ajax({
        url: API_CONF.ADHOCRACY_FRONTEND_URL + "/static/js/AdhocracySDK.js",
        dataType: "script",
        success: function() {
            adhocracy.init(API_CONF.ADHOCRACY_FRONTEND_URL, function(result) {
                deferred.resolve(result)
            });
        }
    });
    return deferred.promise;
}]);

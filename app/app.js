
var pcApp = angular.module('pcApp', [
    'ngRoute',
    'ui.bootstrap',
    'pcApp.metrics',
    'pcApp.common',
    'pcApp.developer'
])

/**
 * Setting the Token always to 1
 * Just for development!
 */
.run(function($http, $rootScope, $location) {
    $http.defaults.headers.common.Authorization = 'Token 1'
    $rootScope.location = $location;
})


/**
 * Very simple central error handling
 */
.factory('$exceptionHandler', ['$injector', '$log', function ($injector, $log) {
    return function (exception, cause) {
        var $rootScope = $injector.get("$rootScope");
        $rootScope.error = exception.message;
        $log.error(exception.message);
    };
}]);

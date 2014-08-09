
var pcApp = angular.module('pcApp', [
    'ngRoute',
    'ui.bootstrap',
    'pcApp.metrics',
    'pcApp.visualization',
    'pcApp.events',
    'pcApp.common',
    'pcApp.developer'
])

/**
 * Setting the Token always to 1
 * Just for development!
 */
.run(function($http) {
    $http.defaults.headers.common.Authorization = 'Token 1'
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

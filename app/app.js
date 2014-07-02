
var pcApp = angular.module('pcApp', [
    'ngRoute',
    'ui.bootstrap',
    'pcApp.metrics',
    'pcApp.common'
]);

/**
 * Setting the Token always to 1
 * Just for development!
 */
pcApp.run(function($http) {
    $http.defaults.headers.common.Authorization = 'Token 1'
});

/**
 * Very simple central error handling
 */
pcApp.factory('$exceptionHandler', ['$injector', '$log', function ($injector, $log) {
    return function (exception, cause) {
        var $rootScope = $injector.get("$rootScope");
        $rootScope.error = exception.message;
        $log.error(exception.message);
    };
}]);

/**
 * Initializes all need modules
 *
 */
var pcApp = angular.module('pcApp', [
    'ngRoute',
    'ui.bootstrap',
    'pcApp.metrics',
    'pcApp.common',
    'pcApp.developer',
    'dialogs.main',
    'dialogs.default-translations'
])

/**
 * Setting the Token always to 1
 * Just for development!
 */
.run(function($http, $rootScope, $location, $translate) {
    $http.defaults.headers.common.Authorization = 'Token 1';
    $rootScope.location = $location;

})

/**
 * Very simple central error handling
 */
.factory('$exceptionHandler', ['$injector', '$log',  function ($injector, $log) {
    return function (exception, cause) {
        // Use the dialogs module to display error messages
        var dialogs =  $injector.get("dialogs");
        dialogs.notify("Error", String(exception.message));
        $log.error(exception.message);
    };
}]);

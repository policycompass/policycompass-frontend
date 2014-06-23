
var pcApp = angular.module('pcApp', ['ngRoute', 'ui.bootstrap', 'pcApp.controllers.metric']);

/**
 * Setting the Token always to 1
 * Just for development!
 */
pcApp.run(function($http) {
    $http.defaults.headers.common.Authorization = 'Token 1'
});

pcApp.config(function($routeProvider) {
	$routeProvider
		.when('/', { 
			controller: 'StaticController',
			templateUrl: 'partials/main.html'
			})
		.when('/metrics', {
			controller: 'MetricsController',
			templateUrl: 'partials/metrics/list.html'
		})
		.when('/metrics/create', {
			controller: 'MetricCreateController',
			templateUrl: 'partials/metrics/create.html'
		})
		.when('/metrics/:metricId', {
			controller: 'MetricDetailController',
			templateUrl: 'partials/metrics/detail.html'
		})
        .when('/imprint', {
            templateUrl: 'partials/imprint.html'
        })
		.otherwise({ redirectTo: '/' });
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

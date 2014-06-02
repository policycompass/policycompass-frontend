
var pcApp = angular.module('pcApp', ['ngRoute', 'pcApp.controllers.metric']);

pcApp.config(function($routeProvider) {
	$routeProvider
		.when('/', { 
			controller: 'CommonController', 
			templateUrl: 'partials/view1.html'
			})
		.when('/view2', {
			controller: 'CommonController',
			templateUrl: 'partials/view2.html'
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



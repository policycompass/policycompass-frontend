
var pcApp = angular.module('pcApp', ['ngRoute', 'pcApp.service']);

pcApp.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);


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
		.otherwise({ redirectTo: '/' });
});



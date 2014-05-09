
var pcApp = angular.module('pcApp', ['ngRoute']);

pcApp.config(function($routeProvider) {
	$routeProvider
		.when('/', { 
			controller: 'SimpleController', 
			templateUrl: 'partials/view1.html'
			})
		.when('/view2', {
			controller: 'SimpleController',
			templateUrl: 'partials/view2.html'
			})
		.otherwise({ redirectTo: '/' });
});



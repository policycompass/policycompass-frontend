var module = angular.module('pcApp.metrics', [
    'ngResource',
    'pcApp.config'
]);

module.config(function($routeProvider) {
    $routeProvider
        .when('/metrics', {
            controller: 'MetricsController',
            templateUrl: 'modules/metrics/partials/list.html'
        })
        .when('/metrics/create', {
            controller: 'MetricCreateController',
            templateUrl: 'modules/metrics/partials/create.html'
        })
        .when('/metrics/:metricId', {
            controller: 'MetricDetailController',
            templateUrl: 'modules/metrics/partials/detail.html'
        })
        .otherwise({ redirectTo: '/' });
});
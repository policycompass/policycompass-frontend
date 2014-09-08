/**
 * Entry point of the Metrics Manager module
 */

var metrics = angular.module('pcApp.metrics', [
    'pcApp.metrics.controllers.metric',
    'pcApp.metrics.directives.pcDatagrid',
    'pcApp.metrics.directives.ngDropzone',
    'pcApp.metrics.directives.forms',
    'pcApp.references.directives.forms'
]);

/**
 * The routes are configured and connected with the respective controller here
 */
metrics.config(function($routeProvider) {
    $routeProvider
        .when('/metrics', {
            controller: 'MetricsController',
            templateUrl: 'modules/metrics/partials/list.html'
        })
        .when('/metrics/create', {
            controller: 'MetricCreateController',
            templateUrl: 'modules/metrics/partials/create.html'
        })
        .when('/metrics/:metricId/edit', {
            controller: 'MetricEditController',
            templateUrl: 'modules/metrics/partials/create.html'
        })
        .when('/metrics/:metricId', {
            controller: 'MetricDetailController',
            templateUrl: 'modules/metrics/partials/detail.html'
        })
        .otherwise({ redirectTo: '/' });
});
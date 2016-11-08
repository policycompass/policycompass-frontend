/**
 * Entry point of the Metrics Manager module
 */

var metrics = angular.module('pcApp.metrics', [
    'pcApp.metrics.controllers.metric',
    'pcApp.metrics.directives.pcDatagrid',
    'pcApp.metrics.directives.ngDropzone',
    'pcApp.metrics.directives.forms',
    'pcApp.references.directives.forms',
    'pcApp.metrics.directives.formula',
    'pcApp.metrics.directives.indicator',
    'pcApp.metrics.directives.datasetSelect',
    'pcApp.metrics.directives.indicatorToDataset',
    'pcApp.metrics.directives.functionsTable',
    'pcApp.metrics.directives.embedDirective'
]);

/**
 * The routes are configured and connected with the respective controller here
 */
metrics.config(function ($routeProvider) {
    $routeProvider
        .when('/metrics', {
            redirectTo: '/browse/metric'
        })
        .when('/metrics/create', {
            redirectTo: '/metrics/create-1'
        })
        .when('/metrics/create-1', {
            controller: 'CreateMetric1Controller',
            templateUrl: 'modules/metrics/partials/create-metric-1.html'
        })
        .when('/metrics/create-2', {
            controller: 'CreateMetric2Controller',
            templateUrl: 'modules/metrics/partials/create-metric-2.html'
        })
        .when('/metrics/calculate-dataset', {
            controller: 'CalculateDatasetController',
            templateUrl: 'modules/metrics/partials/calculate-dataset.html'
        })
        .when('/metrics/:metricId', {
            controller: 'MetricsmanagerDetailController',
            templateUrl: 'modules/metrics/partials/metric-detail.html'
        })
        .when('/metrics/:metricId/apply-1', {
            controller: 'ApplyMetric1Controller',
            templateUrl: 'modules/metrics/partials/apply-metric-1.html'
        })
        .when('/metrics/:metricId/apply-2', {
            controller: 'ApplyMetric2Controller',
            templateUrl: 'modules/metrics/partials/apply-metric-2.html'
        })
        .when('/metrics/:metricId/edit', {
            controller: 'MetricsmanagerEditController',
            templateUrl: 'modules/metrics/partials/metric-edit.html'
        })
        .otherwise({redirectTo: '/'});
});

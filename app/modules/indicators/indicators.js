/**
 * Entry point of the Indicator Service module
 */

var indicators = angular.module('pcApp.indicators', [
    'pcApp.indicators.controllers.indicator',
    'pcApp.indicators.directives.forms'
]);

/**
 * The routes are configured and connected with the respective controller here
 */
indicators.config(function($routeProvider) {
    $routeProvider
        .when('/indicators/create', {
            controller: 'IndicatorCreateController',
            templateUrl: 'modules/indicators/partials/create.html'
        })
//        .when('/metrics/:metricId/edit', {
//            controller: 'MetricEditController',
//            templateUrl: 'modules/metrics/partials/create.html'
//        })
        .when('/indicators/:indicatorId', {
            controller: 'IndicatorDetailController',
            templateUrl: 'modules/indicators/partials/detail.html'
        })
        .otherwise({ redirectTo: '/' });
});
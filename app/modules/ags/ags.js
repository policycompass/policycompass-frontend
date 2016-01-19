var ags = angular.module('pcApp.ags', [
    'pcApp.ags.controllers.ag',
    //'pcApp.metrics.directives.pcDatagrid',
    'pcApp.references.directives.forms'
]);

/**
 * Routings for mapping controller and template to a url
 */
ags.config(function($routeProvider) {
    $routeProvider
        .when('/ags', {
            redirectTo: '/browse/ag'
        })
        .when('/ags/create', {
            controller: 'AgCreateController',
            templateUrl: 'modules/ags/partials/create.html'
        })
        .when('/ags/:agId/edit', {
            controller: 'AgEditController',
            templateUrl: 'modules/ags/partials/create.html'
        })
        .when('/ags/:agId', {
            controller: 'AgDetailController',
            templateUrl: 'modules/ags/partials/detail.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});

var events = angular.module('pcApp.events', [
    'pcApp.events.controllers.event',
    //'pcApp.metrics.directives.pcDatagrid',
    'pcApp.references.directives.forms'
]);

/**
 * Routings for mapping controller and template to a url
 */
events.config(function ($routeProvider) {
    $routeProvider
        .when('/events', {
            redirectTo: '/browse/event'
        })
        .when('/events/create', {
            controller: 'EventCreateController',
            templateUrl: 'modules/events/partials/create.html'
        })
        .when('/events/search', {
            controller: 'EventSearchController',
            templateUrl: 'modules/events/partials/search.html'
        })
        .when('/events/config', {
            controller: 'EventConfigController',
            templateUrl: 'modules/events/partials/config.html'
        })
        .when('/events/:eventId/edit', {
            controller: 'EventEditController',
            templateUrl: 'modules/events/partials/create.html'
        })
        .when('/events/:eventId', {
            controller: 'EventDetailController',
            templateUrl: 'modules/events/partials/detail.html'
        })
        .otherwise({redirectTo: '/'});
});

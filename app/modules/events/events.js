var events = angular.module('pcApp.events', [
    'pcApp.events.controllers.event',
    //'pcApp.metrics.directives.pcDatagrid',
    'pcApp.references.directives.forms'
]);

events.config(function($routeProvider) {
    $routeProvider
        .when('/events', {
            redirectTo: '/browse/event'
        })
        .when('/events/create', {
            controller: 'EventCreateController',
            templateUrl: 'modules/events/partials/create.html'
        })
        .when('/events/:eventId/edit', {
            controller: 'EventEditController',
            templateUrl: 'modules/events/partials/create.html'
        })
        .when('/events/:eventId', {
            controller: 'EventDetailController',
            templateUrl: 'modules/events/partials/detail.html'
        })
        .otherwise({ redirectTo: '/' });
});
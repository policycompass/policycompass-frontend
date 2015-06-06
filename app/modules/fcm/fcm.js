angular.module('pcApp.fcm', [
    'pcApp.fcm.controllers.fcm',
    'pcApp.fcm.directives.cytoscapes',
    'pcApp.fcm.controllers.cytoscapes'
]).

config(function($routeProvider) {
    $routeProvider
        .when('/models', {
            redirectTo: '/browse/fuzzymap'
        })
        .when('/models/create', {
            controller: 'FcmCreateController', 
            controller: 'CytoscapeCtrl', 
            templateUrl: 'modules/fcm/partials/create.html'
        })
        .when('/models/:fcmId/edit', {
            controller: 'FcmEditController',
            controller: 'CytoscapeCtrl', 
            templateUrl: 'modules/fcm/partials/create.html'
        })
        .when('/models/:fcmId', {
            controller: 'FcmDetailController',
            templateUrl: 'modules/fcm/partials/detail.html'
        })
        .otherwise({ redirectTo: '/' });
});

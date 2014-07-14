 angular.module('pcApp.common',[
     'pcApp.common.controllers'
])

.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/main.html'
        })
        .when('/imprint', {
            templateUrl: 'modules/common/partials/imprint.html'
        })
        .otherwise({ redirectTo: '/' });
});
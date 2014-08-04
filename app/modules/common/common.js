 angular.module('pcApp.common',[
     'pcApp.common.controllers',
     'pcApp.common.directives.common'
])

.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/main.html'
        })
        .when('/browse', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/browse.html'
        })
        .when('/developers', {
            controller: 'DemoController',
            templateUrl: 'modules/common/partials/developers.html'
        })
        .when('/imprint', {
            templateUrl: 'modules/common/partials/imprint.html'
        })
        .otherwise({ redirectTo: '/' });
});
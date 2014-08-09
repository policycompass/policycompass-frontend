 angular.module('pcApp.common',[
     'pcApp.common.controllers',
     'pcApp.common.directives.submenus'
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
        .when('/create', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/create.html'
        })
        .when('/about', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/about.html'
        })
        .when('/i-want-to', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/wantto.html'
        })
        .when('/imprint', {
            templateUrl: 'modules/common/partials/imprint.html'
        })
        .otherwise({ redirectTo: '/' });
});
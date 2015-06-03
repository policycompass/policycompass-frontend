 var commonmanager = angular.module('pcApp.common',[
     'pcApp.common.controllers',
     'pcApp.common.directives.search',
     'pcApp.common.directives.submenus',
     'pcApp.common.directives.common',
     'pcApp.common.directives.piecharts',
     'pcApp.common.directives.barscharts',
     'pcApp.common.directives.linescharts',
     'pcApp.common.directives.wizard',
     'pcApp.common.directives.helpbutton'
])

commonmanager.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/main.html'
        })
        .when('/browse', {
            controller: 'searchMainController',
            templateUrl: 'modules/search/partials/browse.html'
        })
        .when('/create', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/create.html'
        })
        .when('/how-it-works', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/howItWorks.html'
        })
        .when('/i-want-to', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/wantto.html'
        })
        .when('/request', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/request.html'
        })
        .when('/publishingNotes', {
            templateUrl: 'modules/common/partials/publishingNotes.html'
        })
        .when('/login', {
            templateUrl: 'modules/common/partials/login.html'
        })
        .when('/create-dataset', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/create-dataset.html'
        })
        .otherwise({ redirectTo: '/' });
})


commonmanager.run(function(Progress, $rootScope) {
	 $rootScope.$on('$locationChangeSuccess', function () {
            Progress.start();
        });
})

;

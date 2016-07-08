var commonmanager = angular.module('pcApp.common', [
    'pcApp.common.controllers',
    'pcApp.common.directives.search',
    'pcApp.common.directives.submenus',
    'pcApp.common.directives.common',
    'pcApp.common.directives.piecharts',
    'pcApp.common.directives.barscharts',
    'pcApp.common.directives.linescharts',
    'pcApp.common.directives.mapscharts',
    'pcApp.common.directives.wizard',
    'pcApp.common.directives.helpbutton',
    'pcApp.common.directives.loadpcimage',
    'pcApp.common.directives.cookieLaw'
])

commonmanager.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/main_parallax.html'
        })
        .when('/browse', {
            controller: 'searchMainController',
            templateUrl: 'modules/search/partials/browse.html',
            reloadOnSearch: false
        })
        .when('/browse/:type', {
            controller: 'searchMainController',
            templateUrl: 'modules/search/partials/browse.html',
            reloadOnSearch: false
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
            controller: 'wanttoController',
            templateUrl: 'modules/common/partials/wantto.html'
        })
        .when('/request', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/request.html'
        })
        .when('/imprint', {
            templateUrl: 'modules/common/partials/imprint.html'
        })
        .when('/privacy-statement', {
            templateUrl: 'modules/common/partials/dataprotection.html'
        })
        .when('/terms-of-use', {
            templateUrl: 'modules/common/partials/termsOfUse.html'
        })
        .when('/login', {
            templateUrl: 'modules/common/partials/login.html'
        })
        .when('/create-dataset', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/create-dataset.html'
        })
        .when('/create-dataset-2', {
            controller: 'CreateDataset2Controller',
            templateUrl: 'modules/common/partials/create-dataset-2.html'
        })
        .when('/create-data', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/create-data.html'
        })
        .otherwise({redirectTo: '/'});
})

commonmanager.run([
    'ngProgress', '$rootScope', function (ngProgress, $rootScope) {
        ngProgress.color('#f6921e');

        $rootScope.$on('$locationChangeStart', function () {
            ngProgress.start();
        });

        $rootScope.$on('$locationChangeSuccess', function () {
            ngProgress.complete();
        });
    }
])

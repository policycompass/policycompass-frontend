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
    'pcApp.common.directives.cookieLaw',
    'pcApp.common.directives.learn'
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
        .when('/glossary', {
            templateUrl: 'modules/common/partials/glossary.html'
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
        .when('/support', {
            controller: 'StaticController',
            templateUrl: 'modules/common/partials/support.html'
        })
        .when('/learn', {
            controller: 'LearnController',
            templateUrl: 'modules/common/partials/learn.html'
        })
        .otherwise({redirectTo: '/'});
})

commonmanager.run([
    'ngProgress', '$rootScope', function (ngProgress, $rootScope) {
        ngProgress.color('#f6921e');

        // Retrieve default meta tag values to switch to on change start
        // update-meta module will update the new values on the views that require them to change
        var defaultMetaTags = {
            elements:{
                title : document.querySelector('meta[property="og:title"]'),
                descr: document.querySelector('meta[property="og:description"]'),
                img: document.querySelector('meta[property="og:image"]'),
                url: document.querySelector('meta[property="og:url"]')
            },
            title: '',
            descr:'',
            img: ''
        };
        defaultMetaTags.title = defaultMetaTags.elements.title.getAttribute('content');
        defaultMetaTags.descr = defaultMetaTags.elements.descr.getAttribute('content');
        defaultMetaTags.img = defaultMetaTags.elements.img.getAttribute('content');

        $rootScope.$on('$locationChangeStart', function () {
            ngProgress.start();
            defaultMetaTags.elements.title.setAttribute('content',defaultMetaTags.title);
            defaultMetaTags.elements.descr.setAttribute('content',defaultMetaTags.descr);
            defaultMetaTags.elements.img.setAttribute('content',defaultMetaTags.img);
            defaultMetaTags.elements.url.setAttribute('content',window.location);
        });

        $rootScope.$on('$locationChangeSuccess', function () {
            ngProgress.complete();
            defaultMetaTags.elements.url.setAttribute('content',window.location);
        });
    }
])

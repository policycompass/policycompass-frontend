/**
 * Entry point of the Dataset Manager module
 */

angular.module('pcApp.datasets', [
    'pcApp.datasets.controllers.dataset',
    'pcApp.datasets.directives.eurostatImport',
    'pcApp.datasets.directives.ckanImport',
    'pcApp.references.directives.forms',
    'ngHandsontable',
    'pcApp.datasets.directives.snippets',
    'pcApp.common.directives.search',
    'pcApp.references.directives.resolve'
])

/**
 * The routes are configured and connected with the respective controller here
 */
    .config(function ($routeProvider) {
        $routeProvider
            .when('/datasets', {
                redirectTo: '/browse/dataset'
            })
            .when('/datasets/create', {
                controller: 'DatasetStep1Controller',
                templateUrl: 'modules/datasets/partials/step1.html'
            })
            .when('/datasets/create/dimension', {
                controller: 'DatasetStep2Controller',
                templateUrl: 'modules/datasets/partials/step2.html'
            })
            .when('/datasets/create/time', {
                controller: 'DatasetStep3Controller',
                templateUrl: 'modules/datasets/partials/step3.html'
            })
            .when('/datasets/create/data', {
                controller: 'DatasetStep4Controller',
                templateUrl: 'modules/datasets/partials/step4.html'
            })
            .when('/datasets/create/indicator', {
                controller: 'DatasetStep5Controller',
                templateUrl: 'modules/datasets/partials/step5.html'
            })
            .when('/datasets/create/preview', {
                controller: 'DatasetStep6Controller',
                templateUrl: 'modules/datasets/partials/step6.html'
            })
            .when('/datasets/create/metadata', {
                controller: 'DatasetStep7Controller',
                templateUrl: 'modules/datasets/partials/step7.html'
            })
            .when('/datasets/:datasetId', {
                controller: 'DatasetDetailController',
                templateUrl: 'modules/datasets/partials/detail.html'
            })
            .when('/datasets/:datasetId/edit', {
                controller: 'DatasetEditController',
                templateUrl: 'modules/datasets/partials/edit.html'
            })
    });

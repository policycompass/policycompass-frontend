/**
 * Entry point of the Dataset Manager module
 */

angular.module('pcApp.datasets', [
    'pcApp.datasets.controllers.dataset',
    'pcApp.references.directives.forms',
    'ngHandsontable',
    'pcApp.datasets.directives.snippets'
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
            .when('/datasets/create/class', {
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
    });
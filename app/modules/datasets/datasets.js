/**
 * Entry point of the Dataset Manager module
 */

angular.module('pcApp.datasets', [
    'pcApp.datasets.controllers.dataset',
    'pcApp.references.directives.forms',
    'ngHandsontable'
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
                controller: 'DatasetCreateController',
                templateUrl: 'modules/datasets/partials/create.html'
            })
    });
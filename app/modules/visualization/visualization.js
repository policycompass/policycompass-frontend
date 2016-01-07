//var visu = angular.module('pcApp.visualization', ['pcApp.metrics']);
var visu = angular.module('pcApp.visualization', [
    'pcApp.visualization.controllers.visualization'
]);


visu.config(function ($routeProvider) {
    $routeProvider
        .when('/visualizations/', {
            //controller: 'VisualizationsController',
            //templateUrl: 'modules/visualization/partials/list.html'
            redirectTo: '/browse/visualization'
        })
        .when('/visualizations/create/', {
            controller: 'VisualizationsCreateController',
            templateUrl: 'modules/visualization/partials/create.html'
        })
        .when('/visualizations/:visualizationId/edit', {
            controller: 'VisualizationsEditController',
            templateUrl: 'modules/visualization/partials/create.html'
        })
        .when('/visualizations/addEvent/', {
            controller: 'VisualizationsCreateController', //controller: 'ModalInstanceCtrl',
            templateUrl: 'modules/visualization/partials/addEvent.html'
        })
        .when('/visualizations/graph/:visualizationId', {
            //controller: 'VisualizationsGraphController',
            controller: 'viewVisualizationCtrl',
            templateUrl: 'modules/visualization/partials/graph.html'
        })
        .when('/visualizations/:visualizationId', {
            controller: 'VisualizationsDetailController',
            templateUrl: 'modules/visualization/partials/detail.html'
        }).otherwise({redirectTo: '/'});
});

visu.filter('pagination', function () {
    return function (input, start) {
        start = +start;
        if (input) {
            return input.slice(start);
        } else {
            return start;
        }

    };
});

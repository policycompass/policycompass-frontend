//var visu = angular.module('pcApp.visualization', ['pcApp.metrics']);
var visu = angular.module('pcApp.visualization', [
    'pcApp.visualization.controllers.visualization'
]);


/*
var visu = angular.module('pcApp.visualization', [
    'ngResource',
    'pcApp.config'
    'pcApp.metrics'    
]);
*/
visu.config(function($routeProvider) {
    $routeProvider
        .when('/visualizations/', {
            controller: 'VisualizationsController',
            templateUrl: 'modules/visualization/partials/list.html'
        })        
        .when('/visualizations/test', {
            controller: 'viewVisualizationCtrl',
            templateUrl: 'modules/visualization/partials/test.html'
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
            controller: 'VisualizationsCreateController',
            //controller: 'ModalInstanceCtrl',            
            templateUrl: 'modules/visualization/partials/addEvent.html'
        })
		.when('/visualizations/graph/:visualizationId', {
            //controller: 'VisualizationsGraphController',
            controller: 'VisualizationsEditController',            
            templateUrl: 'modules/visualization/partials/graph.html'
        })
        .when('/visualizations/:visualizationId', {
            controller: 'VisualizationsDetailController',
            templateUrl: 'modules/visualization/partials/detail.html'
        })
        .otherwise({ redirectTo: '/' });
});
angular.module('pcApp.metrics.directives.indicatorToDataset', [

])

.directive('indicatorToDataset', [ function () {

    return {
        restrict: 'A',
        replace: true,
        scope: {
        	datarow: '='

        },
        template: function(scope) {
        	return '<tr>' +
                   '<td><indicator data-indicator="datarow.indicator"></indicator></td>' +
                   '<td><dataset-select data-indicator="datarow.indicator" data-dataset="datarow.dataset" data-variable="datarow.variable"></dataset-select></td>' +
                   '</tr>';
        }
    };
}]);
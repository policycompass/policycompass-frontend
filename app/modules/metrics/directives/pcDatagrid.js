/**
 * Directive, which wraps the Handsontable library.
 */

angular.module('pcApp.metrics.directives.pcDatagrid', [

])

.directive('pcDatagrid', ['$timeout', '$log', function ($timeout, $log) {
    return {
        restrict: 'C',
        scope: {
            instance: '=',
            gridData: '=data',
            readOnly: '=readOnly'

        },
        link: function (scope, element, attrs, ctrls) {
            // Configure the grid
            angular.element(document).ready(function () {
                var config = {
                    data: scope.gridData,
                    colHeaders: true,
                    rowHeaders: true,
                    contextMenu: true,
                    stretchH: 'all',
                    minRows: 10,
                    minCols: 7,
                    minSpareRows: 1
                };

                if(scope.readOnly == true) {
                    config['readOnly'] = true;
                }


                var elm = $(element);
                elm.handsontable(config);
                // Return an instance of the grid
                scope.instance = elm.handsontable('getInstance');

            });
        }
    };
}]);
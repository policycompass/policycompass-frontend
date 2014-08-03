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
                scope.instance = elm.handsontable('getInstance');

            });
        }
    };
}]);
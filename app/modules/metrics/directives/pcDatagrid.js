angular.module('pcApp.metrics.directives.pcDatagrid', [

])

.directive('pcDatagrid', function () {
    return {
        restrict: 'E',
        scope: {
          gridData: '=data'
        },
        link: function link(scope, element, attrs) {
            $(element).handsontable({
                data: scope.gridData,
                colHeaders: true,
                rowHeaders: true,
                contextMenu: true,
                minSpareRows: 10,
                minSpareCols: 10
            });
        }
    };
});
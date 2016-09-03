/**
 * <pc-dataset ng-if="dataset.id" dataset-id="{{dataset.id}}"></pc-dataset>
 */

angular.module('pcApp.datasets.directives.embedDirective', [
])
    .directive('pcDataset', [
        function () {
            var controller = function ($scope, $attrs, $controller, $routeParams) {
                $routeParams.datasetId = $scope.datasetId;
                $controller('DatasetDetailController', { $scope: $scope });
            };
            return {
                restrict: 'EA',
                controller: ['$scope', '$attrs', '$controller', '$routeParams', controller],
                scope: {
                    datasetId: "@"
                },
                templateUrl: 'modules/datasets/partials/embed.html'
            };
        }
    ]);

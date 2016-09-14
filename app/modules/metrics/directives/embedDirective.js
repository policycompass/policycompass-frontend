/**
 * <pc-metric ng-if="metric.id" metric-id="{{metric.id}}"></pc-metric>
 */

angular.module('pcApp.metrics.directives.embedDirective', [
])
  .directive('pcMetric', [
        function () {
            var controller = function ($scope, $attrs, $controller, $routeParams) {
                $routeParams.metricId = $scope.metricId;
                $controller('MetricsmanagerDetailController', { $scope: $scope });
            };
            return {
                restrict: 'EA',
                controller: ['$scope', '$attrs', '$controller', '$routeParams', controller],
                scope: {
                    metricId: '@'
                },
                templateUrl: 'modules/metrics/partials/embed.html'
            };
        }
    ]);

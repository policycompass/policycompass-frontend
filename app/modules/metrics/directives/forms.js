angular.module('pcApp.metrics.directives.forms', [
    'pcApp.metrics.services.metric'
])

.directive('extraCategoryOptions', ['$log', 'ExtraCategory', function ($log, ExtraCategory) {
    return {
        restrict: 'C',
        scope: {
            model: '=model'
        },
        controller: function($scope){
            $scope.extras = ExtraCategory.query(
                null,
                function() {
                    //$log.info($scope.units);
                }
            );
        },
        template: '<option value="{{ e.title }}" ng-repeat="e in extras" ng-selected="e.title == model">{{ e.title }}</option>'
    };
}]);

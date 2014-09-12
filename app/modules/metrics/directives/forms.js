/**
 * Directives for specific form elements for the Metrics Manager
 */

angular.module('pcApp.metrics.directives.forms', [
    'pcApp.metrics.services.metric'
])

/**
 * Returns HTML option tags for the selection of the extra categories
 */
.directive('extraCategoryOptions', ['$log', 'ExtraCategory', function ($log, ExtraCategory) {
    return {
        restrict: 'C',
        scope: {
            model: '=model'
        },
        // Get the categories from the API
        controller: function($scope){
            $scope.extras = ExtraCategory.query(
                null,
                function() {
                }
            );
        },
        // Build the HTML output
        template: '<option value="{{ e.title }}" ng-repeat="e in extras" ng-selected="e.title == model">{{ e.title }}</option>'
    };
}]);

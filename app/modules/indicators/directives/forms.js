/**
 * Directives for specific form elements for the Indicator Service
 */

angular.module('pcApp.indicators.directives.forms', [
    'pcApp.indicators.services.indicator'
])

/**
 * Returns HTML option tags for the selection of an Indicator
 */
.directive('indicatorOptions', ['$log', 'Indicator', function ($log, Indicator) {
    return {
        restrict: 'C',
        scope: {
            model: '=model'
        },
        // Get the indicator from the API
        controller: function($scope){
            $scope.indicators = Indicator.query(
                null,
                function() {
                }
            );
        },
        // Build the HTML output
        template: '<option value="{{ i.name }}" ng-repeat="i in indicators" ng-selected="i.id == model">{{ i.title }}</option>'
    };
}]);

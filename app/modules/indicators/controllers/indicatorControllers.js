/**
 * Module for all Indicator Controllers
 */

angular.module('pcApp.indicators.controllers.indicator', [
    'pcApp.references.services.reference',
    'pcApp.indicators.services.indicator',
    'dialogs.main'
])


.factory('IndicatorControllerHelper', ['$log', function($log) {
    return {
        /**
         * Base Controller for creating and editing am indicator.
         * Thos two operations share most of the functionality, because they are using the same view.
         * @param $scope
         */
        baseCreateEditController: function ($scope) {}
    };
}])


/**
 * Controller for creating an indicator
 */
.controller('IndicatorCreateController', [
    '$scope',
    'Indicator',
    '$location',
    '$log',
    'IndicatorControllerHelper',
    '$filter',
    function ($scope, Indicator, $location, $log, helper, $filter) {

        // Init the base functionalities
        helper.baseCreateEditController($scope);

        // Mode is creation
        $scope.mode = "create";

        // Empty indcator object
        $scope.indicator = {};

        // Create the indicator via the API
        $scope.createIndicator = function() {
            // Hardcoded user for the moment
            // $scope.metric.user_id = 1;

            // Save the Indicaotr and redirect to the detail view
            Indicator.save($scope.indicator,function(value, responseHeaders){
                    //$location.path('/');
                },
                function(err) {
                    throw { message: JSON.stringify(err.data)};
                }
            );
        };

    }])

    .controller('IndicatorDetailController', [
        '$scope',
        'Indicator',
        '$location',
        '$log',
        'IndicatorControllerHelper',
        '$filter',
        '$routeParams',
        function ($scope, Indicator, $location, $log, helper, $filter, $routeParams) {

            $scope.indicator = Indicator.get({id: $routeParams.indicatorId},
                function(indicator) {
                },
                function(err) {
                    throw { message: JSON.stringify(err.data)};
                }
            );



        }]);

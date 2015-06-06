/**
 * Module for all Indicator Controllers
 */

angular.module('pcApp.indicators.controllers.indicator', [
    'pcApp.references.services.reference',
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
        '$location',
        '$log',
        'IndicatorControllerHelper',
        '$filter',
        function($scope, $location, $log, helper, $filter) {

    // Init the base functionalities
    helper.baseCreateEditController($scope);

    // Mode is creation
    $scope.mode = "create";

}]);

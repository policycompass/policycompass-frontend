/**
 * Controllers for common purposes
 */

angular.module('pcApp.common.controllers', [

])

.controller('CommonController', ['$scope', '$location', function($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
}])

.controller('StaticController', ['$scope', function($scope) {


}])

/**
 * Controller for setting the UI Bootstrap date selection.
 * ToDo: Should be a directive.
 */
.controller('DateController',  ['$scope', function ($scope) {

    $scope.maxDate = new Date();
    $scope.minDate = new Date('1900-01-01');
    $scope.format = "yyyy-MM-dd";
    $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

}]);
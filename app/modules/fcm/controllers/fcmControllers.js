angular.module('pcApp.fcm.controllers.fcm', [
    'pcApp.fcm.services.fcm'
])

.factory('FcmControllerHelper', [function () {
    return {
        baseCreateEditController: function ($scope) {

        }
    };
}])


.controller('FcmController', [
    '$scope',
    'Fcm',
    '$log',
    '$routeParams',
    function ($scope, Fcm, $log, $routeParams) {

    $scope.models = Fcm.query(
        {},
        function (fcmList) {

        },
        function (error) {
            throw { message: JSON.stringify(err.data)};
        }
    );
    }])

.controller('FcmDetailController', [
    '$scope',
    '$routeParams',
    '$location',
    'Fcm',
    '$log',
    function ($scope, $routeParams, $location, Metric, $log) {


    }])

.controller('FcmCreateController', [
    '$scope',
    'Fcm',
    '$location',
    '$log',
    'FcmControllerHelper',
    function ($scope, Metric, $location, $log, helper) {

        helper.baseCreateEditController($scope);

    }])

.controller('FcmEditController', [
    '$scope',
    '$routeParams',
    'Fcm',
    '$location',
    '$log',
    'FcmControllerHelper',
    function ($scope, $routeParams, Metric, $location, $log, helper) {

        helper.baseCreateEditController($scope);

    }]);



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
    function ($scope, Metric, $log) {


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

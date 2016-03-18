/**
 * Module for all Indicator Controllers
 */

angular.module('pcApp.indicators.controllers.indicator', [
    'pcApp.references.services.reference',
    'pcApp.indicators.services.indicator',
    'dialogs.main'
])


    .factory('IndicatorControllerHelper', [
        '$log', function ($log) {
            return {
                /**
                 * Base Controller for creating and editing am indicator.
                 * Thos two operations share most of the functionality, because they are using the same view.
                 * @param $scope
                 */
                baseCreateEditController: function ($scope) {
                }
            };
        }
    ])


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
        '$routeParams',
        'Auth',
        function ($scope, Indicator, $location, $log, helper, $filter, $routeParams, Auth) {

            $scope.userState = Auth.state;

            // Init the base functionalities
            helper.baseCreateEditController($scope);

            // Mode is creation
            $scope.mode = "create";

            // Empty indcator object
            $scope.indicator = {};

            // Create the indicator via the API
            $scope.save = function () {
                // Hardcoded user for the moment
                // $scope.metric.user_id = 1;

                // Save the Indicaotr and redirect to the detail view
                Indicator.save($scope.indicator, function (value, responseHeaders) {
                    $log.info($routeParams);
                    if ($routeParams.ref == 'dataset') {
                        $location.search('ref', null);
                        $location.path('/datasets/create/indicator');
                    } else {
                        $location.path('/indicators/' + value.id);
                    }
                }, function (err) {
                    throw {message: JSON.stringify(err.data)};
                });
            };

        }
    ])


    .controller('IndicatorEditController', [
        '$scope',
        'Indicator',
        '$location',
        '$log',
        'IndicatorControllerHelper',
        '$filter',
        '$routeParams',
        'Auth',
        function ($scope, Indicator, $location, $log, helper, $filter, $routeParams, Auth) {

            $scope.userState = Auth.state;

            // Init the base functionalities
            helper.baseCreateEditController($scope);
            // Mode is creation
            $scope.mode = "edit";
            $scope.indicator = Indicator.get({id: $routeParams.indicatorId}, function (indicator) {
            }, function (err) {
                throw {message: JSON.stringify(err.data)};
            });

            $scope.indicator.$promise.then(function (indicator) {

            });

            $scope.save = function () {
                Indicator.update($scope.indicator, function (value, responseHeaders) {
                    $location.path('/indicators/' + value.id);
                }, function (err) {
                    throw {message: JSON.stringify(err.data)};
                });
            };

        }
    ])


    .controller('IndicatorDetailController', [
        '$scope',
        'Indicator',
        'PolicyDomain',
        'UnitCategory',
        '$location',
        '$log',
        'IndicatorControllerHelper',
        '$filter',
        '$routeParams',
        'dialogs',
        'Auth',
        function ($scope, Indicator, PolicyDomain, UnitCategory, $location, $log, helper, $filter, $routeParams, dialogs, Auth) {

            $scope.userState = Auth.state;

            $scope.indicator = Indicator.get({id: $routeParams.indicatorId}, function (indicator) {
                var domains = [];
                indicator.policy_domains.forEach(function (p) {
                    domains.push(PolicyDomain.getById(p))
                });
                indicator.policy_domains = domains;
            }, function (err) {
                throw {message: JSON.stringify(err.data)};
            });

            // Function for deleting the indicator
            $scope.deleteIndicator = function (indicator) {
                // Open a confirmation dialog
                var dlg = dialogs.confirm("Are you sure?", "Do you want to delete the Indicator " + indicator.name + " permanently?");
                dlg.result.then(function () {
                    // Delete the metric via the API
                    indicator.$delete({}, function () {
                        $location.path('/browse');
                    });
                });
            };


        }
    ]);

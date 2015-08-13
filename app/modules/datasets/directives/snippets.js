
angular.module('pcApp.datasets.directives.snippets', [
    'ngStorage'
])

.directive('datasetCreateHeader', ['$log', '$location', '$rootScope', '$sessionStorage',
        function ($log, $location, $rootScope, storage) {
        return {
            restrict: 'AEC',
            scope: {
                step: '@',
                beforeNextStep: '&',
                beforePrevStep: '&'
            },
            templateUrl: 'modules/datasets/partials/header.html',
            controller: function ($scope, $element, $attrs) {
                var steps = {
                    1: {
                        'title': 'Step 1 - Provide Source Data',
                        'help': 'Nothing',
                        'prev': null,
                        'next': '/datasets/create/class'
                    },
                    2: {
                        'title': 'Step 2 - Define the Individuals',
                        'help': 'Nothing',
                        'prev': '/datasets/create',
                        'next': '/datasets/create/time'
                    },
                    3: {
                        'title': 'Step 3 - Set the Time',
                        'help': 'Nothing',
                        'prev': '/datasets/create/class',
                        'next': '/datasets/create/data'
                    },
                    4: {
                        'title': 'Step 4 - Provide the Data',
                        'help': 'Nothing',
                        'prev': '/datasets/create/time',
                        'next': '/datasets/create/indicator'
                    },
                    5: {
                        'title': 'Step 5 - Define the Indicator',
                        'help': 'Nothing',
                        'prev': '/datasets/create/data',
                        'next': '/datasets/create/preview'
                    },
                    6: {
                        'title': 'Step 6 - Preview',
                        'help': 'Nothing',
                        'prev': '/datasets/create/indicator',
                        'next': '/datasets/create/metadata'
                    },
                    7: {
                        'title': 'Step 7 - Metadata',
                        'help': 'Nothing',
                        'prev': '/datasets/create/preview',
                        'next': null
                    }
                };
                $scope.stepData = steps[$scope.step];

                $scope.nextStep = function () {
                    $scope.beforeNextStep();
                    $location.path(steps[$scope.step].next);
                };

                $scope.prevStep = function () {
                    $scope.beforePrevStep();
                    $location.path(steps[$scope.step].prev);
                };

                $scope.cancel = function () {
                    delete storage.newdataset;
                    $location.path('/datasets/create');
                };

            }
        }
    }])

.directive('datasetCreateWrapper', ['$log', function ($log) {
        return {
            restrict: 'AEC',
            transclude: true,
            scope: {},
            template: '<div class="container container-create-dataset" id="container-create-dataset" ng-transclude></div>',
            controller: function ($scope, $element, $attrs) {

            }
        }
    }]);
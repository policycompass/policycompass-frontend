angular.module('pcApp.datasets.directives.snippets', [
    'pcApp.datasets.services.dataset', 'ngStorage'
])

    .directive('datasetCreateHeader', [
        '$log',
        '$location',
        '$rootScope',
        'creationService',
        '$route',
        'dialogs',
        'Auth',
        function ($log, $location, $rootScope, creationService, $route, dialogs, Auth) {
            return {
                restrict: 'AEC',
                scope: {
                    step: '@',
                    beforeNextStep: '&',
                    beforePrevStep: '&',
                    save: '=',
                    dataset: '='
                },
                templateUrl: 'modules/datasets/partials/header.html',
                controller: function ($scope, $element, $attrs) {

                    $scope.userState = Auth.state;

                    var steps = {
                        1: {
                            'title': 'Step 1 - Provide Source Data',
                            'help': 'Provide your source data, either by typing or copying it into the data grid ' + 'or by uploading a file (CSV, XLS, XLSX). You can easily pre-edit your data here. ' + 'A right click into the sheet offers you more options.',
                            'prev': null,
                            'next': '/datasets/create/dimension'
                        },
                        2: {
                            'title': 'Step 2 - Define the Dimensions',
                            'help': 'Your data refers to a specific dimension type, e.g. countries. Please select your dimension type. ' + 'The instances for a dimension type, e.g. France for type Country are called dimensions. ' + 'Pick the corresponding cells in the source data which represent your dimensions. Furthermore you can add specific ' + 'metadata in order to describe your dataset in more detail. For example: Create a dataset for several countries, but just refering to women. ' + 'If you want to refer to men as well you need to create another dataset. ',
                            'prev': '/datasets/create',
                            'next': '/datasets/create/time'
                        },
                        3: {
                            'title': 'Step 3 - Define Time Resolution, Start and End Date',
                            'help': 'Your dataset will provide data over a specific time range. ' + 'Please select the time resolution and pick the start and end date from your source data. ',
                            'prev': '/datasets/create/dimension',
                            'next': '/datasets/create/data'
                        },
                        4: {
                            'title': 'Step 4 - Provide the Values',
                            'help': 'Now please provide the actual data for each dimesion and time period by selecting it ' + 'in the source data and adding it to the target table. If your data is already in the same format' + ' like the target table you can select the "Table Mode" to copy everything in one step.',
                            'prev': '/datasets/create/time',
                            'next': '/datasets/create/indicator'
                        },
                        5: {
                            'title': 'Step 5 - Set Indicator and Unit',
                            'help': 'Please chose a fitting indicator for your new dataset. ' + 'An indicator indicates what "thing" the data describes.' + 'In a Metric the dataset can be referenced via this indicator. ' + 'If the list does not include a suitable indicator, create a new one. In ' + 'addition provide the unit your values are in. An Indicator has to be a generic concept, independent from location (country, city) and time. For example Unemployment, Death Rate, Happiness',
                            'prev': '/datasets/create/data',
                            'next': '/datasets/create/preview'
                        },
                        6: {
                            'title': 'Step 6 - Preview and Manual Editing',
                            'help': 'Congratulations, you can now see the resulting.' + 'If you require any changes, go back to any of the previous steps and make amendments/changes as required.' + 'You can also edit the values of the dataset right here. ',
                            'prev': '/datasets/create/indicator',
                            'next': '/datasets/create/metadata'
                        },
                        7: {
                            'title': 'Step 7 - Metadata',
                            'help': 'Please provide additional metadata to describe the dataset further. ' + 'This allows users to easily understand what the data is and the full ' + 'provenance and context of the data.',
                            'prev': '/datasets/create/preview',
                            'next': null
                        }
                    };
                    $scope.stepData = steps[$scope.step];

                    $scope.nextStep = function () {
                        var result = $scope.beforeNextStep();
                        if (result != false) {
                            $location.path(steps[$scope.step].next);
                        }

                    };

                    $scope.prevStep = function () {
                        $scope.beforePrevStep();
                        $location.path(steps[$scope.step].prev);
                    };

                    $scope.cancel = function () {
                        var dlg = dialogs.confirm("Are you sure?", "All your provided data will be cleared.");
                        dlg.result.then(function () {
                            creationService.reset();
                            $location.path('/datasets/create');
                            $route.reload();
                        });
                    };

                    $scope.saveFinish = function () {
                        $scope.save.saveFinish();
                    };

                    $scope.saveCopy = function () {
                        $scope.save.saveCopy();
                    }
                }
            }
        }
    ])

    .directive('datasetCreateWrapper', [
        '$log', function ($log) {
            return {
                restrict: 'AEC',
                transclude: true,
                scope: {},
                template: '<div class="container container-create-dataset" id="container-create-dataset" ng-transclude></div>',
                controller: function ($scope, $element, $attrs) {

                }
            }
        }
    ]);

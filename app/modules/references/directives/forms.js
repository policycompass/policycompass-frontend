/**
 * Collection of directives to make the data of the Reference Pool available as HTML select boxes.
 */

angular.module('pcApp.references.directives.forms', [
    'pcApp.references.services.reference'
])

/**
 * Returns HTML option tags for the selection of the unit
 */
    .directive('unitOptions', [
        '$log', 'Unit', function ($log, Unit) {
            return {
                restrict: 'C',
                scope: {
                    model: '=model',
                    category: '=category'
                },
                controller: function ($scope) {
                    var params = {};
                    if ($scope.category) {
                        params['category'] = $scope.category;
                    }

                    $scope.units = Unit.query(params, function () {
                        //$log.info($scope.units);
                    });
                },
                template: '<option value="{{ u.id }}" ng-repeat="u in units" ng-selected="u.id == model">{{ u.title }}</option>'
            };
        }
    ])


/**
 * Returns HTML option tags for the selection of the unit category
 */
    .directive('unitCategoryOptions', [
        '$log', 'UnitCategory', function ($log, UnitCategory) {
            return {
                restrict: 'C',
                scope: {
                    model: '=model'
                },
                controller: function ($scope) {
                    $scope.c = UnitCategory.query(null, function () {
                    });
                },
                template: '<option value="{{ u.id }}" ng-repeat="u in c" ng-selected="u.id == model">{{ u.title }}</option>'
            };
        }
    ])

/**
 * Returns HTML option tags for the selection of the policy domain
 */
    .directive('policydomainOptions', [
        '$log', 'PolicyDomain', function ($log, PolicyDomain) {
            return {
                restrict: 'C',
                scope: {
                    model: '=model'
                },
                controller: function ($scope) {
                    $scope.domains = PolicyDomain.query(null, function () {
                        //$log.info($scope.domains);
                    });
                },
                template: '<option value="{{ d.id }}" ng-repeat="d in domains" ng-selected="d.id == model" >{{ d.title }}</option>'
            };
        }
    ])

/**
 * Returns HTML option tags for the selection of the language
 */
    .directive('languageOptions', [
        '$log', 'Language', function ($log, Language) {
            return {
                restrict: 'C',
                scope: {
                    model: '=model'
                },
                controller: function ($scope) {
                    $scope.languages = Language.query(null, function () {
                        //$log.info($scope.units);
                    });
                },
                template: '<option value="{{ l.id }}" ng-repeat="l in languages" ng-selected="l.id == model">{{ l.title }}</option>'
            };
        }
    ])


/**
 * Returns HTML option tags for the selection of the class
 */
    .directive('classOptions', [
        '$log', 'Class', function ($log, Class) {
            return {
                restrict: 'C',
                scope: {
                    model: '=model'
                },
                controller: function ($scope) {
                    $scope.classes = Class.query(null, function () {
                    });
                },
                template: '<option value="{{ c.id }}" ng-repeat="c in classes" ng-selected="c.id == model">{{c.title }}</option>'
            };
        }
    ])


/**
 * Returns HTML option tags for the selection of the date format
 */
    .directive('dateFormatOptions', [
        '$log', 'DateFormat', function ($log, DateFormat) {
            return {
                restrict: 'C',
                scope: {
                    model: '=model'
                },
                controller: function ($scope) {
                    $scope.dateFormats = DateFormat.query(null, function () {
                        //$log.info($scope.units);
                    });
                },
                template: '<option value="0"  ng-selected="model == 0">Custom Date Format</option>' + '<option value="{{ d.id }}" ng-repeat="d in dateFormats" ng-selected="d.id == model">{{ d.symbol }}</option>'
            };
        }
    ])

/**
 * Returns HTML option tags for the selection of external resource
 */
    .directive('externalResourceOptions', [
        '$log', 'ExternalResource', function ($log, ExternalResource) {
            return {
                restrict: 'C',
                scope: {
                    model: '=model'
                },
                controller: function ($scope) {
                    $scope.externalResources = ExternalResource.query(null, function () {
                        //$log.info($scope.units);
                    });
                }, // External Resource can be None, so there is an extra option for that case
                template: '<option value="0"  ng-selected="model == 0">None</option>' + '<option value="{{ e.id }}" ng-repeat="e in externalResources" ng-selected="e.id == model">{{ e.title }}</option>'
            };
        }
    ])

    .directive('referenceSelection', [
        '$log', '$injector', function ($log, $injector) {
            return {
                restrict: 'C',
                scope: {
                    resource: '@',
                    input: '=',
                    output: '=',
                    parameters: '='
                },
                link: function ($scope, $element, $attrs) {
                    var params = {};
                    if ($scope.parameters != undefined) {

                        params = $scope.parameters;
                        $scope.$watch('parameters', function (newValue) {
                            ;
                            params = newValue;
                            getData();
                        });

                    }
                    $scope.output = [];
                    $scope.selection = [];
                    var service = $injector.get($scope.resource);

                    var getData = function () {
                        service.query(params, function (data) {
                            var sel = [];
                            angular.forEach(data, function (d) {
                                var ticked = false;
                                if (_.contains($scope.input, d.id)) {
                                    ticked = true;
                                }
                                sel.push({
                                    name: d.title,
                                    id: d.id,
                                    ticked: ticked
                                });
                            });
                            $scope.selection = sel;
                        });
                    };

                    getData();
                    $scope.outputData = {};
                    if ($attrs.selectionMode != 'undefined' && $attrs.selectionMode == 'single') {
                        $scope.selectionMode = 'single';
                    } else {
                        $scope.selectionMode = 'multiple';
                    }

                    $scope.$watchCollection('outputData', function (newValue, oldValue) {
                        $scope.output = [];
                        angular.forEach(newValue, function (value) {
                            $scope.output.push(value.id);
                        })
                    });

                    $scope.$watchCollection('input', function (newValue) {
                        angular.forEach($scope.selection, function (s) {
                            if (_.contains(newValue, s.id)) {
                                s.ticked = true;
                            } else {
                                s.ticked = false;
                            }
                        })
                    });

                },
                template: '<div class="dataset-select" ' + 'isteven-multi-select ' + 'input-model="selection" ' + 'output-model="outputData" ' + 'selection-mode="{{ selectionMode }}" ' + 'button-label="name" ' + 'item-label="name" ' + 'tick-property="ticked"></div>'
            }
        }
    ]);

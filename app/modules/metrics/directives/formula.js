angular.module('pcApp.metrics.directives.formula', [])

    .directive('formula', [
        '$http', 'API_CONF', '$q', function ($http, API_CONF, $q) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    formula: '=formula',
                    variables: '=variables',
                },
                template: function (scope) {
                    return '<div style="min-height: 77px;" class="calculation-formula calculation-formula-2"></div>';
                },
                link: function (scope, element, attrs) {

                    var parseFormula = function () {

                        if (scope.formula) {
                            var parsedFormula = scope.formula;
                            if (angular.isObject(scope.variables)) {
                                var variables = scope.variables;
                            } else {
                                var variables = JSON.parse(scope.variables.replace(/'/g, '"'));
                            }
                            var urlCalls = [];
                            angular.forEach(variables, function (value, key, obj) {
                                var index = scope.formula.indexOf(key.replace(' ', ''));
                                if (index > -1) {
                                    var url = API_CONF.DATASETS_MANAGER_URL + "/datasets/" + value.id;
                                    urlCalls.push($http({
                                        url: url,
                                        method: "GET"
                                    }).then(function (response) {
                                        return {
                                            response: response,
                                            key: key
                                        };
                                    }));
                                    parsedFormula = parsedFormula.replace(key.replace(' ', ''), " %" + value.id + "% ");
                                }
                            });
                            var deferred = $q.defer();
                            $q.all(urlCalls).then(function (results) {
                                angular.forEach(results, function (value, key, obj) {
                                    var variable = value.key.trim();
                                    var replaceable = "%" + value.response.data.id + "%";
                                    var span = '<span id="variable' + variable + '" class="indicator-formula indicator-formula-selected">' + value.response.data.title + '</span>';
                                    parsedFormula = parsedFormula.replace(replaceable, span);
                                });
                                element.empty();
                                element.append(parsedFormula);
                            }, function (errors) {
                                deferred.reject(errors);
                            }, function (updates) {
                                deferred.update(updates);
                            });
                        } else {
                            element.empty();
                        }
                    };

                    scope.$watch('formula', function () {
                        parseFormula();
                    });
                }
            };
        }
    ]);


/** Translate a group of text and <span> node into a formula string. */
var childNodesToFormula = function(childNodes) {
    var result = [];
    angular.forEach(childNodes, function (node) {
        if (node.wholeText){
            this.push(node.wholeText)
        } else if(node.data) {
            this.push(node.data.variable)
        }
    }, result);
    return result.join(' ')
}


/** Translate a fromula string into a list of text and <span> nodes. */
var formulaToChildNodes = function (formula, variables) {
    var parts = formula.split(/__\d+__/g);
    var result = [];
    angular.forEach(parts, function (variableOrText) {
        var match = variableOrText.match(/^__(\d+)__$/);
        if (match) {
            var variable = variableOrText;
            var index = parseInt(match[1]);
            var node = createSpanNode(index, variables[variable]);
        } else {
            var text = variableOrText;
            var node = document.createTextNode(text);
        }
        this.push(node);
    }, result)
    return result;
}


/** Create a sepcially crafted span element from a variable definition */
var createSpanNode = function(variable, value) {
    var span = document.createElement('span');
    span.appendChild(document.createTextNode(value.data.name));
    span.className = 'indicator-formula indicator-formula-selected';
    span.contentEditable = false;
    span.data = {
        variable: variable,
    };

    return span;
}


angular.module('pcApp.metrics.directives.formula', ['pcApp.indicators.services.indicator'])

    .directive('pcFormulaEditor', [function(){
        return {
            restirct: 'A',
            scope: {
                formula: '=',
                variables: '=',
            },
            link: function ($scope, element, attrs) {
                $scope.formula = $scope.formula || ' ';
                $scope.variables = $scope.variables || {};

                element.attr('contenteditable', 'true');
                element.bind('blur keyup change', function(event) {
                    var editableDiv = event.target;
                    var selection = window.getSelection();
                    $scope.cursorNode = selection.anchorNode;
                    $scope.cursorNodeOffset = selection.anchorOffset;

                    $scope.$apply(function () {
                        $scope.formula = childNodesToFormula(element[0].childNodes);
                    });
                });

                angular.forEach(
                    formulaToChildNodes($scope.formula, $scope.variables),
                    function (node) { this.appendChild(node)},
                    element[0]
                );

                var addIndicatorAtCursor = function(element, indicator) {
                    var editableDiv = element[0];
                    var offset = $scope.cursorNodeOffset;

                    // split node under cursor at offset or insert new text node
                    // with space after node
                    var prefixNode = $scope.cursorNode || editableDiv.lastChild;

                    if (!prefixNode || prefixNode === editableDiv) {
                        var prefixNode = document.createTextNode(' ');
                        editableDiv.insertBefore(prefixNode, null);
                    }

                    if (prefixNode.wholeText.length === offset) {
                        var postfixNode = document.createTextNode(' ');
                        editableDiv.insertBefore(postfixNode, prefixNode.nextSibling);
                    } else {
                        var postfixNode = prefixNode.splitText(offset);
                    }

                    var index = Object.keys($scope.variables).length + 1;
                    var variable = '__' + index + '__';
                    $scope.variables[variable] = {
                        type: 'indicator',
                        id: indicator.id,
                        data: indicator,
                    };

                    var span = createSpanNode(variable, $scope.variables[variable]);
                    editableDiv.insertBefore(span, postfixNode);

                    // set cursor after inserted div
                    var selection = window.getSelection();
                    var range = document.createRange();
                    range.setStart(postfixNode, 1);
                    range.setEnd(postfixNode, 1);
                    selection.removeAllRanges();
                    selection.addRange(range);
                };

                $scope.$on('AddIndicator', function(event, indicator) {
                    addIndicatorAtCursor(element, indicator);
                    $scope.formula = childNodesToFormula(element[0].childNodes);
                });
            }
        }
    }])

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

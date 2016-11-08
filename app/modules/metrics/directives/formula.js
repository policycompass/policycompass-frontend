angular.module('pcApp.metrics.directives.formula', ['pcApp.indicators.services.indicator'])

    .directive('pcFormulaEditor', [function(){
        /** Implements basic equation editor inside an element.
         *
         * This code basically implements the editor reqlying on jQuery or
         * jqlite (angular). The formula is presented as a series of <span>s.
         * There are text-<span>s and variable-<span>s. Texts are content
         * editable, while variables are added via the addVariable element.
         * Every variable element is surrunded by two text elements.
         *
         * If you are asked to maintain this: RUN!!
         */
        return {
            restirct: 'A',
            scope: {
                formula: '=',
                variables: '='
            },
            link: function ($scope, element, attrs) {
                $scope.formula = $scope.formula || '';
                $scope.variables = $scope.variables || {};

                var setCursor = function (element, atEnd) {
                    /** Set cursor to the given jq-element (or its first textnode child). */
                    var selection = window.getSelection();
                    var range = document.createRange();
                    var position;

                    if (atEnd) {
                        position = element.text().length;
                    } else {
                        position = 0;
                    }

                    var target = element[0];
                    // if target as an elment and has a text child select that one instead
                    if (target.hasChildNodes() && target.childNodes[0].nodeType === 3) {
                        target = target.childNodes[0];
                    }

                    range.setStart(target, position);
                    range.setEnd(target, position);
                    selection.removeAllRanges();
                    selection.addRange(range);
                };

                /** Translate a group of text and <span> node into a formula string. */
                var childNodesToFormula = function(childNodes) {
                    var result = [];
                    angular.forEach(childNodes, function (node) {
                        if (node.dataset.variable){
                            result.push(node.dataset.variable);
                        } else {
                            result.push(node.textContent);
                        }
                    });
                    return result.join(' ');
                };


                /** Translate a fromula string into a list of text and <span> nodes. */
                var formulaToChildNodes = function (formula, variables) {
                    var parts = formula.split(/(__\d+__)/g);
                    var result = [];
                    angular.forEach(parts, function (variableOrText) {
                        var node;
                        if  (!variableOrText) {
                            return;
                        }

                        var isVariable = variableOrText.match(/^__\d+__$/);
                        if (isVariable) {
                            var variable = variableOrText;
                            var node = createVariableNode(variable, variables[variable]);
                        } else {
                            var text = variableOrText;
                            var node = createTextNode(text);
                        }
                        this.push(node);
                    }, result);
                    result.push(createTextNode());
                    return result;
                };

                var createTextNode = function(text) {
                    var span = angular.element('<span>');
                    span.attr('contenteditable', true);
                    span.text(text);
                    span.addClass('text-formula');

                    span.bind('keydown', function(event) {
                        var selection = window.getSelection();
                        var deleteNode, text;
                        if (event.keyCode === 46 && selection.anchorOffset === span.text().length) {
                            // pressed delete at last position
                            deleteNode = span.next();

                            if (deleteNode && deleteNode.data('variable')) {
                                deleteNode.remove();
                                event.preventDefault();

                                var nextTextNode = span.next();
                                if (nextTextNode) {
                                    text = nextTextNode.text();
                                    nextTextNode.remove();
                                    span.append(text);
                                }
                            }
                        } else if (event.keyCode ===  8 && selection.anchorOffset === 0) {
                            // pressed backspace at first position
                            deleteNode = span.prev();

                            if (deleteNode && deleteNode.data('variable')) {
                                deleteNode.remove();
                                event.preventDefault();

                                var prevTextNode = span.prev();
                                if (prevTextNode) {
                                    text = prevTextNode.text();
                                    var spanText = span.text();
                                    prevTextNode.remove();
                                    span.prepend(text);

                                    if (!spanText) {
                                        // only if span was empty, the cursor needs to be placed again
                                        setCursor(span, true);
                                    }
                                }
                            }
                        } else if(event.keyCode === 39 && selection.anchorOffset === span.text().length) {
                            // pressed right arrow at last position
                            if (span.next()) {
                                setCursor(span.next().next());
                                event.preventDefault();
                            }
                        } else if(event.keyCode === 37 && selection.anchorOffset === 0) {
                            // pressed left error at first position
                            if (span.prev()) {
                                setCursor(span.prev().prev(), true);
                                event.preventDefault();
                            }
                        }

                    });

                    span.bind('focus', function (event) {
                        span.parent().addClass('focused');
                    });

                    span.bind('blur', function(event){
                        span.parent().removeClass('focused');
                    });

                    span.bind('keyup focus blur', function(event) {
                        var editableDiv = element[0];
                        var selection = window.getSelection();

                        if (selection.anchorNode != editableDiv) {
                            $scope.cursorNode = selection.anchorNode;
                            $scope.cursorNodeOffset = selection.anchorOffset;
                        }

                        $scope.formula = childNodesToFormula(element.children());
                    });

                    return span;
                };


                /** Create a sepcially crafted span element from a variable definition */
                var createVariableNode = function(variableName, variableValue) {
                    var span = angular.element('<span>');
                    var label;
                    if (variableValue.type === 'dataset') {
                        label = variableValue.dataset.name;
                    } else if (variableValue.type === 'indicator') {
                        label = variableValue.indicator.name;
                    }
                    span.addClass('indicator-formula').addClass('indicator-formula-selected');
                    span.attr('contenteditable', false);
                    span.attr('data-variable', variableName);
                    span.attr('data-label', label);
                    span.text(label);

                    span.click(function () {
                        setCursor(span.next());
                    });

                    return span;
                };


                element.empty().append(formulaToChildNodes($scope.formula, $scope.variables));

                var addVariableAtCursor = function(element, variable) {
                    var editableDiv = element[0];
                    var textOffset = $scope.cursorNodeOffset;
                    var currentElement;

                    if (!$scope.cursorNode) {
                        currentElement = element.children().last();
                    } else {
                        currentElement = angular.element($scope.cursorNode).closest('span');
                    }

                    // split current text node
                    var text = currentElement.text();
                    currentElement.text(text.slice(0, textOffset));
                    var nextElement = createTextNode(text.slice(textOffset));
                    currentElement.after(nextElement);

                    // add new textnode
                    var index = Object.keys($scope.variables).length + 1;
                    var variableName = '__' + index + '__';
                    $scope.variables[variableName] = variable;
                    var variableElement = createVariableNode(variableName, variable);
                    currentElement.after(variableElement);

                    // set cursor after inserted div
                    setCursor(nextElement);
                };

                $scope.$on('AddVariable', function(event, variable) {
                    addVariableAtCursor(element, variable);
                    $scope.formula = childNodesToFormula(element.children());
                });
            }
        };
    }])

    .directive('formula', [
        '$http', 'API_CONF', '$q', function ($http, API_CONF, $q) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    formula: '=formula',
                    variables: '=variables'
                },
                template: function (scope) {
                    return '<div style="min-height: 77px;" class="calculation-formula calculation-formula-2"></div>';
                },
                link: function (scope, element, attrs) {

                    var parseFormula = function () {
                        var variable;
                        if (scope.formula) {
                            var parsedFormula = scope.formula;
                            if (angular.isObject(scope.variables)) {
                                variables = scope.variables;
                            } else {
                                variables = JSON.parse(scope.variables.replace(/'/g, '"'));
                            }
                            var urlCalls = [];
                            angular.forEach(variables, function (value, key, obj) {
                                var index = scope.formula.indexOf(key.replace(' ', ''));
                                if (index > -1) {
                                    var url;
                                    if (value.type === 'indicator') {
                                         url = API_CONF.INDICATOR_SERVICE_URL + "/indicators/" + value.id;
                                    } else {
                                         url = API_CONF.DATASETS_MANAGER_URL + "/datasets/" + value.id;
                                    }
                                    urlCalls.push($http({
                                        url: url,
                                        method: "GET"
                                    }).then(function (response) {
                                        return {
                                            response: response,
                                            key: key,
                                            type: value.type
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
                                    var label;
                                    if (value.type === 'indicator') {
                                        label = value.response.data.name;
                                    } else {
                                        label = value.response.data.title;
                                    }

                                    var span = '<span id="variable' + variable + '" class="indicator-formula indicator-formula-selected">' +  label + '</span>';
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

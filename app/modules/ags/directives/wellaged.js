SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(toElement) {
    return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
};

angular.module('pcApp.ags.directives.wellaged', [])
    .directive('wellaged', [
        function() {
            return {
                restrict: 'AEC',
                scope: {
                    graph: '=',
                    editor: '=?',
                    model: '@',
                    mode: '@'
                },
                controller: function($scope) {
                    $scope.editor = WellAgEd.createEditor(".wellaged-editor");

                    $scope.editor.on('node:pointerclick', function(nodeView) {
                        $scope.selectedNode = nodeView;

                        // Need to force $scope update here.
                        $scope.$apply();
                    });

                    $scope.$watch('graph', function(newGraph, oldGraph) {
                        if ($scope.editor && newGraph) {
                            $scope.editor.graphFromYAML(newGraph);
                        }
                    });

                    $scope.addArgument = function() {
                        $scope.editor.addArgument("Argument");
                    };

                    $scope.addIssue = function() {
                        $scope.editor.addIssue("Issue");
                    };
                    $scope.addStatement = function() {
                        $scope.editor.addStatement("Statement");
                    };

                    $scope.runAutoLayout = function() {
                        $scope.editor.doAutoLayout();
                    };

                    $scope.runCarneades = function() {
                        $scope.editor.runCarneades();
                    };

                    $scope.deleteNode = function() {
                        $scope.editor.deleteNode($scope.selectedNode);
                    };

                    $scope.clear = function() {
                        $scope.editor.clear();
                    };

                    $scope.changeLabel = function(){
                        if(typeof $scope.selectedNode.model.attributes.text !== 'undefined'){
                            $scope.selectedNode.model.trigger('change:text');
                        }
                    }
                },
                link: function(scope, element, attrs) {
                    scope._editorEl = element[0].querySelector('.wellaged-editor');
                },
                templateUrl: "modules/ags/partials/_wellaged.html"
            };
        }
    ]);

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

                    var schemes = [{'name': 'convergent', 'checked': false}, {'name':'cumulative', 'checked': false}, {'name':'factorized', 'checked': false}, {'name':'linked', 'checked': true}];

                    var prepareSchemes = function(){
                        var newSchemes = [];
                        for(var i=0; i<schemes.length; i++){
                            newSchemes.push(schemes[i]);
                        }
                        $scope.editor.graph.getElements()[$scope.editor.graph.getElements().length-1].set('schemes', newSchemes);
                    }

                    $scope.changeScheme = function(scheme){
                        /*
                        if(typeof $scope.selectedNode.model.get('scheme') !== 'undefined'){
                            $scope.selectedNode.model.set('text', $scope.selectedNode.model.get('text').split(':').shift());
                        }
                        $scope.selectedNode.model.set('text', $scope.selectedNode.model.get('text') + ':' + scheme[0].name);
                        $scope.selectedNode.model.trigger('change:text');
                        */
                        $scope.selectedNode.model.set('selectedScheme', scheme);
                        $scope.selectedNode.model.set('scheme', scheme[0].name);
                    }
                },
                link: function(scope, element, attrs) {
                    scope._editorEl = element[0].querySelector('.wellaged-editor');
                },
                templateUrl: "modules/ags/partials/_wellaged.html"
            };
        }
    ]);

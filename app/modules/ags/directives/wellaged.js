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
                        prepareSchemes();
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
                        prepareNewSchemes();
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

                    var prepareNewSchemes = function(){
                        var newSchemes = [];
                        for(var i=0; i<schemes.length; i++){
                            newSchemes.push({'name':schemes[i].name, 'checked':schemes[i].checked});
                        }
                        $scope.editor.graph.getElements()[$scope.editor.graph.getElements().length-1].set('schemes', newSchemes);
                    }

                    var prepareSchemes = function(){
                        for(var i=0;i<$scope.editor.graph.getElements().length;i++){
                            if(typeof $scope.editor.graph.getElements()[i].get('scheme') !== 'undefined'){
                                newSchemes = [];
                                for(var j=0;j<schemes.length;j++){
                                    if($scope.editor.graph.getElements()[i].get('scheme') == schemes[j].name){
                                        newSchemes.push({'name': schemes[j].name, 'checked': true});
                                    }else{
                                        newSchemes.push({'name': schemes[j].name, 'checked': false});
                                    }
                                }
                                $scope.editor.graph.getElements()[i].set('schemes', newSchemes);
                            }
                        }
                    }

                    $scope.updateSelectedScheme = function(schemeIndex, argument){
                        angular.forEach(argument.get('schemes'), function(scheme, index){
                            var resetSelected = false;
                            if(schemeIndex != index){
                                scheme.checked = false;
                            }
                            else{
                                scheme.checked = !scheme.checked;
                                if(scheme.checked){
                                    argument.set('scheme', scheme.name);
                                }else{
                                    resetSelected = true;
                                }
                            }
                            if(resetSelected){
                                argument.set('scheme', '');
                            }
                        });
                    }

                    $(window).load(function(){
                       prepareSchemes();
                    });

                },
                link: function(scope, element, attrs) {
                    scope._editorEl = element[0].querySelector('.wellaged-editor');
                },
                templateUrl: "modules/ags/partials/_wellaged.html"
            };
        }
    ]);

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
                    mode: '@'
                },
                controller: function($scope) {
                    window.ssss = $scope;
                    $scope.editor = WellAgEd.createEditor(".wellaged-editor");

                    $scope.$watch('graph', function(newGraph, oldGraph) {
                        $scope.editor.graphFromYAML(newGraph);
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

                    $scope.clear = function() {
                        $scope.editor.clear();
                    };
                },
                link: function(scope, element, attrs) {
                    scope._editorEl = element[0].querySelector('.wellaged-editor');
                },
                templateUrl: "modules/ags/partials/_wellaged.html"
            };
        }
    ]);

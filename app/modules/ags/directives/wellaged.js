SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(toElement) {
  return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
};

angular.module('pcApp.ags.directives.wellaged', [])
    .directive('wellaged', [
        function() {
            return {
                restrict: 'AEC',
                scope: {
                    graph: '='
                },
              controller: function($scope) {
                window.ssss = $scope;
                $scope.editor = WellAgEd.createEditor(".wellaged-editor");

                $scope.$watch('graph', function(newGraph, oldGraph) {
                  $scope.editor.graphFromYAML(newGraph);
                });


              },
                link: function(scope, element, attrs) {
                  scope._editorEl = element[0].querySelector('.wellaged-editor');
                },
                templateUrl: "modules/ags/partials/_wellaged.html"
            };
        }
    ]);

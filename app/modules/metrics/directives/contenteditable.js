angular.module('pcApp.metrics.directives.contenteditable', [

])

.directive("contenteditable", function() {
  return {
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

    function read() {
      ngModel.$setViewValue(element.html());
    }

    ngModel.$render = function() {
      element.html(ngModel.$viewValue || "");
  	};

    element.bind("blur keyup change click", function() {
      scope.$apply(read);
    });
    }
  };
});
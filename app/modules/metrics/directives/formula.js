angular.module('pcApp.metrics.directives.formula', [

])

.directive('formula', ['$http', 'API_CONF', '$q', function ($http,  API_CONF, $q) {

    return {
        restrict: 'E',
        replace: true,
        scope: {
        	formula: '=formula',
        	variables: '=variables',
        },
        template: function(scope) {
        	return '<div class="calculation-formula calculation-formula-2"></div>';
        },
        link: function(scope, element, attrs) {

            var parseFormula = function() {
                var parsedFormula = scope.formula;
                if(angular.isObject(scope.variables)){
                    var variables = scope.variables;
                }
                else{
                    var variables = JSON.parse(scope.variables.replace(/'/g, '"'));
                }
                var urlCalls = [];
                angular.forEach(variables, function(value, key, obj) {
                    var index = scope.formula.indexOf(key.replace(' ', ''));
                    if(index > -1) {
                        var url = API_CONF.INDICATOR_SERVICE_URL + "/indicators/" + value.id;
                        urlCalls.push($http.get(url));
                        parsedFormula = parsedFormula.replace(key.replace(' ', ''), " __" + value.id + "__ ");
                    }
                });
                var deferred = $q.defer();
                $q.all(urlCalls)
                .then(
                function(results) {
                    angular.forEach(results, function(value, key, obj){
                        parsedFormula = parsedFormula.replace("__" + value.data.id + "__", '<span class="indicator-formula indicator-formula-selected">' + value.data.name + '</span>');
                    });
                    element.empty();
                    element.append(parsedFormula);
                },
                function(errors) {
                    deferred.reject(errors);
                },
                function(updates) {
                    deferred.update(updates);
                });
            };

            scope.$watch('formula', function() {
                parseFormula();
            });
        }
    };
}]);
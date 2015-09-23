angular.module('pcApp.metrics.directives.datasetSelect', [

])

.directive('datasetSelect', ['$http', 'API_CONF', '$q', function ($http,  API_CONF, $q) {

    return {
        restrict: 'E',
        replace: true,
        scope: {
        	indicator: '=indicator',
            model: '='
        },
        template: function(scope) {
        	return '<select name="dataset" class="form-control" ng-model="model" ng-options="d.id as d.title for d in datasets"></select>';
        },
        link: function(scope, element, attrs) {

            var url = API_CONF.DATASETS_MANAGER_URL + "/datasets?indicator_id" + scope.indicator;

            $http.get(url).
            then(function(response) {
                /*scope.datasets = response.data.results;
                console.log(scope.datasets);*/

            }, function(response) {
                console.log('error');
                console.log(response);
            });


        }
    };
}]);
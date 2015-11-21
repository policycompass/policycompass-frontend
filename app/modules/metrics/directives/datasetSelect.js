angular.module('pcApp.metrics.directives.datasetSelect', [])

    .directive('datasetSelect', [
        '$http', 'API_CONF', '$q', '$compile', function ($http, API_CONF, $q, $compile) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    indicator: '=',
                    dataset: '=',
                    variable: '='

                },
                template: function (scope) {
                    return '<select class="form-control" data-name="{variable}" data-ng-model="dataset" data-ng-options="d.id as d.title for d in datasets" required>' + '<option value="" selected>Choose Dataset</option>' + '</select>';
                },
                link: function (scope, element, attrs) {

                    var url = API_CONF.DATASETS_MANAGER_URL + "/datasets?indicator_id=" + scope.indicator;

                    $http.get(url).then(function (response) {
                        scope.datasets = response.data.results;
                    }, function (response) {
                        console.log(response);
                    });
                }
            };
        }
    ]);

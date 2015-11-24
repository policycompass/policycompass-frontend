angular.module('pcApp.metrics.directives.indicator', [])

    .directive('indicator', [
        '$http', 'API_CONF', '$q', function ($http, API_CONF, $q) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    indicator: '=',
                },
                template: function (scope) {
                    return '<span class="indicator-formula indicator-formula-selected">{{ name }}</span>';
                },
                link: function (scope, element, attrs) {

                    var url = API_CONF.INDICATOR_SERVICE_URL + "/indicators/" + scope.indicator;

                    $http.get(url).then(function (response) {
                        scope.name = response.data.name;

                    }, function (response) {
                        console.log('error');
                        console.log(response);
                    });


                }
            };
        }
    ]);

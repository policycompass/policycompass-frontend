angular.module('pcApp.metrics.directives.functionsTable', [])
    .directive('functionsTable', [
        '$http', 'NormalizerService', function ($http, NormalizerService) {

            return {
                restrict: 'E',
                replace: 'true',
                templateUrl: 'modules/metrics/partials/functions-table.html',
                link: function (scope, element, attrs) {

                    NormalizerService.query(function (functions)
                        {
                            scope.functions = functions;
                        },
                        function (err)
                        {
                            throw {message: JSON.stringify(err.data)};
                        }
                    );

                }
            };
        }
    ]);

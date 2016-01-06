angular.module('pcApp.metrics.directives.functionsTable', [])
    .directive('functionsTable', [
        '$http', 'NormalizerService', function ($http, NormalizerService) {

            return {
                restrict: 'E',
                replace: 'true',
                template:'\
                    <div class="well">\
                        <div class="row">\
                            <div class="col-lg-12">\
                                <table class="table table-hover">\
                                    <thead>\
                                        <tr>\
                                            <th>Name</th>\
                                            <th>Description</th>\
                                            <th>Arguments</th>\
                                            <th>Acronym</th>\
                                        </tr>\
                                    </thead>\
                                <tbody>\
                                    <tr ng-repeat="function in functions">\
                                        <td>{{ function.name }}</td>\
                                        <td>{{ function.description }}</td>\
                                        <td>\
                                            <p ng-repeat="argument in function.arguments">{{$index + 1}}. {{ argument.name }} ({{ argument.type }})</p>\
                                        </td>\
                                        <td>{{ function.acronym }}</td>\
                                    </tr>\
                                </tbody>\
                            </table>\
                        </div>\
                    </div>\
                </div>',
                link: function (scope, element, attrs) {

                    NormalizerService.query(function (functions)
                        {
                            scope.functions = functions;
                        },
                        function (err)
                        {
                            throw {message: JSON.stringify(err.data)
                        };
                    });

                }
            };
        }
    ]);
angular.module('pcApp.auth.directives.loginRegister', [
    'pcApp.auth.services.auth',
])

    .directive('login', function () {
        return {
            restrict: 'E',
            templateUrl: 'modules/auth/partials/login.html'
        };
    })
    .directive('register', function () {
        return {
            restrict: 'E',
            templateUrl: 'modules/auth/partials/register.html'
        };
    })
    .directive('passwordReset', function () {
        return {
            restrict: 'E',
            templateUrl: 'modules/auth/partials/passwordReset.html'
        };
    })
    .directive("passwordVerify", function() {
        return {
            require: "ngModel",
            scope: {
                passwordVerify: '='
            },
            link: function(scope, element, attrs, ctrl) {
                scope.$watch(function() {
                    var combined;

                    if (scope.passwordVerify || ctrl.$viewValue) {
                        combined = scope.passwordVerify + '_' + ctrl.$viewValue;
                    }
                    return combined;
                }, function(value) {
                    if (value) {
                        ctrl.$parsers.unshift(function(viewValue) {
                            var origin = scope.passwordVerify;
                            if (origin !== viewValue) {
                                ctrl.$setValidity("passwordVerify", false);
                                return undefined;
                            } else {
                                ctrl.$setValidity("passwordVerify", true);
                                return viewValue;
                            }
                        });
                    }
                });
            }
        };
    });

angular.module('pcApp.auth.directives.userIndicator', [
    'pcApp.auth.services.auth',
])

    .directive('userIndicator', [
        'Auth', function (Auth) {
            return {
                restrict: 'E',
                scope: {},
                controller: function ($scope) {
                    $scope.state = Auth.state
                },
                templateUrl: "modules/auth/partials/userIndicator.html"
            };
        }
    ]);

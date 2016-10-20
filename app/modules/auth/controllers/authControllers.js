angular.module('pcApp.auth.controllers.authControllers', [
    'pcApp.auth.services.auth',
])

    .controller('UserState', [
        '$scope', 'Auth', function ($scope, Auth) {
            $scope.authState = Auth.state;
            $scope.auth = Auth
        }
    ])
    .controller('RegisterController', [
        '$scope', '$location', 'Auth', function ($scope, $location, Auth) {
            $scope.goToLogin = function ( path ) {
                $location.path('/login');
            };

            $scope.$submitted = false;

            $scope.register = function () {
                $scope.$submitted = true;

                if (!$scope.registerForm.$valid) {
                    return false
                }

                Auth.register(
                    $scope.name,
                    $scope.email,
                    $scope.password
                ).then(function () {
                    $scope.completed = true;
                }, function (response) {
                    try {
                        $scope.serverErrors = response.data.errorDict
                    } catch (e) {
                        $scope.serverErrors.$other = 'Unknown error.';
                        throw e;
                    }
                })
            };
        }
    ])
    .controller('LoginController', [
        '$scope', '$location',  'Auth', function ($scope, $location, Auth) {
            $scope.goToPasswordReset = function ( path ) {
                $location.path('/password_reset');
            };

            $scope.$submitted = false;
            $scope.serverErrors = {}

            $scope.login = function () {
                $scope.$submitted = true;

                if (!$scope.loginForm.$valid) {
                    return false
                }

                Auth.login(
                    $scope.nameOrEmail,
                    $scope.password
                ).then(function (previousLocation) {
                    $location.url(previousLocation);
                }).catch(function (response) {
                    try {
                        $scope.serverErrors = response.data.errorDict;
                    } catch (e) {
                        $scope.serverErrors.$other = 'Unknown error.';
                        throw e;
                    }
                });
            };
        }
    ])
    .controller('ResetPasswordController', [
        '$scope', 'Auth', function ($scope, Auth) {
            $scope.$submitted = false;
            $scope.serverErrors = {}
            $scope.completed = false;

            $scope.resetPassword = function () {
                $scope.$submitted = true;

                if (!$scope.resetPasswordForm.$valid) {
                    return false
                }

                Auth.resetPassword($scope.email)
                    .then(function () {
                        $scope.completed = true;
                    }).catch(function (response) {
                        try {
                            $scope.serverErrors = response.data.errorDict;
                        } catch (e) {
                            $scope.serverErrors.$other = 'Unknown error.';
                            throw e;
                        }
                    });

                return true;
            };
        }
    ])

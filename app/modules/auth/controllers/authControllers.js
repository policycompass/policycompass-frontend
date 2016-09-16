
/** Unpack errors from A3 response. Unpacks A3 errors related
 *  to request body into an object of errors, with field names
 *  as keys.
 */
var adhocracyErrorsToDict = function (response) {
    if (response.data.status == 'error') {
        var processedErrors = {}
        var serverErrors = response.data.errors
        for (errorIndex in serverErrors) {
            if (serverErrors.hasOwnProperty(errorIndex)) {
                var error = serverErrors[errorIndex];
                if (error.location = 'body') {
                    simpleName = error.name.split('.').pop();
                    processedErrors[simpleName] = error.description;
                }
            }
        }
        return { pc_errors: processedErrors };
    }
    throw response;
}


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
                    var errors = adhocracyErrorsToDict(response);
                    $scope.serverErrors = errors.pc_errors;
                })
            };
        }
    ])
    .controller('LoginController', [
        '$scope', '$location',  'Auth', function ($scope, $location, Auth) {
            $scope.goToRegister = function ( path ) {
                $location.path('/register');
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
                    var errors = adhocracyErrorsToDict(response);
                    $scope.serverErrors = errors.pc_errors;
                })
            };
        }
    ]);

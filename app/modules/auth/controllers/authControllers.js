angular.module('pcApp.auth.controllers.authControllers', [
    'pcApp.auth.services.auth',
])

.controller('UserState', ['$scope', 'Auth', function ($scope, Auth) {
    $scope.authState = Auth.state;
}]);

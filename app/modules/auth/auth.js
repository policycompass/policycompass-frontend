var auth = angular.module('pcApp.auth', [
    'pcApp.auth.services.auth',
    'pcApp.auth.controllers.authControllers',
    'pcApp.auth.directives.login'
]);

auth.config(function ($routeProvider) {
    $routeProvider
        .when('/login', {
            template: '<login></login>'
        })
        .when('/register', {
            template: '<register></register>'
        })
        .when('/logout', {
            template: '<div class="container"><h2>Logout</h2>Please log out by clicking on the logout link below:</div><adh-user-indicator></adh-user-indicator>'
        });
});

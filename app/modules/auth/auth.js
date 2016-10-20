var auth = angular.module('pcApp.auth', [
    'pcApp.auth.services.auth',
    'pcApp.auth.controllers.authControllers',
    'pcApp.auth.directives.loginRegister'
]);

auth.config(function ($routeProvider) {
    $routeProvider
        .when('/login', {
            template: '<login></login>'
        })
        .when('/register', {
            template: '<register></register>'
        })
        .when('/password_reset',{
            template: '<password-reset></password-reset>'
        });
});

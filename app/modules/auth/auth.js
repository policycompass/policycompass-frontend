var auth = angular.module('pcApp.auth', [
    'pcApp.auth.services.auth',
    'pcApp.auth.directives.login',
    'pcApp.auth.directives.userIndicator',
]);

auth.config(function($routeProvider) {
    $routeProvider
        .when('/login', {
            template: '<login></login>'
        })
        .when('/register', {
            template: '<register></register>'
        })
        .when('/logout', {
            template: '<adh-user-indicator></adh-user-indicator>'
        });
});

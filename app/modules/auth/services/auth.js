angular.module('pcApp.auth.services.auth', [
    'pcApp.adhocracyEmbedder.services.adhocracy'
])

.factory('Auth', ['Adhocracy', '$rootScope', '$http', '$location', function (Adhocracy, $rootScope, $http, $location) {

    var Auth = {
        state: {
            loggedIn: undefined,
            username: undefined,
            userData: undefined
        },

        // NOTE: _login and _logout are only meant to be called through
        // the AdhocracySDK.

        _login: function (userData, token, userPath) {
            _.defer(function () {
                $rootScope.$apply(function () {
                    Auth.state.loggedIn = true;
                    Auth.state.userData = userData;

                    $http.defaults.headers.common["X-User-Token"] = token;
                    $http.defaults.headers.common["X-User-Path"] = userPath;
                });
            });
        },

        _logout: function () {
            _.defer(function () {
                $rootScope.$apply(function () {
                    Auth.state.loggedIn = false;
                    Auth.state.UserData = undefined;

                    delete $http.defaults.headers.common["X-User-Token"];
                    delete $http.defaults.headers.common["X-User-Path"];
                });
            });
        }
    };

    Adhocracy.then(function (adh) {
        adh.registerMessageHandler('login', function (data) {
            Auth._login(data.userData, data.token, data.userPath);

            if (($location.path() === '/login') || ($location.path() === '/register')) {
                $location.path('/');
            }
        });
        adh.registerMessageHandler('logout', function (data) {
            Auth._logout();

            if ($location.path() === '/logout') {
                $location.path('/');
            }
        });
    });

    return Auth;
}]);

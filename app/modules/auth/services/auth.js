angular.module('pcApp.auth.services.auth', [
    'pcApp.adhocracyEmbedder.services.adhocracy'
])

.factory('Auth', ['Adhocracy', '$rootScope', '$http', function (Adhocracy, $rootScope, $http) {

    var Auth = {
        state: {
            loggedIn: undefined,
            username: undefined,
            userData: undefined
        },

        login: function (userData, token, userPath) {
            $rootScope.$apply(function () {
                Auth.state.loggedIn = true;
                Auth.state.userData = userData;

                $http.defaults.headers.common["X-User-Token"] = token;
                $http.defaults.headers.common["X-User-Path"] = userPath;
            });
        },

        logout: function () {
            $rootScope.$apply(function () {
                Auth.state.loggedIn = false;
                Auth.state.UserData = undefined;

                delete $http.defaults.headers.common["X-User-Token"];
                delete $http.defaults.headers.common["X-User-Path"];
            });
        }
    };

    Adhocracy.then(function (adh) {
        adh.registerMessageHandler('login', function (data) {
            Auth.login(data.userData, data.token, data.userPath);
        });
        adh.registerMessageHandler('logout', function (data) {
            Auth.logout();
        });
    });

    return Auth;
}]);

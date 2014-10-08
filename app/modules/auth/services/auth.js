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
    };

    Adhocracy.then(function (adh) {
        adh.registerMessageHandler('login', function (data) {
            $rootScope.$apply(function () {
                Auth.state.loggedIn = true;
                Auth.state.userData = data.userData;

                $http.defaults.headers.common["X-User-Token"] = data.token;
                $http.defaults.headers.common["X-User-Path"] = data.userPath;

            });
        });
        adh.registerMessageHandler('logout', function (data) {
            $rootScope.$apply(function () {
                Auth.state.loggedIn = false;
                Auth.state.UserData = undefined;

                delete $http.defaults.headers.common["X-User-Token"];
                delete $http.defaults.headers.common["X-User-Path"];
            });
        });
    });

    return Auth;
}]);

angular.module('pcApp.auth.services.auth', [
    'pcApp.adhocracyEmbedder.services.adhocracy'
])

.factory('Auth', ['Adhocracy', 'API_CONF', '$rootScope', '$http', '$location', '$q', function (Adhocracy, API_CONF, $rootScope, $http, $location, $q) {

    var Auth = {
        state: {
            loggedIn: undefined,
            userData: undefined,
            isAdmin: undefined
        },

        // NOTE: _login and _logout are only meant to be called through
        // the AdhocracySDK.

        _login: function (userData, token, userPath) {
            // FIXME: Due to liqd/adhocracy3#1635, we cannot use userData, but
            // need to fetch the user object manually again here. This can be
            // removed once that is fixed.
            $q.all([
                $http.get(userPath),
                $http.get(API_CONF.ADHOCRACY_BACKEND_URL + "/principals/groups/gods/")
            ]).then(function (responses) {
                var user = responses[0].data;
                var username = user.data["adhocracy_core.sheets.principal.IUserBasic"].name;
                var godsGroup = responses[1].data;
                var godsGroupSheet = godsGroup.data["adhocracy_core.sheets.principal.IGroup"];
                var isAdmin = (_.contains(godsGroupSheet.roles, "god") && _.contains(godsGroupSheet.users, userPath));

                _.defer(function () {
                    $rootScope.$apply(function () {
                        Auth.state.loggedIn = true;
                        if (typeof userData !== "undefined") {
                            Auth.state.userData = userData;
                        } else {
                            Auth.state.userData = {
                                name: username
                            };
                        }
                        Auth.state.isAdmin = isAdmin;

                        $http.defaults.headers.common["X-User-Token"] = token;
                        $http.defaults.headers.common["X-User-Path"] = userPath;
                    });
                });
            });
        },

        _logout: function () {
            _.defer(function () {
                $rootScope.$apply(function () {
                    Auth.state.loggedIn = false;
                    Auth.state.userData = undefined;
                    Auth.state.isAdmin = false;

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

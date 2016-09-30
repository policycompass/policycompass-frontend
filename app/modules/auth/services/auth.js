angular.module('pcApp.auth.services.auth', [
    'pcApp.adhocracyEmbedder.services.adhocracy'
])

    .factory('Auth', [
        'Adhocracy',
        'API_CONF',
        '$rootScope',
        '$http',
        '$location',
        '$q',
        function (Adhocracy, API_CONF, $rootScope, $http, $location, $q) {

            var last = undefined;

            $rootScope.$on("$locationChangeSuccess",
                function(evt, nextUrl, prevUrl) {
                    /* FIXME: Is there a more generic way to get the path
                     * from the URL? */
                    var next = nextUrl.split("#!")[1];
                    var prev = prevUrl.split("#!")[1];

                    if ((next == "/login" || next == "/register" || next == "/logout")
                        && typeof prev !== "undefined"
                        && prev !== "/login"
                        && prev !== "/register"
                    ) {
                        last = prev;
                    }
                }
            );

            var Auth = {
                state: {
                    loggedIn: undefined,
                    userData: undefined,
                    userPath: undefined,
                    isAdmin: undefined,
                    isCreator: function(object) {
                        var a3Backend = API_CONF.ADHOCRACY_BACKEND_URL;

                        if (!this.userPath || !object) {
                            return false;
                        }

                        // userpath contains the user uri with trailing slash (despite its name)
                        var userPath = this.userPath.replace(a3Backend, '');
                        userPath = userPath.replace(/\/$/, '');
                        return userPath === object.creator_path;
                    }
                },

                // NOTE: _login and _logout are only meant to be called through
                // the AdhocracySDK.

                _login: function (userData, token, userPath) {
                    return $http.get(API_CONF.ADHOCRACY_BACKEND_URL + "/principals/groups/gods/").then(function (response) {
                        var godsGroup = response.data;
                        var godsGroupSheet = godsGroup.data["adhocracy_core.sheets.principal.IGroup"];
                        var isAdmin = (_.contains(godsGroupSheet.roles, "god") && _.contains(godsGroupSheet.users, userPath));
                        var deferred = $q.defer();

                        _.defer(function () {
                            $rootScope.$apply(function () {
                                Auth.state.loggedIn = true;
                                Auth.state.userData = userData;
                                Auth.state.userPath = userPath;
                                Auth.state.isAdmin = isAdmin;

                                $http.defaults.headers.common["X-User-Token"] = token;
                                $http.defaults.headers.common["X-User-Path"] = userPath;

                                deferred.resolve(true)
                            });
                        });

                        return deferred.promise;
                    });
                },

                _logout: function () {
                    _.defer(function () {
                        $rootScope.$apply(function () {
                            Auth.state.loggedIn = false;
                            Auth.state.userData = undefined;
                            Auth.state.userPath = undefined;
                            Auth.state.isAdmin = false;

                            delete $http.defaults.headers.common["X-User-Token"];
                            delete $http.defaults.headers.common["X-User-Path"];
                        });
                    });
                }
            };

            Adhocracy.then(function (adh) {
                adh.registerMessageHandler('login', function (data) {
                    Auth._login(data.userData, data.token, data.userPath).then(function (ready) {

                        if (($location.path() === '/login') || ($location.path() === '/register')) {
                            $location.url(last || '/');
                            last = undefined;
                        }
                    });
                });
                adh.registerMessageHandler('logout', function (data) {
                    Auth._logout();

                    if ($location.path() === '/logout') {
                        $location.path(last || '/');
                    }
                });
            });

            return Auth;
        }
    ]);

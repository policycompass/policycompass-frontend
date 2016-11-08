angular.module('pcApp.auth.services.auth', [
    'pcApp.adhocracyEmbedder.services.adhocracy'
])

    .factory('Auth', [
        'AdhocracyClient',
        'AdhocracyCrossWindowChannel',
        '$rootScope',
        '$http',
        '$localStorage',
        'API_CONF',
        function (AdhocracyClient, AdhocracyCrossWindowChannel, $rootScope,
                  $http, $localStorage, API_CONF) {
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
                }
            };

            var setupSession = function(session, userData, doNotStore) {
                token = session.token;
                userPath = session.userPath;

                // setup headers for backend communication
                $http.defaults.headers.common[AdhocracyClient.headerNames.token] = token;
                $http.defaults.headers.common[AdhocracyClient.headerNames.userPath] = userPath;

                // setup auth state
                Auth.state.loggedIn = true;
                Auth.state.userPath = userPath;

                // store session and user data to local store
                if (!doNotStore) {
                    $localStorage.token = token;
                    $localStorage.userPath = userPath;
                }

                // setup a3 session
                AdhocracyCrossWindowChannel.then(function (channel) {
                    channel.setToken(token, userPath)
                });

                setupUserData(userData, doNotStore);
            };

            var setupUserData = function (userData, doNotStore) {
                if (!doNotStore) {
                    $localStorage.userData = userData;
                }
                Auth.state.userData = userData;
                Auth.state.isAdmin = userData.roles.indexOf('admin') !== -1;
            };

            var teardownSession = function() {
                // the opposite of setup session
                delete $http.defaults.headers.common[AdhocracyClient.headerNames.token];
                delete $http.defaults.headers.common[AdhocracyClient.headerNames.userPath];

                Auth.state.loggedIn = false;
                Auth.state.userPath = undefined;
                Auth.state.userData = undefined;
                Auth.state.isAdmin = undefined;

                AdhocracyCrossWindowChannel.then(function (channel) {
                    channel.deleteToken();
                });

                delete $localStorage.token;
                delete $localStorage.userPath;
                delete $localStorage.userData;
            };

            var loadLocalSession = function() {
                if (!$localStorage.token || !$localStorage.userPath) {
                    return null
                }

                // userData will be refreshed during session validation
                var fallbackUserData = {
                    username: 'unkown user',
                    roles: [],
                    email: 'unkown email'
                };

                return {
                    session: {
                        token: $localStorage.token,
                        userPath: $localStorage.userPath
                    },
                    userData: $localStorage.userData || fallbackUserData
                }
            };

            /** Wrapper to make A3 auth features pluggable. Calls directly A3
             *  specific login code and A3 specific code to fetch user data.
             */
            Auth.login = function (nameOrEmail, password) {
                return AdhocracyClient.create_session(nameOrEmail, password)
                    .then(function (session) {
                        return AdhocracyClient.validate_session(session)
                            .then(function (userData) {
                                setupSession(session, userData);
                                beforeLogin = last || '/';
                                last = undefined;
                                return beforeLogin;
                            });
                    });
            };

            /** Wrapper to make A3 auth features pluggable. Calls directly A3
             *  specific register code.
             */
            Auth.register = function (name, email, password) {
                return AdhocracyClient.register(name, email, password)
            };

            Auth.logout = function () {
                teardownSession();
            };

            /** Reads session data from local storage and validates it against
             *  A3 backend service
             */
            Auth.recoverSession = function () {
                var local = loadLocalSession();

                if (!local) {
                    teardownSession();
                    return null;
                }

                var session = local.session;
                var userData = local.userData;
                var doNotStore = true;

                setupSession(session, userData, doNotStore);

                return AdhocracyClient.validate_session(session)
                    .then(function (userData) {
                        setupUserData(userData);
                    }, function (response) {
                        console.log("Session couldn't be validated", response);
                        teardownSession();
                    })
            };

            return Auth;
        }
    ]);

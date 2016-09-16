angular.module('pcApp.adhocracyEmbedder.services.adhocracy', [])

/**
 * Adhocracy service
 *
 * Allow to interact with the Adhocracy embed SDK.
 *
 * Currently returns a promise, because the init function is asynchronous.
 */
    .factory('Adhocracy', [
        "$q", "API_CONF", function ($q, API_CONF) {
            var deferred = $q.defer();
            $.ajax({
                url: API_CONF.ADHOCRACY_FRONTEND_URL + "/static/js/AdhocracySDK.js",
                dataType: "script",
                success: function () {
                    adhocracy.init(API_CONF.ADHOCRACY_FRONTEND_URL, function (result) {
                        deferred.resolve(result)
                    });
                }
            });
            return deferred.promise;
        }
    ])

    .factory('AdhocracyClient', [
        '$http', 'API_CONF', function($http, API_CONF) {

            var url = function(path) {
                if( typeof path !== 'string' ) {
                    path = path.join('/')
                }
                return API_CONF.ADHOCRACY_BACKEND_URL + '/' + path
            };

            var client = {};

            client.headerNames = {
                token: 'X-User-Token',
                userPath: 'X-User-Path'
            }

            client.create_session = function(usernameOrEmail, password) {
                var loginUrl, data;
                if (usernameOrEmail.indexOf('@') === -1) {
                    var username = usernameOrEmail;
                    loginUrl = url('login_username');
                    data = { name: username, password: password };
                } else {
                    var email = usernameOrEmail;
                    loginUrl = url('login_email');
                    data = { email: email, password: password };
                }

                return $http({
                    method: 'POST',
                    url: loginUrl,
                    data: data
                }).then(function (response){
                    return {
                        token: response.data.user_token,
                        userPath: response.data.user_path
                    }
                });
            };

            client.validate_session = function(session) {
                headers = {}
                headers[client.headerNames.token] = session.token
                headers[client.headerNames.userPath] = session.userPath

                return $http({
                    method: 'GET',
                    url: session.userPath,   // userPath does store the user url
                    headers: headers
                }).then(function (response) {
                    name = response.data.data['adhocracy_core.sheets.principal.IUserBasic'].name
                    roles = response.data.data['adhocracy_core.sheets.principal.IPermissions'].roles
                    email = response.data.data['adhocracy_core.sheets.principal.IUserExtended'].email
                    return {
                        name: name,
                        roles: roles,
                        email: email
                    }
                })
            };

            client.register = function(username, email, password) {
                return $http({
                    method: 'POST',
                    url: url('/principals/users/'),
                    data: {
                        "content_type": "adhocracy_core.resources.principal.IUser",
                        "data": {
                            "adhocracy_core.sheets.principal.IUserBasic": {
                                "name": username
                            },
                            "adhocracy_core.sheets.principal.IUserExtended":{
                                "email": email
                            },
                            "adhocracy_core.sheets.principal.IPasswordAuthentication":{
                                "password": password
                            }
                        }
                    }
                });
            }

            return client;
        }
    ])

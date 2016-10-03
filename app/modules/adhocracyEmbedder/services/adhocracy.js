angular.module('pcApp.adhocracyEmbedder.services.adhocracy', [])

/**
 * AdhocracySDK service
 *
 * Allow to interact with the Adhocracy embed SDK.
 *
 * Currently returns a promise, because the init function is asynchronous.
 */
    .factory('AdhocracySdk', [
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
            return deferred.promise
        }
    ])

/**
 * Adhocracy cross window channel iframe service
 *
 * Provides an iFrame that can be used to communiate with adhocracy services. Example
 * usage could be setting and deleting auth token. This iFrame will not contain UI elements.
 */
    .factory('AdhocracyCrossWindowChannelIframe', [
        'AdhocracySdk',
        function(AdhocracySdk) {
            return AdhocracySdk.then(function (adh) {
                var iframeJQuery = adh.getIframe('empty', {
                    noheader: true,
                    nocenter: true
                });
                var iframe = iframeJQuery[0]
                return iframeJQuery;
            });
        }
    ])

/**
 * Adhocracy cross window channel service
 *
 * Provides some helpers to send messages to adhocracy through the CWC iframe.
 */
    .factory('AdhocracyCrossWindowChannel', [
        'AdhocracyCrossWindowChannelIframe',
        'AdhocracySdk',
        '$q',
        function (iframePromise, adhSdkPromise, $q) {
            return $q.all([adhSdkPromise, iframePromise]).then(function(deps) {
                var adhSdk = deps[0];
                var iframe = deps[1][0]; // also unpack from jQuery object
                var defered = $q.defer();

                var channel = {iframe: iframe};
                channel.setToken = function (token, userPath) {
                    var data = {
                        token: token,
                        userPath: userPath
                    }
                    adhSdk.postMessage(this.iframe.contentWindow,'setToken', data);
                };
                channel.deleteToken = function () {
                    adhSdk.postMessage(this.iframe.contentWindow, 'deleteToken', {})
                };
                adhSdk.registerMessageHandler('requestSetup', function(data, source) {
                    defered.resolve(channel);
                });

                return defered.promise;
            });
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

            /** Unpack errors from A3 response. Unpacks A3 errors related
             *  to request body into an object of errors, with field names
             *  as keys.
             */
            var adhocracyErrorResponseTransformer = function(data) {
                if (data.status == 'error') {
                    var processedErrors = {}
                    var serverErrors = data.errors
                    for (errorIndex in serverErrors) {
                        if (serverErrors.hasOwnProperty(errorIndex)) {
                            var error = serverErrors[errorIndex];
                            if (error.location = 'body') {
                                simpleName = error.name.split('.').pop();
                                processedErrors[simpleName] = error.description;
                                }
                        }
                    }
                    data.errorDict = processedErrors
                }
                return data
            }

            var withResponseErrorTransformer = function() {
                var defaultTransformers = $http.defaults.transformResponse

                // transfomers might not be an array
                if (! angular.isArray(defaultTransformers)) {
                    defaultTransformers = [defaultTransformers];
                }

                return defaultTransformers.concat(adhocracyErrorResponseTransformer);
            }

            var client = {};

            client.headerNames = {
                token: 'X-User-Token',
                userPath: 'X-User-Path'
            }

            client.create_session = function(nameOrEmail, password) {
                var loginUrl, data;
                if (nameOrEmail.indexOf('@') === -1) {
                    var name = nameOrEmail;
                    loginUrl = url('login_username');
                    data = { name: name, password: password };
                } else {
                    var email = nameOrEmail;
                    loginUrl = url('login_email');
                    data = { email: email, password: password };
                }

                return $http({
                    method: 'POST',
                    url: loginUrl,
                    data: data,
                    transformResponse: withResponseErrorTransformer()
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
                    headers: headers,
                    transformResponse: withResponseErrorTransformer()
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

            client.register = function(name, email, password) {
                return $http({
                    method: 'POST',
                    url: url('/principals/users/'),
                    data: {
                        "content_type": "adhocracy_core.resources.principal.IUser",
                        "data": {
                            "adhocracy_core.sheets.principal.IUserBasic": {
                                "name": name
                            },
                            "adhocracy_core.sheets.principal.IUserExtended":{
                                "email": email
                            },
                            "adhocracy_core.sheets.principal.IPasswordAuthentication":{
                                "password": password
                            }
                        }
                    },
                    transformResponse: withResponseErrorTransformer()
                })
            }

            return client;
        }
    ])

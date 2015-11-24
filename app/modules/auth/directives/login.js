angular.module('pcApp.auth.directives.login', [
    'pcApp.auth.services.auth',
])

    .directive('login', [
        'Adhocracy', function (Adhocracy) {
            return {
                restrict: 'E',
                link: function (scope, element, attrs) {
                    Adhocracy.then(function (adh) {
                        element.append(adh.getIframe('login', {noheader: true}))
                    });
                }
            };
        }
    ])
    .directive('register', [
        'Adhocracy', function (Adhocracy) {
            return {
                restrict: 'E',
                link: function (scope, element, attrs) {
                    Adhocracy.then(function (adh) {
                        element.append(adh.getIframe('register', {noheader: true}))
                    });
                }
            };
        }
    ])
    .directive('adhUserIndicator', [
        'Adhocracy', function (Adhocracy) {
            return {
                restrict: 'E',
                link: function (scope, element, attrs) {
                    Adhocracy.then(function (adh) {
                        element.append(adh.getIframe('user-indicator', {noheader: true}))
                    });
                }
            };
        }
    ])
    .directive('adhCrossWindowChannel', [
        'Adhocracy', function (Adhocracy) {
            return {
                restrict: 'E',
                link: function (scope, element, attrs) {
                    Adhocracy.then(function (adh) {
                        element.append(adh.getIframe('empty', {
                            noheader: true,
                            nocenter: true
                        }))
                    });
                }
            };
        }
    ]);

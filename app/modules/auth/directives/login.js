angular.module('pcApp.auth.directives.login', [
    'pcApp.auth.services.auth',
])

.directive('login', ['Adhocracy', function (Adhocracy) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            Adhocracy.then(function (adh) {
                element.append(adh.getIframe('login', {}))
            });
        }
    };
}])
.directive('register', ['Adhocracy', function (Adhocracy) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            Adhocracy.then(function (adh) {
                element.append(adh.getIframe('register', {}))
            });
        }
    };
}])
.directive('adhUserIndicator', ['Adhocracy', function (Adhocracy) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            Adhocracy.then(function (adh) {
                element.append(adh.getIframe('user-indicator', {noheader: true}))
            });
        }
    };
}]);

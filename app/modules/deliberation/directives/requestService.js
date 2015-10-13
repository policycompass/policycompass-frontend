angular.module('pcApp.deliberation.directives.requestService', [
    'pcApp.adhocracyEmbedder.services.adhocracy',
])

.directive('requestService', ['API_CONF', 'Adhocracy', function (API_CONF, Adhocracy) {
    return {
        restrict: 'E',
        scope: {
            key: '@'
        },
        link: function(scope, element, attrs) {
            Adhocracy.then(function (adh) {
                element.append(adh.getIframe('pcompass', {
                    "initialUrl": '/r/organisation/pcompass/',
                    autoresize: false,
                    nocenter: true,
                    noheader: true,
                    locale: 'en'
                }))
            });
        }
    };
}]);


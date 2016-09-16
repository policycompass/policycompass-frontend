angular.module('pcApp.adhocracyEmbedder.directives.adhocracy', [])

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

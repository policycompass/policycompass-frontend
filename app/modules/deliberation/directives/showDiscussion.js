angular.module('pcApp.deliberation.directives.showDiscussion', [
    'pcApp.adhocracyEmbedder.services.adhocracy',
])

    .directive('showDiscussion', [
        'API_CONF', 'Adhocracy', function (API_CONF, Adhocracy) {
            return {
                restrict: 'E',
                scope: {
                    key: '@'
                },
                link: function (scope, element, attrs) {
                    Adhocracy.then(function (adh) {
                        element.append(adh.getIframe('create-or-show-comment-listing', {
                            "pool-path": API_CONF.ADHOCRACY_BACKEND_URL + '/adhocracy/',
                            key: scope.key,
                            nocenter: true,
                            noheader: true,
                            locale: 'en'
                        }))
                    });
                }
            };
        }
    ]);

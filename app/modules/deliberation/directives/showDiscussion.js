angular.module('pcApp.deliberation.directives.showDiscussion', [
    'pcApp.adhocracyEmbedder.services.adhocracy',
])

    .directive('showDiscussion', [
        'API_CONF', 'AdhocracySdk', function (API_CONF, AdhocracySdk) {
            return {
                restrict: 'E',
                scope: {
                    key: '@',
                    autoResize: '='
                },
                link: function (scope, element, attrs) {
                    var autoResize = true;
                    if(scope.autoResize == false) {
                        autoResize = false;
                    }
                    AdhocracySdk.then(function (adh) {
                        element.append(adh.getIframe('create-or-show-comment-listing', {
                            "pool-path": API_CONF.ADHOCRACY_BACKEND_URL + '/adhocracy/',
                            key: scope.key,
                            nocenter: true,
                            noheader: true,
                            autoresize: autoResize,
                            locale: 'en'
                        }))
                    });
                }
            };
        }
    ]);

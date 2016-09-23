angular.module('pcApp.adhocracyEmbedder.directives.adhocracy', [])

    .directive('adhCrossWindowChannel', [
        'AdhocracyCrossWindowChannelIframe', function (AdhocracyCrossWindowChannelIframe) {
            return {
                restrict: 'E',
                link: function (scope, element, attrs) {
                    AdhocracyCrossWindowChannelIframe.then(function(iframe) {
                        element.append(iframe);
                    });
                }
            };
        }
    ]);
